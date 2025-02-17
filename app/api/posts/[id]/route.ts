import { NextRequest, NextResponse } from "next/server";
import { supabase } from "lib/util/supabase";
import { getToken } from "next-auth/jwt";

// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers';

interface UpdatePostRequest {
  id: string;
  title: string;
  content: string;
  image_path?: string | null;
  category_id: number;
  user_id: string;
  image?: File | null;
}

// DELETEメソッドのハンドラ
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // トークン認証の追加
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // 投稿の所有者確認を追加
    const { data: post } = await supabase
      .from("posts")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!post) {
      return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
    }

    if (post.user_id !== token.sub) {
      return NextResponse.json({ error: "投稿の所有者ではありません" }, { status: 403 });
    }

    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      throw error;
    }
    return NextResponse.json({ message: `Post with ID ${id} deleted successfully` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}




// PUTメソッドのハンドラ
export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    let updateData: UpdatePostRequest;

    const contentType = req.headers.get("content-type");

    if (contentType?.includes("multipart/form-data")) {
      // imageが存在しimage_pathが存在しない場合

      const formData = await req.formData();
      // eslint-disable-next-line no-console
      console.log("formData", formData);

      const file = formData.get("image") as File;

      // Supabaseストレージへのアップロード
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("blog-images").upload(fileName, file);

      if (uploadError) {
        // eslint-disable-next-line no-console
        console.error("Upload error:", uploadError);
        return NextResponse.json({ error: "ファイルのアップロードに失敗しました" }, { status: 500 });
      }

      // 画像URLの取得
      const fileurl = supabase.storage.from("blog-images").getPublicUrl(fileName).data.publicUrl;

      updateData = {
        id: formData.get("id") as string,
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        category_id: Number(formData.get("category_id") as string),
        user_id: formData.get("user_id") as string,
        image_path: fileurl,
      };
    } else {
      // iimage_pathが存在しimageが存在しない場合
      const jsonData = await req.json();
      // eslint-disable-next-line no-console
      console.log("jsonData", jsonData);

      if (!jsonData || typeof jsonData !== "object") {
        return NextResponse.json({ error: "無効なJSONデータです" }, { status: 400 });
      }

      updateData = {
        id: jsonData.id,
        title: jsonData.title,
        content: jsonData.content,
        category_id: Number(jsonData.category_id),
        user_id: jsonData.user_id,
        image_path: jsonData.image_path,
      };
    }

    if (updateData.user_id !== token.sub) {
      return NextResponse.json({ error: "この投稿の編集権限がありません" }, { status: 403 });
    }




    const { data, error } = await supabase
      .from("posts")
      .update({
        title: updateData.title,
        content: updateData.content,
        category_id: updateData.category_id,
        user_id: updateData.user_id,
        image_path: updateData.image_path,
      })
      .eq("id", updateData.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "データベースの更新に失敗しました" }, { status: 500 });
    }
    // 成功時のレスポンスを追加
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error:", error);
    return NextResponse.json({ error: "予期せぬエラーが発生しました" }, { status: 500 });
  }
}

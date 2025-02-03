import { NextRequest, NextResponse } from "next/server";
import { supabase } from "lib/util/supabase";

// POSTメソッドのハンドラ
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;

    if (typeof parseInt(category, 10) !== "number") {
      throw new Error("カテゴリーが無効です");
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "ファイルが選択されていません" }, { status: 400 });
    }

    // Supabaseストレージへのアップロード
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("blog-images").upload(fileName, file);

    if (uploadError) {
      // eslint-disable-next-line no-console
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: "ファイルのアップロードに失敗しました" }, { status: 500 });
    }

    // 画像URLの取得
    const fileUrl = supabase.storage.from("blog-images").getPublicUrl(fileName).data.publicUrl;

    // データベースへの保存
    const { error: dbError } = await supabase.from("posts").insert([
      {
        title,
        content,
        image_path: fileUrl,
        user_id: "e7f11c61-19e0-46b8-8cf4-e464a7ddb2c6",
        category_id: category,
      },
    ]);

    if (dbError) {
      // eslint-disable-next-line no-console
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "データベースの保存に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "投稿が完了しました",
      fileUrl,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error:", error);
    return NextResponse.json({ error: "予期せぬエラーが発生しました" }, { status: 500 });
  }
}

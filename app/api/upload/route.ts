import { NextRequest, NextResponse } from "next/server";
import { supabase } from "lib/util/supabase";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import prisma from "lib/util/prisma";
import { authOptions } from "../../auth";

// POSTメソッドのハンドラ
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      // eslint-disable-next-line no-console
      console.log("server session : Unauthorized");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const userId = token.sub as string;

    if (typeof BigInt(category) !== "bigint") {
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

    await prisma.posts.create({
      data: {
        title,
        content,
        image_path: fileUrl,
        user_id: userId,
        category_id: BigInt(category),
      },
    });

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

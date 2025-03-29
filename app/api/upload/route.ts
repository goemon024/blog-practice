import { NextRequest, NextResponse } from "next/server";
import { supabase } from "lib/util/supabase";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
// import prisma from "lib/util/prisma";
import { authOptions } from "../../auth";
import { CreatePostInput } from "lib/types/index";
import { createPost } from "lib/db/posts";


/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: 新規ブログ投稿を作成
 *     description: |
 *       新しいブログ投稿を作成します。
 *       
 *       機能：
 *       - 画像ファイルのアップロード
 *       - タイトルと本文の設定
 *       - カテゴリーの指定
 *       
 *       注意点：
 *       - 画像ファイルは必須です
 *       - カテゴリーは有効な数値である必要があります
 *       - 認証が必要です
 *       
 *       テスト方法：
 *       1. Authorizeボタンで認証トークンを設定
 *       2. 必須項目を入力
 *       3. 画像ファイルを選択
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - title
 *               - content
 *               - category
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: アップロードする画像ファイル
 *               title:
 *                 type: string
 *                 description: 投稿のタイトル
 *                 example: "ブログタイトル"
 *               content:
 *                 type: string
 *                 description: 投稿の本文
 *                 example: "ブログの内容"
 *               category:
 *                 type: string
 *                 description: カテゴリーID（数値の文字列）
 *                 example: "1"
 *     responses:
 *       201:
 *         description: 投稿の作成に成功
 *       400:
 *         description: リクエストが不正です
 *       401:
 *         description: 認証が必要です
 *       500:
 *         description: サーバーエラー
 */

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

    const createInput: CreatePostInput = {
      title,
      content,
      image_path: fileUrl,
      user_id: userId,
      category_id: category,
    };

    await createPost(createInput);

    return NextResponse.json({
      success: true,
      message: "投稿が完了しました",
      fileUrl,
    }, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error:", error);
    return NextResponse.json({ error: "予期せぬエラーが発生しました" }, { status: 500 });
  }
}

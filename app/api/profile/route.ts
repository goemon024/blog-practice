import { NextRequest, NextResponse } from "next/server";
import { supabase } from "lib/util/supabase";
// import prisma from "lib/util/prisma";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth";

import { updateUserProfile } from "lib/db/profile";
import { UpdateUserProfileInput } from "lib/types/index";


/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: プロフィール画像を更新
 *     description: ユーザーのプロフィール画像を更新します
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
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: アップロードする画像ファイル
 *     responses:
 *       200:
 *         description: プロフィール画像の更新に成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "投稿が完了しました"
 *                 fileUrl:
 *                   type: string
 *                   description: アップロードされた画像のURL
 *       400:
 *         description: ファイルが選択されていません
 *       401:
 *         description: 認証が必要です
 *       500:
 *         description: ファイルのアップロードに失敗しました
 */

// PUTメソッドのハンドラ
export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = token.sub as string;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "ファイルが選択されていません" }, { status: 400 });
    }

    // Supabaseストレージへのアップロード
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("profile-images").upload(fileName, file);

    if (uploadError) {
      // eslint-disable-next-line no-console
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: "ファイルのアップロードに失敗しました" }, { status: 500 });
    }

    // 画像URLの取得
    const fileUrl = supabase.storage.from("profile-images").getPublicUrl(fileName).data.publicUrl;

    // データベースへの保存

    const updateInput: UpdateUserProfileInput = {
      id: userId,
      image_path: fileUrl,
    };

    await updateUserProfile(updateInput);

    // await prisma.public_users.update({
    //   where: {
    //     id: userId,
    //   },
    //   data: {
    //     image_path: fileUrl,
    //   },
    // });

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

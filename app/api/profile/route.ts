import { NextRequest, NextResponse } from "next/server";
import { supabase } from "lib/util/supabase";

import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth";

import { updateUserProfile } from "lib/db/profile";
import { UpdateUserProfileInput } from "lib/types/index";

// POSTメソッドのハンドラ
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

import { NextRequest, NextResponse } from "next/server";

import { createComment } from "lib/db/comment";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth";
import { CreateCommentInput } from "lib/types/index";

// POSTメソッドのハンドラ
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const data = await req.json();
    const content = data.content as string;
    const created_at = data.created_at as string;
    const post_id = data.post_id as string;
    const userId = token.sub as string;

    const commentData: CreateCommentInput = {
      content: content,
      user_id: userId,
      post_id: post_id,
      created_at: created_at,
    };

    await createComment(commentData);

    return NextResponse.json({
      success: true,
      message: "投稿が完了しました",
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error:", error);
    return NextResponse.json({ error: "予期せぬエラーが発生しました" }, { status: 500 });
  }
}

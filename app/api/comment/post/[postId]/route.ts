import { NextRequest, NextResponse } from "next/server";
// import { supabase } from "lib/util/supabase";
import prisma from "lib/util/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth";

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const postId = params.postId;

    if (!postId) {
      return NextResponse.json({ error: "投稿IDが必要です" }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: {
        post_id: BigInt(postId),
      },
      select: {
        id: true,
        content: true,
        created_at: true,
        users: {
          select: {
            username: true,
            image_path: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        data: comments.map((comment) => ({
          ...comment,
          id: String(comment.id),
        })),
        message: "コメント一覧取得成功",
      },
      { status: 200 },
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("予期せぬエラー:", error);
    return NextResponse.json({ error: "予期せぬエラーが発生しました", details: error }, { status: 500 });
  }
}

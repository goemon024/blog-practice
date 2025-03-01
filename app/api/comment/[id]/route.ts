import { NextResponse, NextRequest } from "next/server";
// import { supabase } from "lib/util/supabase";
import prisma from "lib/util/prisma";
import { getToken } from "next-auth/jwt";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // トークンチェック
    const token = await getToken({ req: request as NextRequest });
    if (!token) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: parseInt(params.id),
      },
      select: {
        id: true,
        users: {
          select: {
            username: true,
          },
        },
      },
    });

    // コメントの存在確認と所有者チェック
    // const { data: comment } = await supabase.from("comment").select("id,users(username)").eq("id", params.id).single<{
    //   id: string;
    //   users: { username: string | null };
    // }>();

    if (!comment) {
      return NextResponse.json({ error: "コメントが見つかりません" }, { status: 404 });
    }

    // 所有者チェック
    if (comment?.users?.username !== token.username) {
      return NextResponse.json({ error: "削除権限がありません" }, { status: 403 });
    }

    // コメント削除
    // const { error } = await supabase.from("comment").delete().eq("id", params.id);

    const deletedComment = await prisma.comment.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    // if (error) {
    //   return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
    // }

    return NextResponse.json({ message: "削除成功" });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error:", error);
    return NextResponse.json({ error: "予期せぬエラーが発生しました" }, { status: 500 });
  }
}

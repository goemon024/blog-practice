import { NextResponse, NextRequest } from "next/server";

import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth";
import { getOneComment, deleteComment } from "lib/db/comment";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // トークンチェック
    const token = await getToken({ req: request as NextRequest });
    if (!token) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const comment = await getOneComment(params.id);

    // const comment = await prisma.comment.findUnique({
    //   where: {
    //     id: BigInt(params.id),
    //   },
    //   select: {
    //     id: true,
    //     users: {
    //       select: {
    //         username: true,
    //       },
    //     },
    //   },
    // });

    if (!comment) {
      return NextResponse.json({ error: "コメントが見つかりません" }, { status: 404 });
    }

    // 所有者チェック
    if (comment?.users?.username !== token.username) {
      return NextResponse.json({ error: "削除権限がありません" }, { status: 403 });
    }

    // await prisma.comment.delete({
    //   where: {
    //     id: BigInt(params.id),
    //   },
    // });

    await deleteComment(params.id);

    return NextResponse.json({ message: "削除成功" });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error:", error);
    return NextResponse.json({ error: "予期せぬエラーが発生しました" }, { status: 500 });
  }
}

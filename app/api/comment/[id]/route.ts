import { NextResponse, NextRequest } from "next/server";

import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth";
import { getOneComment, deleteComment } from "lib/db/comment";

/**
 * @swagger
 * /api/comment/{id}:
 *   delete:
 *     summary: コメントを削除
 *     description: IDで指定されたコメントを削除します
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: コメントID
 *     responses:
 *       200:
 *         description: コメントの削除に成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "削除成功"
 *       401:
 *         description: 認証が必要です
 *       403:
 *         description: 削除権限がありません
 *       404:
 *         description: コメントが見つかりません
 *       500:
 *         description: 予期せぬエラーが発生しました
 */

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

    if (!comment) {
      return NextResponse.json({ error: "コメントが見つかりません" }, { status: 404 });
    }

    // 所有者チェック
    if (comment?.users?.username !== token.username) {
      return NextResponse.json({ error: "削除権限がありません" }, { status: 403 });
    }

    await deleteComment(params.id);
    return NextResponse.json({ message: "削除成功" });

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error:", error);
    return NextResponse.json({ error: "予期せぬエラーが発生しました" }, { status: 500 });
  }
}

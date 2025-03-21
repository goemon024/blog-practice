import { NextRequest, NextResponse } from "next/server";

import { createComment } from "lib/db/comment";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth";
import { CreateCommentInput } from "lib/types/index";



/**
 * @swagger
 * /api/comment:
 *   post:
 *     summary: コメントを作成
 *     description: 新しいコメントを作成します
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - post_id
 *             properties:
 *               content:
 *                 type: string
 *                 description: コメントの内容
 *               post_id:
 *                 type: string
 *                 description: コメントを投稿する投稿のID
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 description: コメントの作成日時
 *     responses:
 *       201:
 *         description: コメントの作成に成功
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
 *       401:
 *         description: 認証が必要です
 *       400:
 *         description: リクエストの形式が不正です
 *       500:
 *         description: 予期せぬエラーが発生しました
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
      status: 201,
    });
  } catch (error) {

    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error("Error:", error.message);

      // エラーメッセージに基づいて適切なステータスコードを返す
      if (error.message.includes("バリデーションエラー") ||
        error.message.includes("不正なデータ")) {
        return NextResponse.json(
          { error: "リクエストデータが不正です" },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: "予期せぬエラーが発生しました" },
          { status: 500 }
        );
      }
    } else {
      // eslint-disable-next-line no-console
      console.error("Error:", error);
    }

    return NextResponse.json({ error: "予期せぬエラーが発生しました" }, { status: 500 });
  }
}

//     if (error instanceof Error) {
//       // eslint-disable-next-line no-console
//       console.error("Error:", error.message);
//     } else {
//       // eslint-disable-next-line no-console
//       console.error("Error:", error);
//     }
//     return NextResponse.json({ error: "予期せぬエラーが発生しました" }, { status: 500 });
//   }
// }

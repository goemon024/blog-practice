import { NextRequest, NextResponse } from "next/server";
// import { supabase } from "lib/util/supabase";
import prisma from "lib/util/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth";

/**
 * @swagger
 * /api/comment/post/{postId}:
 *   get:
 *     summary: 投稿に紐づくコメント一覧を取得
 *     description: 指定された投稿IDに紐づくすべてのコメントを取得します
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: 投稿ID
 *     responses:
 *       200:
 *         description: コメント一覧の取得に成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       content:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       users:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                           image_path:
 *                             type: string
 *       400:
 *         description: 投稿IDが必要です
 *       401:
 *         description: 認証が必要です
 *       500:
 *         description: 予期せぬエラーが発生しました
 */
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

    // const { data: comments, error } = await supabase
    //     .from("comment")
    //     .select(
    //         `id,
    //         content,
    //         created_at,
    //         users(
    //         username,
    //         image_path)`,
    //     )
    //     .eq("post_id", postId)
    //     .order("created_at", { ascending: false })
    //     .returns<CommentCustom[]>();

    // eslint-disable-next-line no-console
    // console.log("Supabase response:", { comments, error }); // デバッグ用

    // if (error) {
    //     // eslint-disable-next-line no-console
    //     console.error("Supabase error:", error); // デバッグ用
    //     return NextResponse.json({ error: "コメントの取得に失敗しました" }, { status: 500 });
    // }

    return NextResponse.json({
      data: comments.map((comment) => ({
        ...comment,
        id: String(comment.id),
      })),
      message: "コメント一覧取得成功",
    }, { status: 200 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("予期せぬエラー:", error);
    return NextResponse.json({ error: "予期せぬエラーが発生しました", details: error }, { status: 500 });
  }
}

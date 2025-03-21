// import { supabase } from "lib/util/supabase";
import { NextResponse } from "next/server";
import { deletePost } from "lib/db/posts";

import { Prisma } from "@prisma/client";

/**
 * @swagger
 * /api/posts/delete:
 *   delete:
 *     summary: 投稿を削除
 *     description: 指定されたIDの投稿を削除します
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: 削除する投稿のID
 *     responses:
 *       200:
 *         description: 投稿の削除に成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post with ID 123 deleted successfully"
 *       400:
 *         description: IDが必要です
 *       401:
 *         description: 認証が必要です
 *       403:
 *         description: 削除権限がありません
 *       404:
 *         description: 投稿が見つかりません
 *       500:
 *         description: 予期せぬエラーが発生しました
 */

// DELETEリクエストを処理
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json(); // リクエストボディからIDを取得
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await deletePost(id);

    // const { error } = await supabase.from("posts").delete().eq("id", id);
    // if (error) {
    //   throw error;
    // }

    return NextResponse.json({ message: `Post with ID ${id} deleted successfully` });
  } catch (error: any) {
    // エラーの種類に応じて適切なレスポンスを返す
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return new Response("Post not found", { status: 404 });
      }
      if (error.code === "P2003") {
        return new Response("Cannot delete post with existing comments", { status: 400 });
      }
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// import { supabase } from "lib/util/supabase";
import { NextResponse } from "next/server";
import { deletePost } from "lib/db/posts";

import { Prisma } from "@prisma/client";

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
      if (error.code === 'P2025') {
        return new Response('Post not found', { status: 404 });
      }
      if (error.code === 'P2003') {
        return new Response('Cannot delete post with existing comments', { status: 400 });
      }
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

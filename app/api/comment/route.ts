import { NextRequest, NextResponse } from "next/server";
// import { supabase } from "lib/util/supabase";
import prisma from "lib/util/prisma";
import { getToken } from "next-auth/jwt";

// POSTメソッドのハンドラ
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const data = await req.json();
    const content = data.content as string;
    const created_at = data.created_at as string;
    const post_id = data.post_id as string;
    const userId = token.sub as string;

    // データベースへの保存
    // const { error: dbError } = await supabase.from("comment").insert([
    //   {
    //     content,
    //     user_id: userId,
    //     post_id: post_id,
    //     created_at: created_at,
    //   },
    // ]);

    // データベースへの保存
    // const newComment = await prisma.comment.create({
    await prisma.comment.create({
      data: {
        content,
        user_id: userId,
        post_id: BigInt(post_id),
        created_at: new Date(created_at),
      },
    });

    // if (dbError) {
    //   // eslint-disable-next-line no-console
    //   console.error("Database error:", dbError);
    //   return NextResponse.json({ error: "データベースの保存に失敗しました" }, { status: 500 });
    // }

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

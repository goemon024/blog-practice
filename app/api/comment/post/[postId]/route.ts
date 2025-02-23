import { NextRequest, NextResponse } from "next/server";
import { supabase } from "lib/util/supabase";

type CommentCustom = Omit<Comment, "post_id" | "user_id" | "updated_at"> & {
    users: { username: string | null; image_path: string | null };
};

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
    try {
        const postId = params.postId;

        if (!postId) {
            return NextResponse.json({ error: "投稿IDが必要です" }, { status: 400 });
        }

        const { data: comments, error } = await supabase
            .from("comment")
            .select(
                `id,
                content,
                created_at,
                users(
                username,
                image_path)`,
            )
            .eq("post_id", postId)
            .order("created_at", { ascending: false })
            .returns<CommentCustom[]>();


        // eslint-disable-next-line no-console
        console.log("Supabase response:", { comments, error }); // デバッグ用

        if (error) {
            // eslint-disable-next-line no-console
            console.error("Supabase error:", error); // デバッグ用
            return NextResponse.json({ error: "コメントの取得に失敗しました" }, { status: 500 });
        }

        return NextResponse.json({ data: comments });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("予期せぬエラー:", error);
        return NextResponse.json({ error: "予期せぬエラーが発生しました", details: error }, { status: 500 });
    }
}

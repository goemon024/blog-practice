import { NextRequest, NextResponse } from 'next/server';

import { supabase } from "lib/util/supabase";

export async function GET(
    req: NextRequest,
    { params }: { params: { postId: string } }
) {
    try {
        const postId = params.postId;

        if (!postId) {
            return NextResponse.json(
                { error: "投稿IDが必要です" },
                { status: 400 }
            );
        }

        const { data: comments, error } = await supabase
            .from('comments')
            .select(`
        content,
        created_at,
        users:user_id (
          username,
          image_path
        )
      `)
            .eq('post_id', postId)
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json(
                { error: "コメントの取得に失敗しました" },
                { status: 500 }
            );
        }

        return NextResponse.json(comments);

    } catch (error) {
        return NextResponse.json(
            { error: "予期せぬエラーが発生しました" },
            { status: 500 }
        );
    }
}
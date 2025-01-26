'use server'

import { Category } from '@mui/icons-material'
import { supabase } from 'lib/util/supabase'
// import { Post } from 'lib/types/post'

// export type Post = {
//     id: number;
//     title: string;
//     blogImagePath: string;
//     textLine: string;
//     userName: string;
//     userImagePath: string;
//   };

// export type CreatePostInput = Pick<Post, 'title' | 'textLine'>

export async function createPost(data: {
    user_id: string,
    title: string,
    content: string
}) {
    try {
        const { data: post, error } = await supabase
            .from('posts')
            .insert([
                {
                    user_id: 'e7f11c61-19e0-46b8-8cf4-e464a7ddb2c6',
                    category_id: 5,
                    title: data.title,
                    content: data.content
                }
            ])
            .select()

        if (error) throw error
        return { success: true, data: post }
    } catch (error) {
        console.log(error)
        return { success: false, error: 'ブログの投稿に失敗しました' }
    }
}
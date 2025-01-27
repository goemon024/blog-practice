'use server'

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

/* use-server title and content */
// export async function createPost(data: {
//     user_id: string,
//     title: string,
//     content: string
// }) {
//     try {
//         const { data: post, error } = await supabase
//             .from('posts')
//             .insert([
//                 {
//                     user_id: 'e7f11c61-19e0-46b8-8cf4-e464a7ddb2c6',
//                     category_id: 5,
//                     title: data.title,
//                     content: data.content
//                 }
//             ])
//             .select()

//         if (error) throw error
//         return { success: true, data: post }
//     } catch (error) {
//         console.log(error)
//         return { success: false, error: 'ブログの投稿に失敗しました' }
//     }
// }

export async function createPost(formData: FormData) {
    const file = formData.get("file"); // フォームから送信されたファイル
    const title = formData.get("title"); // フォームから送信された文章
    const content = formData.get("content"); // フォームから送信された文章

    console.log("########")
    console.log(title)
    console.log(file)


    // 1. ファイルをSupabaseバケットにアップロード
    if (!file || !(file instanceof File)) {
        throw new Error("ファイルが見つかりません");
    }

    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from("blog-images") // バケット名
        .upload(fileName, file, {
            contentType: file.type,
        });

    if (uploadError) {
        console.error("File upload error:", uploadError);
        throw new Error("File upload failed.");
    }

    // const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/${fileName}`;
    // ... existing code ...

    const fileUrl = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName).data.publicUrl;

    // 2. 画像URLと文章をデータベースに保存
    const { data: dbData, error: dbError } = await supabase
        .from("posts") // Supabaseのデータベーステーブル
        .insert({
            user_id: 'e7f11c61-19e0-46b8-8cf4-e464a7ddb2c6',
            category_id: 5,
            image_path: fileUrl,
            title: title,
            content: content
        });

    if (dbError) {
        console.error("Database insert error:", dbError);
        throw new Error("Failed to save data.");
    }

    return { message: "Data uploaded successfully!", fileUrl };
}
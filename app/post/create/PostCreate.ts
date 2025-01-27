'use server'
import { supabase } from 'lib/util/supabase'

export async function createPost(formData: FormData) {
    const file = formData.get("file");
    const title = formData.get("title");
    const content = formData.get("content");

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

    const fileUrl = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName).data.publicUrl;

    // 2. 画像URLと文章をデータベースに保存
    const { error: dbError } = await supabase
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
"use client";

import styles from "./page.module.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreateImage from "@components/CreateImage/CreateImage";
import CreateTitle from "@components/CreateTitle/CreateTitle";
import CreateContent from "@components/CreateContent/CreateContent";
import { supabase } from "lib/util/supabase";

interface PostEditPageProps {
  params: {
    id: string;
  };
}

const PostEditPage: React.FC<PostEditPageProps> = ({ params }) => {
  const { id } = params; // URLから投稿IDを取得
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(6);
  const [image, setImage] = useState<File | null>(null);
  const [imagePath, setImagePath] = useState("");

  // 投稿データの取得
  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("title, content, category_id, image_path")
        .eq("id", id)
        .single();

      if (error) {
        return;
      }

      setTitle(data.title);
      setContent(data.content);
      setCategory(data.category_id);
      setImagePath(data.image_path || "");
    };

    fetchPost();
  }, [id]);

  const handleImageUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${id}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage.from("blog-images").upload(filePath, file, { upsert: true });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath);

    if (!data) {
      throw new Error("Failed to retrieve public URL");
    }

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let updatedImagePath = imagePath;

      if (image) {
        // 画像をアップロードし、公開 URL を取得
        updatedImagePath = await handleImageUpload(image);
      }

      const updates = {
        title,
        content,
        category_id: category,
        image_path: updatedImagePath,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("posts").update(updates).eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      // 成功時の処理
      router.push(`/posts/${id}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <CreateTitle title={title} setTitle={setTitle} />
        <CreateImage onFileSelect={(file) => setImage(file)} />
        {imagePath && <img src={imagePath} alt="Post Image" className={styles.imagePreview} />}
        <CreateContent content={content} setContent={setContent} />
        <button type="submit">更新</button>
      </form>
    </div>
  );
};

export default PostEditPage;

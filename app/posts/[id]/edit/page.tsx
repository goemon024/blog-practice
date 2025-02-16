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
  const [, setImage] = useState<File | null>(null);
  const [imagePath, setImagePath] = useState<string | null>("");

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
      setImagePath(data.image_path);
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log("更新ボタンが押されました");

    try {
      const formData = new FormData(e.currentTarget);
      const newTitle = formData.get("title") as string;
      const newContent = formData.get("content") as string;

      const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
      const newImage = fileInput.files?.[0];
      // const newImage = image;
      // const newImage = formData.get('image') as File | null;

      // let response;
      // eslint-disable-next-line no-console
      console.log("formData", formData.get("image"));

      const updatedImagePath = imagePath;

      if (newImage && newImage.size > 0) {
        // eslint-disable-next-line no-console
        console.log("file case");
        formData.append("id", id);
        formData.append("user_id", "c6de3bba-4c2a-4202-9ab0-535f3697c87b");
        formData.append("category_id", category.toString());
        formData.append("updated_at", new Date().toISOString());
        formData.append("image", newImage);

        const response = await fetch("/api/posts/[id]", {
          method: "PUT",
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } else {
        // eslint-disable-next-line no-console
        console.log("not file case");
        setTitle(formData.get("title") as string);
        setContent(formData.get("content") as string);

        const response = await fetch(`/api/posts/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            title: newTitle,
            content: newContent,
            image_path: updatedImagePath,
            // user_id: "e7f11c61-19e0-46b8-8cf4-e464a7ddb2c6",
            user_id: "c6de3bba-4c2a-4202-9ab0-535f3697c87b",
            category_id: category,
            updated_at: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "不明なエラー" }));
          throw new Error(errorData.error);
        }
      }
      router.push(`/posts/${id}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }

    // if (image) {
    //   // 画像をアップロードし、公開 URL を取得
    //   updatedImagePath = await handleImageUpload(image);
    // }

    // 成功時の処理

    // } catch (error) {
    //   // eslint-disable-next-line no-console
    //   console.log(error);
    // }
  };

  const handleDelete = async () => {
    // 削除の実装
    const response = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete post");
    }
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <CreateTitle title={title} setTitle={setTitle} />
        <CreateImage onFileSelect={(file) => setImage(file)} presetImage={imagePath} />
        <CreateContent content={content} setContent={setContent} />
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.buttonPrimary}>更新</button>
          <button type="button" onClick={handleDelete} className={styles.buttonDelete}>削除</button>
        </div>
      </form>
    </div>
  );
};

export default PostEditPage;

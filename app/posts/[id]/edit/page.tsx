"use client";

import styles from "./page.module.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreateImage from "@components/CreateImage/CreateImage";
import CreateTitle from "@components/CreateTitle/CreateTitle";
import CreateContent from "@components/CreateContent/CreateContent";
import { supabase } from "lib/util/supabase";

import { Modal } from "@mui/material";

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
  const [userId, setUserId] = useState("");
  const [category, setCategory] = useState(6);
  const [, setImage] = useState<File | null>(null);
  const [imagePath, setImagePath] = useState<string | null>("");

  const [error, setError] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  // 投稿データの取得
  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("title, content, category_id, image_path, user_id")
        .eq("id", id)
        .single();

      if (error) {
        return;
      }

      setTitle(data.title);
      setContent(data.content);
      setUserId(data.user_id);
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

      const updatePost = async () => {
        if (newImage && newImage.size > 0) {
          // eslint-disable-next-line no-console
          console.log("file case");
          formData.append("id", id);
          formData.append("user_id", userId);
          formData.append("category_id", category.toString());
          formData.append("updated_at", new Date().toISOString());
          formData.append("image", newImage);

          return await fetch("/api/posts/[id]", {
            method: "PUT",
            body: formData,
          });

          // const data = await response.json();
          // if (!response.ok) {
          //   throw new Error(data.error || "Something went wrong");
          // }
        } else {
          // eslint-disable-next-line no-console
          console.log("not file case");
          setTitle(formData.get("title") as string);
          setContent(formData.get("content") as string);

          return await fetch(`/api/posts/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id,
              title: newTitle,
              content: newContent,
              image_path: updatedImagePath,
              user_id: userId,
              category_id: category,
              updated_at: new Date().toISOString(),
            }),
          });

          // if (!response.ok) {
          //   const errorData = await response.json().catch(() => ({ error: "不明なエラー" }));
          //   throw new Error(errorData.error);
          // }
        }
      };

      const response = await updatePost();
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 403) {
          setError("この投稿の更新権限がありません");
        } else if (response.status === 401) {
          setError("認証が必要です");
        } else {
          setError(data.error || "更新中にエラーが発生しました");
        }
        setIsErrorModalOpen(true);
        return;
      }
      router.push(`/posts/${id}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      setError("予期せぬエラーが発生しました");
      setIsErrorModalOpen(true);
    }
  };

  const handleDelete = async () => {
    // 削除の実装
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        if (response.status === 403) {
          setError("この操作を実行する権限がありません");
          setIsErrorModalOpen(true);
          return;
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("投稿の削除中にエラーが発生しました", error);
      setError("投稿の削除に失敗しました");
      setIsErrorModalOpen(true);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <CreateTitle title={title} setTitle={setTitle} />
        <CreateImage onFileSelect={(file) => setImage(file)} presetImage={imagePath} />
        <CreateContent content={content} setContent={setContent} />
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.buttonPrimary}>
            更新
          </button>
          <button type="button" onClick={handleDelete} className={styles.buttonDelete}>
            削除
          </button>
        </div>
      </form>

      <Modal
        open={isErrorModalOpen}
        onClose={() => {
          setIsErrorModalOpen(false);
          router.push("/");
        }}
      >
        <div className={styles.errorModal}>
          <h3>エラー</h3>
          <p>{error}</p>
          <button
            onClick={() => {
              setIsErrorModalOpen(false);
              router.push("/");
            }}
          >
            閉じる
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PostEditPage;

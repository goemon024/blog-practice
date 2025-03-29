"use client";

import styles from "./page.module.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreateImage from "@components/CreateImage/CreateImage";
import CreateTitle from "@components/CreateTitle/CreateTitle";
import CreateContent from "@components/CreateContent/CreateContent";
import { useCallback } from "react";
import { Modal } from "@mui/material";

export default function PostEditPage({ params }: { params: { id: string } }) {
  const { id } = params; // URLから投稿IDを取得
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [category, setCategory] = useState<string>("3");
  const [, setImage] = useState<File | null>(null);
  const [imagePath, setImagePath] = useState<string | null>("");

  const [error, setError] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const [isAuthen, setIsAuthen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 投稿データの取得
  const fetchPost = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/${id}`);

      if (!response.ok) {
        throw new Error("データの取得に失敗しました");
      }
      const postData = await response.json();
      setTitle(postData.data.title);
      setContent(postData.data.content);
      setUserId(postData.data.user_id);
      setCategory(postData.data.category_id);
      setImagePath(postData.data.image_path);
      setIsAuthen(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("データの取得に失敗しました", error);
      setError("データの取得に失敗しました");
      router.push("/");
    }
  }, [id, router]);

  useEffect(() => {
    fetchPost();
  }, [id, fetchPost]);

  if (!isAuthen) {
    return <div>Loading...</div>;
  }

  const checkUpdateComplete = async (
    postId: string,
    imagePathParam: string,
    contentParam: string,
    maxAttempts = 8,
  ): Promise<boolean> => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          // この行は省略可能
          method: "GET",
          // Next.jsのキャッシュ層を無効化
          cache: "no-store",
          // ブラウザのキャッシュを無効化
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        const { data } = await response.json();

        if (data.title !== title) {
          // eslint-disable-next-line no-console
          console.log("titleが一致しません");
        }
        if (data.content !== contentParam) {
          // eslint-disable-next-line no-console
          console.log("contentが一致しません");
        }
        if (data.image_path !== imagePathParam) {
          // eslint-disable-next-line no-console
          console.log("image_pathが一致しません");
        }

        // 更新されたデータと一致するか確認
        if (data.title === title && data.content === contentParam && data.image_path === imagePathParam) {
          return true;
        }

        // 一致しない場合は少し待って再試行
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("更新確認中のエラー:", error);
      }
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log("更新ボタンが押されました");
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const formTitle = formData.get("title") as string;
      const formContent = formData.get("content") as string;

      const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
      const newImage = fileInput.files?.[0];

      // eslint-disable-next-line no-console
      console.log("formData", formData.get("title"));
      // eslint-disable-next-line no-console
      console.log("formData", formData.get("image"));

      const updatedImagePath = imagePath;

      const updatePost = async () => {
        if (newImage && newImage.size > 0) {
          // eslint-disable-next-line no-console
          console.log("file case");
          formData.append("id", id);
          formData.append("user_id", userId);
          formData.append("category_id", String(category));
          formData.append("updated_at", new Date().toISOString());
          formData.append("image", newImage);

          return await fetch(`/api/posts/${id}`, {
            method: "PUT",
            body: formData,
          });
        } else {
          // eslint-disable-next-line no-console
          console.log("not file case");
          setTitle(formData.get("title") as string);
          setContent(formData.get("content") as string);

          // eslint-disable-next-line no-console
          console.log("userId:", userId);

          return await fetch(`/api/posts/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: id,
              title: formTitle,
              content: formContent,
              image_path: updatedImagePath,
              user_id: userId,
              category_id: category,
              updated_at: new Date().toISOString(),
            }),
          });
        }
      };

      const response = await updatePost();
      const data = await response.json();
      const newImagePath = data.data.image_path;
      const newContent = data.data.content;

      // eslint-disable-next-line no-console
      console.log("response imagePath", newImagePath);

      if (!response.ok) {
        if (response.status === 403) {
          setError("この投稿の更新権限がありません");
        } else if (response.status === 401) {
          setError("認証が必要です");
        } else {
          setError(data.error || "更新中にエラーが発生しました");
        }
        setIsErrorModalOpen(true);
        setIsLoading(false);
        return;
      }

      const isUpdateComplete = await checkUpdateComplete(id, newImagePath, newContent);
      if (!isUpdateComplete) {
        throw new Error("データの更新が確認できませんでした");
      }

      // await fetchPost();
      router.refresh();
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
      router.push(`/posts/${id}`);
      // router.push(`/`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      setError("予期せぬエラーが発生しました");
      setIsErrorModalOpen(true);
      setIsLoading(false);
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

      router.refresh();
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push(`/`);
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

      <Modal open={isLoading}>
        <div className={styles.errorModal}>
          <p>更新中...</p>
        </div>
      </Modal>
    </div>
  );
}

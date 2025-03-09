"use client";

import styles from "./PostCreate.module.css";
import React, { useState } from "react";
import CreateImage from "@components/CreateImage/CreateImage";
import CreateTitle from "@components/CreateTitle/CreateTitle";
import CreateContent from "@components/CreateContent/CreateContent";
import CreateCategory from "@components/CreateCategory/CreateCategory";
import { useRouter } from "next/navigation";

const PostCreatePage = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string>("3");
  const [image, setImage] = useState<File | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // 成功時の処理
      router.refresh();
      router.push("/");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error:", error);
    }
  };

  if (image != null) {
    // eslint-disable-next-line no-console
    console.log(image.name);
  }
  // eslint-disable-next-line no-console
  console.log({ title, content, category });

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <CreateTitle title={title} setTitle={setTitle} />
        <CreateCategory category={category} setCategory={setCategory} />
        <CreateImage onFileSelect={(file) => setImage(file)} presetImage={null} />
        <CreateContent content={content} setContent={setContent} />

        <div className={styles.buttonContainer}>
          <button className={styles.button} type="submit">
            create blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostCreatePage;

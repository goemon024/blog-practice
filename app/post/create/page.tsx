"use client";

import styles from "./PostCreate.module.css";
import React, { useState } from "react";
import CreateImage from "@components/CreateImage/CreateImage";
import CreateTitle from "@components/CreateTitle/CreateTitle";
import CreateContent from "@components/CreateContent/CreateContent";
import CreateCategory from "@components/CreateCategory/CreateCategory";
import { useRouter } from "next/navigation";

// import { createPost } from "./PostCreate";
// import type { CreatePostInput } from "./PostCreate";

const PostCreatePage = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<number>(6);
  const [image, setImage] = useState<File | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // 成功時の処理
      // router.push('/')

    } catch (error) {
      console.error('Error:', error);
    }
  }

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
        <CreateImage onFileSelect={(file) => setImage(file)} />
        <CreateContent content={content} setContent={setContent} />
      </form>
    </div>
  );
};

export default PostCreatePage;

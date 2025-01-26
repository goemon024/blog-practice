"use client";

import styles from "./PostCreate.module.css";
import React, { useState } from "react";
import CreateImage from "@components/CreateImage/CreateImage";
import CreateTitle from "@components/CreateTitle/CreateTitle";
import CreateContent from "@components/CreateContent/CreateContent";

import { createPost } from "./PostCreate";
// import type { CreatePostInput } from "./PostCreate";

const PostCreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const postData: CreatePostInput = {
    //   title: title,
    //   textLine: content,
    // };
    const postData = {
      user_id: 'e7f11c61-19e0-46b8-8cf4-e464a7ddb2c6',
      title: title,
      content: content
    }
    const result = await createPost(postData);
    console.log(result)
    if (result.success) {
      // 成功時の処理
      console.log("success")
    } else {
      // エラー処理
      console.log("error")
    }
  }

  if (image != null) {
    // eslint-disable-next-line no-console
    console.log(image.name);
  }
  // eslint-disable-next-line no-console
  console.log({ title, content });


  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <CreateTitle title={title} setTitle={setTitle} />
        <CreateImage onFileSelect={(file) => setImage(file)} />
        <CreateContent content={content} setContent={setContent} />
      </form>
    </div>
  );
};

export default PostCreatePage;

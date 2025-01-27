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

    const formData = new FormData(e.currentTarget);
    const result = await createPost(formData);

    // eslint-disable-next-line no-console
    console.log(result)

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

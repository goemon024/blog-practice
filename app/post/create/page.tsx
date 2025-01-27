"use client";

import CreateTitle from "@components/CreateTitle/CreateTitle";
import styles from "./PostCreate.module.css";
import React, { useState } from "react";
import CreateImage from "@components/CreateImage/CreateImage";
import CreateContent from "@components/CreateContent/CreateContent";

const PostCreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (image != null) {
      // eslint-disable-next-line no-console
      console.log(image.name);
    }
    // eslint-disable-next-line no-console
    console.log({ title, content });
  };

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

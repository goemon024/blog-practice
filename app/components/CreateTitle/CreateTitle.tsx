"use client";
import React, { useState } from "react";
import styles from "./CreateTitle.module.css";

type CreateTitleProps = {
  title: string;
  setTitle: (value: string) => void;
};

const CreateTitle: React.FC<CreateTitleProps> = ({ title, setTitle }) => {
  const [overText, setOverText] = useState<boolean>(false);

  const handleInputTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    if (inputText.length > 50) {
      setOverText(true);
      setTitle(inputText);
    } else {
      setOverText(false);
      setTitle(inputText);
    }
  };

  return (
    <div>
      {overText ? (
        <label className={styles.labelRed} htmlFor="BlogTitleInput">
          50文字を超えています
        </label>
      ) : (
        <label className={styles.label} htmlFor="BlogTitleInput">
          Blog Title :{" "}
        </label>
      )}
      <input
        id="BlogTitleInput"
        className={styles.BlogInput}
        type="text"
        maxLength={50}
        value={title}
        placeholder="タイトルを入力してください"
        onChange={handleInputTitle}
      ></input>
    </div>
  );
};
export default CreateTitle;

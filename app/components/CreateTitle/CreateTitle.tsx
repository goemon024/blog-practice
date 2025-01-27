"use client";
import React, { useState } from "react";
import styles from "./CreateTitle.module.css";

type CreateTitleProps = {
  title: string;
  setTitle: (value: string) => void;
  category: number;
  setCategory: (value: number) => void;
};

const CreateTitle: React.FC<CreateTitleProps> = ({
  title, setTitle, category, setCategory
}) => {
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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setCategory(parseInt(e.target.value, 10));
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
        name="title"
        maxLength={50}
        value={title}
        placeholder="タイトルを入力してください"
        onChange={handleInputTitle}
      ></input>

      <label className={styles.SelectorLabel} htmlFor="dropdown">Category :{" "}</label>
      <select className={styles.Selector}
        id="dropdown"
        name="category" // フォームデータのキーとして使用
        value={category}
        onChange={handleSelectChange} // 値変更時のハンドラー      
      >
        <option value="9">{"    "}</option>
        <option value="5">food</option>
        <option value="6">technorogy</option>
        <option value="7">health</option>
        <option value="8">study</option>

      </select>
    </div>
  );
};
export default CreateTitle;

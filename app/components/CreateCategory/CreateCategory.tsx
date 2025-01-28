"use client";
import React from "react";
import styles from "./CreateCategory.module.css";

type CreateCategoryProps = {
  category: number;
  setCategory: (value: number) => void;
};

const CreateCategory: React.FC<CreateCategoryProps> = ({ category, setCategory }) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // eslint-disable-next-line no-console
    console.log(e.target.value);
    setCategory(parseInt(e.target.value, 10));
  };

  return (
    <div>
      <label className={styles.SelectorLabel} htmlFor="dropdown">
        Category :{" "}
      </label>
      <select
        className={styles.Selector}
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
export default CreateCategory;

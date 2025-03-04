import React from "react";
import styles from "./CreateCategory.module.css";

type CreateCategoryProps = {
  category: string;
  setCategory: (value: string) => void;
};

const CreateCategory: React.FC<CreateCategoryProps> = ({ category, setCategory }) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
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
        <option value="1">food</option>
        <option value="3">technology</option>
        <option value="2">health</option>
      </select>
    </div>
  );
};
export default CreateCategory;

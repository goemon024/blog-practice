import React, { useState } from "react";
import styles from "./CreateContent.module.css";

type CreateContentProps = {
  content: string;
  setContent: (value: string) => void;
};

const CreateContent: React.FC<CreateContentProps> = ({ content, setContent }) => {
  const [overText, setOverText] = useState<boolean>(false);

  const handleInputContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    if (inputText.length > 2000) {
      setOverText(true);
      setContent(inputText);
    } else {
      setOverText(false);
      setContent(inputText);
    }
  };

  return (
    <div className={styles.container1}>
      {overText ? (
        <label className={styles.labelRed} htmlFor="BlogContentInput">
          2000文字を超えています。
        </label>
      ) : (
        <label className={styles.label} htmlFor="BlogContentInput">
          Article Content :{" "}
        </label>
      )}

      <textarea
        className={styles.BlogInput}
        id="BlogContentInput"
        name="content"
        maxLength={2000}
        value={content}
        placeholder="記事の内容を入力してください"
        onChange={handleInputContent}
      />
    </div>
  );
};

export default CreateContent;

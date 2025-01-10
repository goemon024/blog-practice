"use client";
import React, { useState, useRef } from "react";
import styles from "./CreateImage.module.css";

type CreateImageProps = {
  onFileSelect: (file: File | null) => void;
};

const CreateImage: React.FC<CreateImageProps> = ({ onFileSelect }) => {
  const [sizeError, setSizeError] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // useRefでinput要素を管理

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const maxSize = 1024 * 1024 * 5;

    if (file) {
      if (file.size < maxSize) {
        setSizeError(false);
        setPreview(URL.createObjectURL(file)); // プレビュー用のURLを生成
        onFileSelect(file); // 親コンポーネントにファイルを渡す
      } else {
        setSizeError(true);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.uploader} onClick={handleClick}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }} // ファイル選択ボタンを非表示
      />
      {preview ? (
        <img src={preview} alt="Preview" className={styles.preview} />
      ) : sizeError ? (
        <p className={styles.alert}>５MB以下の画像を選択してください</p>
      ) : (
        <p>クリックして画像を選択してください</p>
      )}
    </div>
  );
};

export default CreateImage;

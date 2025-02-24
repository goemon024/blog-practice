"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./CreateImage.module.css";

type CreateImageProps = {
  onFileSelect: (file: File | null) => void;
  presetImage?: string | null;
};

const CreateImage: React.FC<CreateImageProps> = ({ onFileSelect, presetImage }) => {
  const [sizeError, setSizeError] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(presetImage ?? null);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // useRefでinput要素を管理

  // edit画面で、親コンポーネントの非同期処理で非表示となるのを防ぐ。
  useEffect(() => {
    if (presetImage) {
      setPreview(presetImage);
    }
  }, [presetImage]);

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
        name="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }} // ファイル選択ボタンを非表示
      />
      {preview ? (
        <div className={styles.previewContainer}>
          <img src={preview} alt="Preview" className={styles.preview} />
        </div>
      ) : sizeError ? (
        <p className={styles.alert}>５MB以下の画像を選択してください</p>
      ) : (
        <div className={styles.TextContainer}>
          <p className={styles.BlogImageText}>Blog Image</p>
          <p>クリックして画像を選択してください</p>
        </div>
      )}
    </div>
  );
};

export default CreateImage;

"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./ProfileImage.module.css";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type ProfileImageProps = {
  // onFileSelect: (file: File | null) => void;
  presetImage: string | null;
  userName: string;
};

const DEFAULT_IMAGE_PATH = process.env.NEXT_PUBLIC_DEFAULT_AVATAR_URL;

const ProfileImage: React.FC<ProfileImageProps> = ({
  // onFileSelect,
  presetImage = DEFAULT_IMAGE_PATH,
  userName,
}) => {
  const [sizeError, setSizeError] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(presetImage ?? null);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // useRefでinput要素を管理
  // const [isUploading, setIsUploading] = useState<boolean>(false);
  const router = useRouter();
  const { data: session } = useSession();

  const isOwnProfile = session?.user?.username === userName;

  // edit画面で、親コンポーネントの非同期処理で非表示となるのを防ぐ。
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("useEffect executed - presetImage:", presetImage);
    setPreview(presetImage ?? "/default_icon.jpg");
  }, [presetImage]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const maxSize = 1024 * 1024 * 1;
    if (!file || !session?.user?.id) return;

    if (file) {
      if (file.size < maxSize) {
        setSizeError(false);
        setPreview(URL.createObjectURL(file)); // プレビュー用のURLを生成
        // onFileSelect(file); // 親コンポーネントにファイルを渡す
      } else {
        setSizeError(true);
      }
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/profile", {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // 成功時の処理
      // router.push('/')

      const event = new Event("visibilitychange");
      document.dispatchEvent(event);
      router.refresh();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error:", error);
    }
  };

  const handleClick = () => {
    if (isOwnProfile) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={isOwnProfile ? styles.uploader : styles.notUploader} onClick={handleClick}>
      <input
        ref={fileInputRef}
        type="file"
        name="file"
        accept="profile_image/*"
        onChange={handleFileChange}
        style={{ display: "none" }} // ファイル選択ボタンを非表示
      />
      {preview ? (
        <div className={styles.previewContainer}>
          <Image
            src={preview}
            alt="Preview"
            className={styles.preview}
            onError={() => setPreview(DEFAULT_IMAGE_PATH ?? null)}
            width={120}
            height={120}
          />
        </div>
      ) : sizeError ? (
        <p className={styles.alert}>1MB以下の画像を選択してください</p>
      ) : (
        <div className={styles.TextContainer}>
          <p className={styles.BlogImageText}>Profile Image</p>
          <p>クリックして画像選択</p>
        </div>
      )}
    </div>
  );
};

export default ProfileImage;

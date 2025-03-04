"use client";
import { useState, useEffect } from "react";
import styles from "./UserIconButton.module.css";

interface UserIconButtonProps {
  imagePath: string;
  isLoading: boolean;
  // onClick: () => void;
  className?: string;
}

const UserIconButton: React.FC<UserIconButtonProps> = ({
  imagePath,
  isLoading = false,
  // onClick
}) => {
  const [, setImageLoaded] = useState(false);

  useEffect(() => {
    if (imagePath) {
      // 新しい画像をプリロード
      const img = new Image();
      img.src = imagePath;

      img.onload = () => {
        setImageLoaded(true);
      };

      img.onerror = () => {
        setImageLoaded(false);
      };
    }
  }, []);

  if (isLoading) {
    return (
      <div className={`${styles.userIconButton} ${styles.skeleton}`}>
        <div className={styles.skeletonAvatar} />
      </div>
    );
  }

  return (
    <button
      // onClick={onClick}
      className={styles.userIconButton}
    >
      <img
        className={styles.userIcon}
        src={imagePath ?? "/default_icon.jpg"}
        // alt="user icon image"
        // onLoad={() => setImageLoaded(true)}
        // onError={() => setImageLoaded(false)}
      />
    </button>
  );
};

export default UserIconButton;

"use client";
import { useState } from "react";
import styles from "./UserIconButton.module.css";

interface UserIconButtonProps {
  imagePath: string;
  onClick: () => void;
  className?: string;
}

const UserIconButton: React.FC<UserIconButtonProps> = ({ imagePath, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <button onClick={onClick} className={styles.userIconButton}>
      <img
        className={styles.userIcon}
        src={imageLoaded ? imagePath : "/default_icon.jpg"}
        alt="user icon image"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageLoaded(false)}
      />
    </button>
  );
};

export default UserIconButton;

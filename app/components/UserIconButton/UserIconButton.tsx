"use client";
import { useState, useEffect } from "react";
import styles from "./UserIconButton.module.css";
import Image from "next/image";


interface UserIconButtonProps {
  imagePath: string | null;
  // isLoading: boolean;
  // onClick: () => void;
  className?: string;
}

const UserIconButton: React.FC<UserIconButtonProps> = ({
  imagePath,
  // isLoading = false,
  // onClick
}) => {

  return (
    <button
      className={styles.userIconButton}
    >
      <Image
        className={styles.userIcon}
        src={imagePath || `/default_icon.jpg`}
        alt="User Icon"
        width={30}
        height={30}
        priority={true}
        loading="eager"
        sizes="30px"
      />
    </button>
  );
};

export default UserIconButton;

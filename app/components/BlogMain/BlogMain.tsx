import React from "react";
import styles from "./BlogMain.module.css";
import UserIconButton from "../UserIconButton/UserIconButton";
import { useRouter } from "next/navigation";
import { Post } from "lib/types";

type Props = {
  post: Post;
};

const BlogMain: React.FC<Props> = ({ post }) => {
  const router = useRouter();

  const redirectToUserProfile = () => {
    router.push(`/user/${post.userName}`);
  };

  const redirectToEditPage = () => {
    router.push(`${window.location.pathname}/edit`);
  };

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>
        <UserIconButton imagePath={post.userImagePath} onClick={redirectToUserProfile} />
      </div>

      {/* Main Image */}
      <div className={styles.mainImage}>
        <img src={`${post.image_path}`} alt="no image" className={styles.mainImageContent}></img>
      </div>

      {/* Text Content */}
      <div className={styles.textContent}>
        <p className={styles.textLine}>{post.textLine}</p>
      </div>

      {/* Edit Button */}
      <button className={styles.editButton} onClick={redirectToEditPage}>
        編集
      </button>
    </div>
  );
};

export default BlogMain;

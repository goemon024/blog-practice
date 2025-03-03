"use client";

import React from "react";
import styles from "./BlogMain.module.css";
// import UserIconButton from "../UserIconButton/UserIconButton";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Post } from "lib/types";

// interface Post {
//   id: string;
//   title: string;
//   content: string;
//   image_path?: string | null;
//   category_id: number;
//   user_id: string;
//   created_at: string;
//   updated_at?: string;
// }

type Props = {
  post: Post;
};

const BlogMain: React.FC<Props> = ({ post }) => {
  const router = useRouter();
  const { data: session } = useSession();

  //現在のユーザが投稿者と一致するか確認
  const isAuther = session?.user?.id === post.user_id;
  // eslint-disable-next-line no-console
  console.log(isAuther);
  // const redirectToUserProfile = () => {
  //   router.push(`/user/${post.user_id}`);
  // };

  const redirectToEditPage = () => {
    router.push(`${window.location.pathname}/edit`);
  };

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>
        {/* <UserIconButton imagePath={post.userImagePath} onClick={redirectToUserProfile} /> */}
      </div>

      {/* Main Image */}
      <div className={styles.mainImage}>
        <img src={`${post.image_path}`} alt="no image" className={styles.mainImageContent}></img>
      </div>

      {/* Text Content */}
      <div className={styles.textContent}>
        {post.content}
        {/* <p className={styles.textLine}>{post.content}</p> */}
      </div>

      {/* Edit Button */}
      <button
        className={isAuther ? styles.editButton : styles.editDisaledButton}
        onClick={redirectToEditPage}
        disabled={!isAuther}
      >
        {/* <button className={styles.editButton} onClick={redirectToEditPage} disabled={!session}> */}
        編集
      </button>

      <button className={styles.editButton} onClick={redirectToEditPage}>
        編集
      </button>
    </div>
  );
};

export default BlogMain;

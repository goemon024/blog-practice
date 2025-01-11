"use client";
import Link from "@/node_modules/next/link";
import React from "react";
import styles from "./BlogMain.module.css";
import { Post } from "@/lib/types";

type Props = {
  post: Post;
};

const BlogMain: React.FC<Props> = ({ post }) => {
  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>
        <Link href={`/user/${post.userName}`} className={styles.userIconButton}>
          <img
            className={styles.userIcon}
            src={post.userImagePath}
            alt=""
            onError={(e) => (e.currentTarget.src = "/default_icon.jpg")}
          />
        </Link>
      </div>

      {/* Main Image */}
      <div className={styles.mainImage}>
        <img src={`${post.blogImagePath}`} alt="no image" className={styles.mainImageContent}></img>
      </div>
      {/* Text Content */}
      <div className={styles.textContent}>
        <p className={styles.textLine}>{post.textLine}</p>
      </div>
    </div>
  );
};
export default BlogMain;

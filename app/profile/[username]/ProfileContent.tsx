"use client";

import { useState, useEffect } from "react";
import styles from "./ProfilePage.module.css";
import { User, Post } from "lib/types";
import Pagination from "../../components/Pagination/Pagination";
import Link from "next/link";
import BlogCard from "../../components/BlogCard/BlogCard";
import ProfileImage from "../../components/ProfileImage/ProfileImage";

type UserCustom = Omit<User, "id" | "created_at" | "updated_at">;

type PostCustom = Pick<Post, "image_path" | "id" | "title" | "created_at"> & {
  users: { username: string };
  categories: { name: string | null };
};

type ProfileContentProps = {
  userProfile: UserCustom | null;
  initialPosts: PostCustom[];
};

export const ProfileContent = ({ userProfile, initialPosts }: ProfileContentProps) => {
  const [displayPosts, setDisplayPosts] = useState(initialPosts.slice(0, 9));
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setDisplayPosts(initialPosts.slice((currentPage - 1) * 9, currentPage * 9));
  }, [currentPage, initialPosts]);

  return (
    <main className={styles.container}>
      <div className={styles.profileContainer}>
        <h1 className={styles.profileTitle}>Profile</h1>
        <div className={`${styles.profileContainer} ${styles.flexContainer}`}>
          <ProfileImage presetImage={userProfile?.image_path ?? null} />

          <div className={styles.profileInfo}>
            <p>{userProfile?.username}</p>
            <p>{userProfile?.email ?? ""}</p>
          </div>
        </div>
      </div>

      <Pagination postNumber={initialPosts.length} currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <h1 className={styles.pageTitle}>Your Post</h1>
      <div className={styles.cardContainer}>
        {displayPosts.map((post) => (
          <Link href={`/posts/${post.id}`} key={post.id}>
            <BlogCard post={post} />
          </Link>
        ))}
      </div>

      <Pagination postNumber={initialPosts.length} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </main>
  );
};

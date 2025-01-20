"use client";
import { useParams } from "next/navigation";
import BlogCard from "../../components/BlogCard/BlogCard";
import DUMMY_POSTS from "../../data/dummyPosts";
import styles from "./ProfilePage.module.css"; // ProfilePage専用のCSSモジュールをインポート

export default function ProfilePage() {
  const params = useParams();
  const userId = params["user_id"];

  const filteredPosts = DUMMY_POSTS.filter((post) => post.user_id === userId);

  return (
    <main className={styles.container}>
      <h1 className={styles.pageTitle}>Your Post</h1>
      <div className={styles.cardContainer}>
        {filteredPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}

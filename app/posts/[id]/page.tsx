"use client";
import BlogMain from "@/app/components/BlogMain/BlogMain";
import Thumbnail from "@/app/components/Thumbnail/Thumbnail";
import React, { useState } from "react";
import styles from "./page.module.css";
import Comment from "@/app/components/Comment/Comment";
import { BlogComment, Post, ThumbnailPost } from "@/lib/types";

// ダミーデータ
const mainPost: Post = {
  id: 0,
  title: "初投稿",
  blogImagePath: "/main_blog.jpg",
  textLine: "はじめましてジャミーです。これからブログの記事を作成したいと思います。",
  userName: "zameemallik",
  userImagePath: "/default_icon.jpg",
};

const thumbnailPosts: ThumbnailPost[] = [
  {
    id: 1,
    title: "あいうえおかきくけこあいうえおかきくけこあいうえおかきくけこあいうえおかきくけこあいうえおかきくけこ",
    imagePath: "/muffler.jpg",
  },
  { id: 2, title: "Post Title", imagePath: "/muffler.jpg" },
  { id: 3, title: "Post Title", imagePath: "/muffler.jpg" },
];

const comments: BlogComment[] = [
  {
    id: 1,
    userName: "user1",
    userImagePath: "/default_icon.jpg",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula nibh, interdum non enim sit amet, iaculis aliquet nunc.",
    updatedTime: new Date(),
  },
  {
    id: 2,
    userName: "user2",
    userImagePath: "/default_icon.jpg",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula nibh, interdum non enim sit amet, iaculis aliquet nunc.",
    updatedTime: new Date(new Date().setMinutes(new Date().getMinutes() - 59)),
  },
  {
    id: 3,
    userName: "user2",
    userImagePath: "/default_icon.jpg",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula nibh, interdum non enim sit amet, iaculis aliquet nunc.",
    updatedTime: new Date(new Date().setMinutes(new Date().getMinutes() - 60)),
  },
  {
    id: 4,
    userName: "user2",
    userImagePath: "/default_icon.jpg",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula nibh, interdum non enim sit amet, iaculis aliquet nunc.",
    updatedTime: new Date(new Date().setHours(new Date().getHours() - 23)),
  },
  {
    id: 5,
    userName: "user2",
    userImagePath: "/default_icon.jpg",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula nibh, interdum non enim sit amet, iaculis aliquet nunc.",
    updatedTime: new Date(new Date().setHours(new Date().getHours() - 24)),
  },
];
// ダミーデータ終了

const BlogPage = ({ params }: { params: { id: string } }) => {
  // npm run lint実行時の”Error: 'params' is defined but never used.”エラー回避用に一時的にparamsをconsoleで出力する。
  // eslint-disable-next-line no-console
  console.log(params.id);

  // ここで、idをもとにblogの詳細情報を取得してくる。
  // const mainPost = getMainBlogFromId(params.id)

  // ここで、mainPostのuserNameをもとにthumbnailように最新の記事を3つ取得してくる。
  // const thumbnailPosts = getThumbnail(mainPost.userName)

  // ここでidをもとにコメントを取得する。
  // const comments = getComments(params.id)

  const [commentText, setCommentText] = useState("");
  const [commentList, setCommentList] = useState(comments);

  const handleCommentSubmit = () => {
    //本来はAPIでデータ追加。
    if (commentText.trim()) {
      const newComment = {
        id: commentList.length + 1,
        userName: "currentUser", // 現在のユーザー名を設定
        userImagePath: "", //現在ユーザーのプロフィール画像pathを設定。
        text: commentText,
        updatedTime: new Date(),
      };
      setCommentList([...commentList, newComment]);
      setCommentText("");
    }
    //データ追加後、pageリロード。
  };
  return (
    <div className={styles.container}>
      {/* Main Post */}
      <BlogMain post={mainPost}></BlogMain>
      {/* More Posts */}
      <section className={styles.thumbnailSection}>
        <h2 className={styles.thumbnailHeaderTitle}>More Posts</h2>
        <div className={styles.postsContainer}>
          {thumbnailPosts.map((post) => (
            <Thumbnail post={post} key={post.id} />
          ))}
        </div>
      </section>

      {/* Comments */}
      <section className={styles.commentsSection}>
        <h2 className={styles.commentsTitle}>Comments</h2>
        <div className={styles.commentInputContainer}>
          <input
            type="text"
            placeholder="Your Comment..."
            className={styles.commentInput}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            maxLength={1000}
          />
          <button className={styles.commentButton} onClick={handleCommentSubmit}>
            Comment
          </button>
        </div>
        {commentList.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </section>
    </div>
  );
};

export default BlogPage;

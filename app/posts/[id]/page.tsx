"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Comment, Post } from "lib/types";
import BlogMain from "@components/BlogMain/BlogMain";
import Thumbnail from "@components/Thumbnail/Thumbnail";
import CommentCard from "@components/CommentCard/CommentCard";
import { supabase } from "lib/util/supabase";
// ダミーデータ

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

// const mainPost: Post = {
//   id: 0,
//   title: "初投稿",
//   image_path: "/main_blog.jpg",
//   textLine: "はじめましてジャミーです。これからブログの記事を作成したいと思います。",
//   user_id: "zameemallik",
//   // userImagePath: "/default_icon.jpg",
//   category_id: "",
//   created_at: "",
//   updated_at: "",
//   // categories: [],
//   // users: [],
// };

// const thumbnailPosts: ThumbnailPost[] = [
//   {
//     id: 1,
//     title: "あいうえおかきくけこあいうえおかきくけこあいうえおかきくけこあいうえおかきくけこあいうえおかきくけこ",
//     imagePath: "/muffler.jpg",
//   },
//   { id: 2, title: "Post Title", imagePath: "/muffler.jpg" },
//   { id: 3, title: "Post Title", imagePath: "/muffler.jpg" },
// ];

type CommentCustom = Omit<Comment, "post_id" | "created_at"> & {
  users: { name: string; image_path: string };
};

// 暫定的なダミーデータ
const comments: CommentCustom[] = [
  {
    id: 1,
    content: "Lorem ipsum dolor sit amet...",  // textをcontentに
    user_id: "user2_id",                      // 追加
    updated_at: new Date().toISOString(),     // updatedTimeをupdated_atに
    users: {                                  // ユーザー情報をネスト
      name: "user2",
      image_path: "/default_icon.jpg"
    }
  },
  {
    id: 2,
    content: "Lorem ipsum dolor sit amet...",  // textをcontentに
    user_id: "user2_id",                      // 追加
    updated_at: new Date().toISOString(),     // updatedTimeをupdated_atに
    users: {                                  // ユーザー情報をネスト
      name: "user2",
      image_path: "/default_icon.jpg"
    }
  },
  {
    id: 3,
    content: "Lorem ipsum dolor sit amet...",  // textをcontentに
    user_id: "user2_id",                      // 追加
    updated_at: new Date().toISOString(),     // updatedTimeをupdated_atに
    users: {                                  // ユーザー情報をネスト
      name: "user2",
      image_path: "/default_icon.jpg"
    }
  },
  {
    id: 4,
    content: "Lorem ipsum dolor sit amet...",  // textをcontentに
    user_id: "user2_id",                      // 追加
    updated_at: new Date().toISOString(),     // updatedTimeをupdated_atに
    users: {                                  // ユーザー情報をネスト
      name: "user2",
      image_path: "/default_icon.jpg"
    }
  },
];
// ダミーデータ終了

const BlogPage = ({ params }: { params: { id: string } }) => {
  // npm run lint実行時の”Error: 'params' is defined but never used.”エラー回避用に一時的にparamsをconsoleで出力する。
  // eslint-disable-next-line no-console

  const [post, setPost] = useState<Post | null>(null);
  const [thumbnailPosts, setThumbnailPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        return;
      }
      if (data) {
        setPost(data);
        const { data: thumbnails, error } = await supabase
          .from("posts")
          .select("*")
          .neq("id", params.id)
          .order('created_at', { ascending: false })
          .limit(3);
        setThumbnailPosts(thumbnails || [])
      }
    };
    fetchPost();
  }, [params.id]);

  // ここで、idをもとにblogの詳細情報を取得してくる。
  // const mainPost = getMainBlogFromId(params.id)

  // ここで、mainPostのuserNameをもとにthumbnailように最新の記事を3つ取得してくる。
  // const thumbnailPosts = getThumbnail(mainPost.userName)

  // ここでidをもとにコメントを取得する。
  // const comments = getComments(params.id)

  const [commentText, setCommentText] = useState("");
  const [commentList, setCommentList] = useState<CommentCustom[]>(comments);

  const handleCommentSubmit = () => {
    //本来はAPIでデータ追加。
    // if (commentText.trim()) {
    //   const newComment = {
    //     id: commentList.length + 1,
    //     userName: "currentUser", // 現在のユーザー名を設定
    //     userImagePath: "", //現在ユーザーのプロフィール画像pathを設定。
    //     text: commentText,
    //     updatedTime: new Date(),
    //   };
    //   setCommentList([...commentList, newComment]);
    //   setCommentText("");
    // }
    //データ追加後、pageリロード。
  };
  return (
    <div className={styles.container}>
      {/* Main Post */}
      {post && <BlogMain post={post} />}
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
          <CommentCard comment={comment} key={comment.id} />
        ))}
      </section>
    </div>
  );
};

export default BlogPage;

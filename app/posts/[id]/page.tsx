"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Comment, Post } from "lib/types";
import BlogMain from "@components/BlogMain/BlogMain";
import Thumbnail from "@components/Thumbnail/Thumbnail";
import CommentCard from "@components/CommentCard/CommentCard";
import { supabase } from "lib/util/supabase";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type CommentCustom = Omit<Comment, "post_id" | "created_at"> & {
  users: { name: string; image_path: string };
};

// 暫定的なダミーデータ
const comments: CommentCustom[] = [
  {
    id: 1,
    content: "Lorem ipsum dolor sit amet...", // textをcontentに
    user_id: "user2_id", // 追加
    updated_at: new Date().toISOString(), // updatedTimeをupdated_atに
    users: {
      // ユーザー情報をネスト
      name: "user2",
      image_path: "/default_icon.jpg",
    },
  },
  {
    id: 2,
    content: "Lorem ipsum dolor sit amet...", // textをcontentに
    user_id: "user2_id", // 追加
    updated_at: new Date().toISOString(), // updatedTimeをupdated_atに
    users: {
      // ユーザー情報をネスト
      name: "user2",
      image_path: "/default_icon.jpg",
    },
  },
  {
    id: 3,
    content: "Lorem ipsum dolor sit amet...", // textをcontentに
    user_id: "user2_id", // 追加
    updated_at: new Date().toISOString(), // updatedTimeをupdated_atに
    users: {
      // ユーザー情報をネスト
      name: "user2",
      image_path: "/default_icon.jpg",
    },
  },
  {
    id: 4,
    content: "Lorem ipsum dolor sit amet...", // textをcontentに
    user_id: "user2_id", // 追加
    updated_at: new Date().toISOString(), // updatedTimeをupdated_atに
    users: {
      // ユーザー情報をネスト
      name: "user2",
      image_path: "/default_icon.jpg",
    },
  },
];
// ダミーデータ終了

const BlogPage = ({ params }: { params: { id: string } }) => {
  // npm run lint実行時の”Error: 'params' is defined but never used.”エラー回避用に一時的にparamsをconsoleで出力する。
  // eslint-disable-next-line no-console

  const { data: session } = useSession();

  const [post, setPost] = useState<Post | null>(null);
  const [thumbnailPosts, setThumbnailPosts] = useState<Post[]>([]);

  // error message for comment submit
  const [error, setError] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      //ブログ記事取得
      const { data, error } = await supabase.from("posts").select("*").eq("id", params.id).single();

      if (error) {
        return;
      }

      const { commentData, error } = await supabase
        .from("comment")
        .select("*")
        .eq("id", params.id);

      // サムネイル取得
      if (data) {
        setPost(data);
        const { data: thumbnails } = await supabase
          .from("posts")
          .select("*")
          .neq("id", params.id)
          .order("created_at", { ascending: false })
          .limit(3);
        setThumbnailPosts(thumbnails || []);
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
  const [commentList] = useState<CommentCustom[]>(comments);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await fetch(`/api/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: params.id,  // 現在の投稿ID
          content: commentText,
          created_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('コメントを投稿するにはログインが必要です');
          setIsErrorModalOpen(true);
          return;
        }
        throw new Error('コメントの投稿に失敗しました');
      }

      // コメント投稿成功
      setCommentText('');  // 入力フィールドをクリア
      router.refresh();    // ページを更新して新しいコメントを表示

    } catch (error) {
      setError('コメントの投稿中にエラーが発生しました');
      setIsErrorModalOpen(true);
    }
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
            maxLength={300}
          />
          <button className={session ? styles.commentButton : styles.commentButtonDisabled}
            onClick={handleCommentSubmit} disabled={!session}>
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

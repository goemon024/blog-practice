"use client";

import React from "react";
import styles from "./CommentCard.module.css";
import UserIconButton from "../UserIconButton/UserIconButton";

import { Comment } from "lib/types";
import calculateTimeAgo from "lib/util/calculateTimeAgo";
import { useSession } from "next-auth/react";
import Link from "next/link";

type CommentCustom = Pick<Comment, "id" | "content" | "created_at"> & {
  users: { username: string; image_path: string | null };
};

type Props = {
  comment: CommentCustom;
  onDelete?: (commentId: number) => void;
};

const CommentCard = ({ comment, onDelete }: Props) => {
  const commentTime = calculateTimeAgo(new Date(comment.created_at));
  const { data: session } = useSession();

  // const router = useRouter();
  // const redirectToUserProfile = () => {
  //   // router.push(`/user/${comment.user_id}`);
  //   router.push(`/`);
  // };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(Number(comment.id));
    }
  };

  return (
    <div key={comment.id} className={styles.comment}>
      <div className={styles.userSection}>
        <Link href={`/profile/${comment.users.username}`}>
          <UserIconButton
            imagePath={comment.users.image_path ?? ""}
            // onClick={redirectToUserProfile}
          />
        </Link>
        <span className={styles.commentName}>{comment.users.username}</span>
      </div>
      <div className={styles.commentContent}>
        <p className={styles.commentText}>{comment.content}</p>
        <span className={styles.commentTime}>{commentTime}</span>
      </div>
      {session?.user?.username === comment.users.username && <button onClick={handleDelete}>削除</button>}
    </div>
  );
};

export default CommentCard;

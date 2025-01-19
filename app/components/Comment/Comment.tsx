import React from "react";
import styles from "./Comment.module.css";
import { BlogComment } from "@/lib/types";
import calculateTimeAgo from "@/lib/util/calculateTimeAgo";
import UserIconButton from "../UserIconButton/UserIconButton";
import { useRouter } from "next/navigation";

type Props = {
  comment: BlogComment;
};

const Comment = ({ comment }: Props) => {
  const commentTime = calculateTimeAgo(comment.updatedTime);
  const router = useRouter();

  const redirectToUserProfile = () => {
    router.push(`/user/${comment.userName}`);
  };
  return (
    <div key={comment.id} className={styles.comment}>
      <UserIconButton imagePath={comment.userImagePath} onClick={redirectToUserProfile} />
      <div className={styles.commentContent}>
        <p className={styles.commentText}>{comment.text}</p>
        <span className={styles.commentTime}>{commentTime}</span>
      </div>
    </div>
  );
};

export default Comment;

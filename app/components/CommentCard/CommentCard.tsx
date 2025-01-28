import React from "react";
import styles from "./CommentCard.module.css";
import UserIconButton from "../UserIconButton/UserIconButton";
import { useRouter } from "next/navigation";
import { BlogComment } from "lib/types";
import calculateTimeAgo from "lib/util/calculateTimeAgo";

type Props = {
  comment: BlogComment;
};

const CommentCard = ({ comment }: Props) => {
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

export default CommentCard;

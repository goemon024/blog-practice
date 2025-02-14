import React from "react";
import styles from "./CommentCard.module.css";
import UserIconButton from "../UserIconButton/UserIconButton";
import { useRouter } from "next/navigation";
import { Comment } from "lib/types";
import calculateTimeAgo from "lib/util/calculateTimeAgo";

type CommentCustom = Omit<Comment, "post_id" | "created_at"> & {
  users: { name: string; image_path: string };
};

type Props = {
  comment: CommentCustom;
};

const CommentCard = ({ comment }: Props) => {
  const commentTime = calculateTimeAgo(new Date(comment.updated_at));
  const router = useRouter();

  const redirectToUserProfile = () => {
    router.push(`/user/${comment.user_id}`);
  };
  return (
    <div key={comment.id} className={styles.comment}>
      <UserIconButton imagePath={comment.users.image_path} onClick={redirectToUserProfile} />
      <div className={styles.commentContent}>
        <p className={styles.commentText}>{comment.content}</p>
        <span className={styles.commentTime}>{commentTime}</span>
      </div>
    </div>
  );
};

export default CommentCard;

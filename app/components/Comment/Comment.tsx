import Link from "next/link";
import React from "react";
import styles from "./Comment.module.css";
import { BlogComment } from "@/lib/types";
import calculateTimeAgo from "@/lib/util/calculateTimeAgo";

type Props = {
  comment: BlogComment;
};

const Comment = ({ comment }: Props) => {
  const commentTime = calculateTimeAgo(comment.updatedTime);
  return (
    <div key={comment.id} className={styles.comment}>
      <Link href={`/user/${comment.userName}`} className={styles.commentUserIcon}>
        <img
          src={comment.userImagePath}
          alt="icon"
          className={styles.userIcon}
          aria-label={`Go to ${comment.userName}'s profile`}
        ></img>
      </Link>
      <div className={styles.commentContent}>
        <p className={styles.commentText}>{comment.text}</p>
        <span className={styles.commentTime}>{commentTime}</span>
      </div>
    </div>
  );
};

export default Comment;

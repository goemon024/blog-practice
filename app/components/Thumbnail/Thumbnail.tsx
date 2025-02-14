import React from "react";
import styles from "./Thumbnail.module.css";
import { Post } from "lib/types";
import Link from "next/link";

type Props = {
  post: Post;
};

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

const Thumbnail: React.FC<Props> = ({ post }) => {
  const imagePath = post.image_path ?? "/default_icon.jpg";
  return (
    <Link href={`/posts/${post.id}`} key={post.id} className={styles.postItem}>
      <img src={imagePath} alt={post.title} width={250} height={150} />
      <h2>{post.title}</h2>
    </Link>
  );
};

export default Thumbnail;

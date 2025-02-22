import styles from "./BlogCard.module.css";
import calculateTimeAgo from "lib/util/calculateTimeAgo";
import { Post } from "lib/types";

type PostCustom = Pick<Post, "image_path" | "id" | "title" | 'created_at'> & {
  users: { username: string | null };
  categories: { name: string | null };
}

type Props = {
  post: PostCustom;
};

export default function BlogCard({ post }: Props) {

  const formattedDate = calculateTimeAgo(new Date(post.created_at));

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={post.image_path ?? ""} alt={post.title} className={styles.image} />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{post.title}</h2>

        <div>
          <span>{formattedDate} </span>
          <span>{post.users?.username ?? ""}</span>

        </div>
        {/* <p className={styles.description}>{post.content}</p> */}
      </div>
    </div>
  );
}

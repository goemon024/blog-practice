import styles from "./BlogCard.module.css";

interface Post {
  id: string;
  user_id: string;
  title: string;
  image_path: string;
  category_id: string;
  created_at: string;
  updated_at: string;
  content: string;
}

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={post.image_path} alt={post.title} className={styles.image} />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{post.title}</h2>
        <div className={styles.meta}>
          <span className={styles.category}>{post.category_id}</span>
          <span>{post.created_at}</span>
        </div>
        <p className={styles.description}>{post.content}</p>
      </div>
    </div>
  );
}

import styles from "./BlogMain.module.css";
import { Post } from "@/lib/types";
import UserIconButton from "../UserIconButton/UserIconButton";
import { useRouter } from "next/navigation";

type Props = {
  post: Post;
};

const BlogMain: React.FC<Props> = ({ post }) => {
  const router = useRouter();

  const redirectToUserProfile = () => {
    router.push(`/user/${post.userName}`);
  };

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>
        <UserIconButton imagePath={post.userImagePath} onClick={redirectToUserProfile} />
      </div>

      {/* Main Image */}
      <div className={styles.mainImage}>
        <img src={`${post.blogImagePath}`} alt="no image" className={styles.mainImageContent}></img>
      </div>
      {/* Text Content */}
      <div className={styles.textContent}>
        <p className={styles.textLine}>{post.textLine}</p>
      </div>
    </div>
  );
};
export default BlogMain;

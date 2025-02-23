import { Comment, Post } from "lib/types";
import { supabase } from "lib/util/supabase";
import { BlogContent } from "./BlogContent";

type CommentCustom = Omit<Comment, "post_id" | "user_id" | "updated_at"> & {
  users: { username: string | null; image_path: string | null };
};

export default async function BlogPage({ params }: { params: { id: string } }) {
  // データフェッチをサーバーサイドに移動
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .single() as { data: Post };

  const { data: commentData } = await supabase
    .from("comment")
    .select(
      `
      id,
      content,
      created_at,
      users(
        username,
        image_path
      )`,
    )
    .eq("post_id", params.id)
    .order("created_at", { ascending: false })
    .returns<CommentCustom[]>();

  const { data: thumbnails } = await supabase
    .from("posts")
    .select("*")
    .neq("id", params.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return <BlogContent initialPost={post} initialComments={commentData ?? []} thumbnailPosts={thumbnails ?? []} />;
}

// const BlogPage = ({ params }: { params: { id: string } }) => {

//   const { data: session } = useSession();
//   const [post, setPost] = useState<Post | null>(null);
//   const [thumbnailPosts, setThumbnailPosts] = useState<Post[]>([]);

//   // error message for comment submit
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
//   // コメント群取得
//   const [comments, setComments] = useState<CommentCustom[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchPost = async () => {
//       //ブログ記事取得
//       const { data, error } = await supabase.from("posts").select("*").eq("id", params.id).single();

//       if (error) {
//         return;
//       }

//       // コメント取得
//       if (data) {
//         const { data: commentData, error: commentError } = await supabase
//           .from("comment")
//           .select<string, CommentCustom>(`
//           id,
//           content,
//           created_at,
//           users(
//             username,
//             image_path
//           )`)
//           .eq('post_id', params.id)
//           .order('created_at', { ascending: false });

//         const formattedComments: CommentCustom[] = (commentData || []).map(comment => ({
//           id: comment.id,
//           content: comment.content,
//           created_at: comment.created_at,
//           users: {
//             username: comment.users.username,
//             image_path: comment.users.image_path
//           }
//         }));

//         setComments(formattedComments || []);
//       }

//       // サムネイル取得
//       if (data) {
//         setPost(data);
//         const { data: thumbnails } = await supabase
//           .from("posts")
//           .select("*")
//           .neq("id", params.id)
//           .order("created_at", { ascending: false })
//           .limit(3);
//         setThumbnailPosts(thumbnails || []);
//       }
//     };
//     fetchPost();
//   }, [params.id]);

//   // ここで、idをもとにblogの詳細情報を取得してくる。
//   // const mainPost = getMainBlogFromId(params.id)

//   // ここで、mainPostのuserNameをもとにthumbnailように最新の記事を3つ取得してくる。
//   // const thumbnailPosts = getThumbnail(mainPost.userName)

//   // ここでidをもとにコメントを取得する。
//   // const comments = getComments(params.id)

//   const [commentText, setCommentText] = useState("");
//   const [commentList] = useState<CommentCustom[]>(comments);

//   const handleCommentSubmit = async () => {
//     if (!commentText.trim()) return;

//     try {
//       const response = await fetch(`/api/comment`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           post_id: params.id,  // 現在の投稿ID
//           content: commentText,
//           created_at: new Date().toISOString(),
//         }),
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           setErrorMessage('コメントを投稿するにはログインが必要です');
//           setIsErrorModalOpen(true);
//           return;
//         }
//         throw new Error('コメントの投稿に失敗しました');
//       }

//       // コメント投稿成功
//       setCommentText('');  // 入力フィールドをクリア
//       // router.push(`/posts/${params.id}`);    // ページを更新して新しいコメントを表示
//       // router.refresh();
//       window.location.reload();

//     } catch (error) {
//       setErrorMessage('コメントの投稿中にエラーが発生しました');
//       setIsErrorModalOpen(true);
//     }
//   };

//   const handleDeleteComment = async (commentId: number) => {
//     try {
//       const response = await fetch(`/api/comment/${commentId}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         throw new Error('コメントの削除に失敗しました');
//       }

//       // 成功したら、コメントリストを更新
//       setComments(prevComments =>
//         prevComments.filter(comment => comment.id !== commentId)
//       );
//     } catch (error) {
//       setErrorMessage('コメントの削除中にエラーが発生しました');
//       setIsErrorModalOpen(true);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       {/* Main Post */}
//       {post && <BlogMain post={post} />}
//       {/* More Posts */}
//       <section className={styles.thumbnailSection}>
//         <h2 className={styles.thumbnailHeaderTitle}>More Posts</h2>
//         <div className={styles.postsContainer}>
//           {thumbnailPosts.map((post) => (
//             <Thumbnail post={post} key={post.id} />
//           ))}
//         </div>
//       </section>

//       {/* Comments */}
//       <section className={styles.commentsSection}>
//         <h2 className={styles.commentsTitle}>Comments</h2>
//         <div className={styles.commentInputContainer}>
//           <input
//             type="text"
//             placeholder="Your Comment..."
//             className={styles.commentInput}
//             value={commentText}
//             onChange={(e) => setCommentText(e.target.value)}
//             maxLength={300}
//           />
//           <button className={session ? styles.commentButton : styles.commentButtonDisabled}
//             onClick={handleCommentSubmit} disabled={!session}>
//             Comment
//           </button>
//         </div>
//         {comments.map((comment) => (
//           <CommentCard comment={comment} key={comment.id} onDelete={handleDeleteComment} />
//         ))}
//       </section>
//     </div>
//   );
// };

// export default BlogPage;

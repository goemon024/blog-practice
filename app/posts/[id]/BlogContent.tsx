'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import styles from './BlogContent.module.css';
import BlogMain from '../../components/BlogMain/BlogMain';
import { Post, Comment } from 'lib/types';
import { useRouter } from 'next/navigation';
import Thumbnail from '../../components/Thumbnail/Thumbnail';
import CommentCard from '../../components/CommentCard/CommentCard';


type BlogContentProps = {
    initialPost: Post;
    initialComments: CommentCustom[];
    thumbnailPosts: Post[];
};

type CommentCustom = Omit<Comment, "post_id" | "user_id" | "updated_at"> & {
    users: { username: string | null; image_path: string | null };
};

export const BlogContent = ({
    initialPost,
    initialComments,
    thumbnailPosts
}: BlogContentProps) => {

    const { data: session } = useSession();
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState(initialComments);

    // const [post, setPost] = useState<Post | null>(null);
    // const [thumbnailPosts, setThumbnailPosts] = useState<Post[]>([]);

    // error message for comment submit
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    // コメント群取得


    const router = useRouter();


    // コメント投稿などのインタラクティブな機能
    const handleCommentSubmit = async () => {
        if (!commentText.trim()) return;

        try {
            const response = await fetch(`/api/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: initialPost.id,  // 現在の投稿ID
                    content: commentText,
                    created_at: new Date().toISOString(),
                }),
            });

            // const result = await response.json();
            // console.log('New comment data:', result.data);  // デバッグ用
            // setComments(prev => [result.data, ...prev]);


            if (!response.ok) {
                if (response.status === 401) {
                    setErrorMessage('コメントを投稿するにはログインが必要です');
                    setIsErrorModalOpen(true);
                    return;
                }
                throw new Error('コメントの投稿に失敗しました');
            }

            // コメント投稿成功
            setCommentText('');
            // router.refresh();
            window.location.reload();

        } catch (error) {
            setErrorMessage('コメントの投稿中にエラーが発生しました');
            setIsErrorModalOpen(true);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            const response = await fetch(`/api/comment/${commentId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('コメントの削除に失敗しました');
            }

            // 成功したら、コメントリストを更新
            setComments(prevComments =>
                prevComments.filter(comment => comment.id !== commentId)
            );
        } catch (error) {
            setErrorMessage('コメントの削除中にエラーが発生しました');
            setIsErrorModalOpen(true);
        }
    };

    return (
        <div className={styles.container}>
            {/* Main Post */}
            {initialPost && <BlogMain post={initialPost} />}
            {/* More Posts */}
            <section className={styles.thumbnailSection}>
                <h2 className={styles.thumbnailHeaderTitle}>More Posts</h2>
                <div className={styles.postsContainer}>
                    {thumbnailPosts.map((post) => (
                        <Thumbnail post={post} key={post.id} />
                    ))}
                </div>
            </section>

            {/* Comments */}
            <section className={styles.commentsSection}>
                <h2 className={styles.commentsTitle}>Comments</h2>
                <div className={styles.commentInputContainer}>
                    <input
                        type="text"
                        placeholder="Your Comment..."
                        className={styles.commentInput}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        maxLength={300}
                    />
                    <button className={session ? styles.commentButton : styles.commentButtonDisabled}
                        onClick={handleCommentSubmit} disabled={!session}>
                        Comment
                    </button>
                </div>
                {comments.map((comment) => (
                    <CommentCard comment={comment} key={comment.id} onDelete={handleDeleteComment} />
                ))}
            </section>
        </div>

    );
};
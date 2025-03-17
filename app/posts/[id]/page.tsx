import { Post } from "lib/types";

import { BlogContent } from "./BlogContent";
import { getOnePost, getAllPosts } from "lib/db/posts";
import { getComment } from "lib/db/comment";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

type thumnailPost = Pick<Post, "id" | "title" | "image_path">;

export default async function BlogPage({ params }: { params: { id: string } }) {
  const post: Post | null = await getOnePost(params.id);
  if (!post) {
    throw new Error("Post not found");
  }

  const commentData = await getComment(params.id);

  const preThumbnailPosts = await getAllPosts({ limit: 3 });
  const thumbnails: thumnailPost[] = preThumbnailPosts.map((post) => ({
    id: post.id,
    title: post.title,
    image_path: post.image_path,
  }));

  return <BlogContent initialPost={post} initialComments={commentData ?? []} thumbnailPosts={thumbnails ?? []} />;
}

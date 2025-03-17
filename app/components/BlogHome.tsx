import type { Post } from "lib/types/index";
import { BlogHomeContent } from "./BlogHomeContent";

type PostCustom = Pick<Post, "id" | "title" | "content" | "image_path" | "created_at"> & {
  users: { username: string };
  categories: { name: string };
};

export default async function BlogHome({ initialPosts }: { initialPosts: PostCustom[] }) {
  return <BlogHomeContent initialPosts={initialPosts ?? []} />;
}

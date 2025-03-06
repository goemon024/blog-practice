import React from "react";
// import Pagination from "./components/Pagination/Pagination";

import BlogHome from "./components/BlogHome";
import prisma from "lib/util/prisma";
import { Post } from "lib/types/index";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

type PostCustom = Pick<Post, "id" | "title" | "content" | "image_path" | "created_at"> & {
  users: { username: string };
  categories: { name: string };
};


export default async function Home() {
  const posts: PostCustom[] = await prisma.posts.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      image_path: true,
      created_at: true,
      users: {
        select: {
          username: true,
        },
      },
      categories: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });


  return (
    <div>
      <BlogHome initialPosts={posts} />
    </div>
  );
}

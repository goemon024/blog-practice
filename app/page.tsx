import React from "react";

import BlogHome from "./components/BlogHome";
// import prisma from "lib/util/prisma";
import { getAllPosts } from "lib/db/posts";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function Home() {
  const posts = await getAllPosts({});
  // const posts: PostCustom[] = await prisma.posts.findMany({
  //   select: {
  //     id: true,
  //     title: true,
  //     content: true,
  //     image_path: true,
  //     created_at: true,
  //     users: {
  //       select: {
  //         username: true,
  //       },
  //     },
  //     categories: {
  //       select: {
  //         name: true,
  //       },
  //     },
  //   },
  //   orderBy: {
  //     created_at: "desc",
  //   },
  // });

  return (
    <div>
      <BlogHome initialPosts={posts} />
    </div>
  );
}

import React from "react";

import BlogHome from "./components/BlogHome";
// import prisma from "lib/util/prisma";
import { getAllPosts } from "lib/db/posts";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function Home() {
  const posts = await getAllPosts({});

  return (
    <div>
      <BlogHome initialPosts={posts} />
    </div>
  );
}

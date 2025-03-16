import prisma from "lib/util/prisma";
import { Post } from "lib/types/index";

type PostCustom = Pick<Post, "id" | "title" | "content" | "image_path" | "created_at"> & {
  users: { username: string };
  categories: { name: string };
};

export async function getAllPosts({ username, limit }: { username?: string; limit?: number }): Promise<PostCustom[]> {
  return await prisma.posts.findMany({
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
    ...(username && {
      where: {
        users: {
          username: username,
        },
      },
    }),
    ...(limit && {
      take: limit,
    }),
    orderBy: {
      created_at: "desc",
    },
  });
}

export async function getOnePost(id: string): Promise<Post | null> {
  return await prisma.posts.findUnique({
    where: {
      id: BigInt(id),
    },
  });
}

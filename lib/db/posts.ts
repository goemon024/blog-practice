import prisma from "lib/util/prisma";
import { Post, EditPostInput, CreatePostInput } from "lib/types/index";

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

export async function deletePost(id: string) {
  return await prisma.posts.delete({
    where: { id: BigInt(id) },
  });
}

export async function editPost(updateData: EditPostInput) {
  return await prisma.posts.update({
    where: {
      id: BigInt(updateData.id),
    },
    data: {
      title: updateData.title,
      content: updateData.content,
      category_id: BigInt(updateData.category_id),
      image_path: updateData.image_path,
    }
  })
}

export async function createPost(createInput: CreatePostInput) {
  return await prisma.posts.create({
    data: {
      title: createInput.title,
      content: createInput.content,
      image_path: createInput.image_path,
      user_id: createInput.user_id,
      category_id: BigInt(createInput.category_id),
    },
  });
}

import prisma from "lib/util/prisma";
import { Comment, CreateCommentInput } from "lib/types/index";

type CommentCustom = Pick<Comment, "id" | "content" | "created_at"> & {
  users: { username: string; image_path: string | null };
};

export async function getComment(post_id: string): Promise<CommentCustom[]> {
  return await prisma.comment.findMany({
    where: { post_id: BigInt(post_id) },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      content: true,
      created_at: true,
      users: {
        select: {
          username: true,
          image_path: true,
        },
      },
    },
  });
}

export async function getOneComment(comment_id: string) {
  return await prisma.comment.findUnique({
    where: {
      id: BigInt(comment_id),
    },
    select: {
      id: true,
      users: {
        select: {
          username: true,
        },
      },
    },
  });
}

export async function deleteComment(comment_id: string) {
  return await prisma.comment.delete({
    where: {
      id: BigInt(comment_id),
    },
  });
}

export async function createComment(data: CreateCommentInput) {
  return await prisma.comment.create({
    data: {
      content: data.content,
      user_id: data.user_id,
      post_id: BigInt(data.post_id),
      created_at: new Date(data.created_at),
    },
  });
}

import prisma from "lib/util/prisma";
import { Comment } from "lib/types/index";

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

// export default async function getComment(post_id: string)
//     : Promise<CommentCustom | null> {

//     return await prisma.comment.findMany({
//         where: {
//             post_id: post_id,
//         },
//         select: {
//             username: true,
//             email: true,
//             image_path: true,
//         },
//     });

// }

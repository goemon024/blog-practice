import prisma from "lib/util/prisma";
import { User } from "lib/types/index";

type UserCustom = Pick<User, "username" | "image_path" | "email">;

export default async function getUserProfile(username: string): Promise<UserCustom | null> {
  return await prisma.public_users.findUnique({
    where: {
      username: username,
    },
    select: {
      username: true,
      email: true,
      image_path: true,
    },
  });
}

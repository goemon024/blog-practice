import prisma from "lib/util/prisma";
import { User, UpdateUserProfileInput } from "lib/types/index";

type UserCustom = Pick<User, "username" | "image_path" | "email">;

export async function getUserProfile(username: string): Promise<UserCustom | null> {
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

export async function updateUserProfile(updateInput: UpdateUserProfileInput) {
  await prisma.public_users.update({
    where: {
      id: updateInput.id,
    },
    data: {
      image_path: updateInput.image_path,
    },
  });
}

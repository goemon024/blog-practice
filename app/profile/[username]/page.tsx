import { ProfileContent } from "./ProfileContent";
import { getAllPosts } from "lib/db/posts";
import { getUserProfile } from "lib/db/profile";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const userData = await getUserProfile(params.username);

  const postData = await getAllPosts({ username: params.username });

  return <ProfileContent userProfile={userData} initialPosts={postData} />;
}

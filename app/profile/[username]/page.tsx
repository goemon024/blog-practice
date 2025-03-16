// Server Component

import { ProfileContent } from "./ProfileContent";
// import { User } from "lib/types";
import { getAllPosts } from "lib/db/posts";
import getUserProfile from "lib/db/profile";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

// type UserCustom = Omit<User, "id" | "created_at" | "updated_at">;
// type UserCustom = Pick<User, "username" | "image_path" | "email">;

// type PostCustom = Pick<Post, "image_path" | "id" | "title" | "created_at"> & {
//   users: { username: string };
//   categories: { name: string | null };
// };

export default async function ProfilePage({ params }: { params: { username: string } }) {
  //   const userData: UserCustom | null = await prisma.public_users.findUnique({
  //     where: {
  //       username: params.username,
  //     },
  //     select: {
  //       username: true,
  //       email: true,
  //       image_path: true,
  //     },
  //   });

  const userData = await getUserProfile(params.username);

  const postData = await getAllPosts({ username: params.username });

  return <ProfileContent userProfile={userData} initialPosts={postData} />;
}

// "use client";

// import { useEffect, useState } from "react";
// import BlogCard from "../../components/BlogCard/BlogCard";
// import styles from "./ProfilePage.module.css"; // ProfilePage専用のCSSモジュールをインポート
// import { supabase } from "lib/util/supabase";
// import { User, Post } from "lib/types";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import Pagination from "../../components/Pagination/Pagination";
// import { useRef } from "react";
// import ProfileImage from "../../components/ProfileImage/ProfileImage";

// type UserCustom = Omit<User, "id" | "created_at" | "updated_at">

// type PostCustom = Pick<Post, "image_path" | "id" | "title" | 'created_at'> & {
//   users: { username: string };
//   categories: { name: string | null };
// }

// export default function ProfilePage({ params }: { params: { username: string } }) {
//   const [userProfile, setUserProfile] = useState<UserCustom | null>(null);
//   const [posts, setPosts] = useState<PostCustom[]>([]);
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   // const [image, setImage] = useState<File | null>(null);

//   const [displayPosts, setDisplayPosts] = useState<PostCustom[]>([]); // homeで表示される9つのブログ
//   const [currentPage, setCurrentPage] = useState<number>(1); // page番号。pagenationにpropsとして渡す。

//   // const userName = params["username"];

//   useEffect(() => {

//     const fetchUserProfile = async () => {
//       const { data: userData, error: userError } = await supabase
//         .from("users")
//         .select("username, email, image_path")
//         .eq("username", params.username)
//         .single<UserCustom>();

//       if (!userError && userData) {
//         setUserProfile(userData)
//       }

//       const { data: postData, error: postError } = await supabase
//         .from("posts")
//         .select(`title, image_path, id, created_at, categories(name), users!inner(
//           username
//         )`)
//         .eq("users.username", params.username)
//         .order("created_at", { ascending: false })
//         .returns<PostCustom[]>();

//       console.log(postData);

//       if (!postError && postData) {
//         setPosts(postData)
//       }

//     };

//     fetchUserProfile();
//   }, [session, status, params.username]);

//   // １ページ当たりの表示データ（９つ）取得。
//   useEffect(() => {
//     setDisplayPosts(posts.slice((currentPage - 1) * 9, currentPage * 9));
//   }, [currentPage, posts]);

//   // const filteredPosts = DUMMY_POSTS.filter((post) => post.user_id === userName);

//   return (
//     <main className={styles.container}>
//       <div className={styles.profileContainer}>
//         <h1 className={styles.profileTitle}>Profile</h1>
//         <div className={`${styles.profileContainer} ${styles.flexContainer}`}>

//           <ProfileImage presetImage={userProfile?.image_path ?? null} />

//           <div className={styles.profileInfo}>
//             <p>{userProfile?.username}</p>
//             <p>{userProfile?.email ?? ''}</p>
//           </div>
//         </div>
//       </div>

//       <Pagination postNumber={posts.length} currentPage={currentPage} setCurrentPage={setCurrentPage} />

//       <h1 className={styles.pageTitle}>Your Post</h1>
//       <div className={styles.cardContainer}>
//         {displayPosts.map((post) => (
//           <Link href={`/posts/${post.id}`} key={post.id}>
//             <BlogCard post={post} />
//           </Link>
//         ))}
//       </div>

//       <Pagination postNumber={posts.length} currentPage={currentPage} setCurrentPage={setCurrentPage} />

//     </main>
//   );
// }

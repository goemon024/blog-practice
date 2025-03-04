// import "./bloghome.css";
// import Link from "next/link";
// import SearchIcon from "@mui/icons-material/Search";
// import { useEffect, useState } from "react";
// import { supabase } from "lib/util/supabase";
import type { Post } from "lib/types/index";
import { BlogHomeContent } from "./BlogHomeContent";
import prisma from "lib/util/prisma";
// import Pagination from "./Pagination/Pagination";


// id: string;
// title: string;
// content: string;
// image_path?: string | null;
// category_id: number;
// user_id: string; // public_users.idと関連
// created_at: Date;
// updated_at?: Date | null;

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

type PostCustom = Pick<Post, "id" | "title" | "content" | "image_path" | "created_at"> & {
  users: { username: string };
  categories: { name: string };
};

export default async function PostHome() {

  const posts: PostCustom[] = await prisma.posts.findMany({
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
    orderBy: {
      created_at: 'desc', // created_atで降順にソート
    },
  })
  // } catch (error) {
  //   // eslint-disable-next-line no-console
  //   console.error("Error fetching posts:", error);
  // }
  //   const { data: posts }:{data:PostCustom[]} = await supabase
  // .from("posts")
  // .select(
  //   `
  //   id,
  //   title,
  //   content,
  //   image_path,
  //   created_at,
  //   users (username),
  //   categories (name)
  // `,
  // )
  // .order("created_at", { ascending: false })

  return <BlogHomeContent initialPosts={posts ?? []} />;
}

// "use client";

// import "./bloghome.css";
// import Link from "next/link";
// import SearchIcon from "@mui/icons-material/Search";
// import { useEffect, useState } from "react";
// import { supabase } from "lib/util/supabase";
// import type { Post } from "lib/types/index";
// import Pagination from "./Pagination/Pagination";

// type PostCustom = Post & {
//   users: { username: string | null };
//   categories: { name: string | null };
// };

// export default function PostHome() {
//   const [allPosts, setAllPosts] = useState<PostCustom[]>([]); // ブログ総数
//   const [filteredPosts, setFilteredPosts] = useState<PostCustom[]>([]); // 検索窓を反映して表示対象となる全ブログ
//   const [displayPosts, setDisplayPosts] = useState<PostCustom[]>([]); // homeで表示される9つのブログ
//   const [searchTerm, setSearchTerm] = useState<string>(""); // 検索ワード

//   const [currentPage, setCurrentPage] = useState<number>(1); // page番号。pagenationにpropsとして渡す。

//   // 初期レンダリング時の総ブログデータ取得
//   useEffect(() => {
//     const fetchBlog = async () => {
//       try {
//         const {
//           data,
//           error,
//         }: {
//           data: PostCustom[] | null;
//           error: any;
//         } = await supabase.from("posts").select("*,categories(*),users(*)").order("created_at", { ascending: false }); // 最新順にソート

//         if (error) throw new Error(error.message);

//         // console.log("Fetched Data:", data);

//         const formattedData = data?.map((post): PostCustom => {
//           const category = post.categories?.name || "未分類";
//           const author = post.users?.username || "匿名";
//           const postedAt = post.created_at && new Date(post.created_at).toLocaleString();

//           return {
//             id: post.id,
//             title: post.title,
//             content: post.content,
//             image_path: post.image_path,
//             category_id: post.category_id,
//             user_id: post.user_id,
//             created_at: postedAt,
//             updated_at: post.updated_at,
//             users: { username: author },
//             categories: { name: category },
//           };
//         });
//         // console.log("Formatted Data:", formattedData);
//         setAllPosts(formattedData || []);
//         setFilteredPosts(formattedData || []);
//       } catch (error) {
//         // eslint-disable-next-line no-console
//         console.error("Error fetching posts:", error);
//       }
//     };
//     fetchBlog();
//   }, []);

//   // 検索窓の状態に応じて表示対象となる全ブログ取得
//   useEffect(() => {
//     setFilteredPosts(
//       !searchTerm?.trim()
//         ? allPosts
//         : allPosts.filter(
//           (post) =>
//             post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             post.users.username?.toLowerCase().includes(searchTerm.toLowerCase()),
//         ),
//     );
//     setCurrentPage(1);
//   }, [searchTerm, allPosts]);

//   // １ページ当たりの表示データ（９つ）取得。
//   useEffect(() => {
//     setDisplayPosts(filteredPosts.slice((currentPage - 1) * 9, currentPage * 9));
//   }, [currentPage, filteredPosts]);

//   const TextLength = 100;

//   return (
//     <>
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Search Blog Post"
//           className="search-text"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <SearchIcon className="search-button">検索</SearchIcon>
//       </div>

//       <main className="blog-list">
//         {displayPosts.map((blog) => (
//           // ブログ記事クリック時に該当ページに遷移
//           <Link key={blog.id} href={`/posts/${blog.id}`}>
//             <article className="blog-card">
//               <img src={blog.image_path ?? ""} alt={blog.title} className="blog-image" />

//               <div className="blog-header">
//                 <h2 className="blog-title">{blog.title}</h2>
//                 <span className="blog-category">{blog.categories.name}</span>
//               </div>

//               <div className="blog-meta">
//                 <p className="blog-author">{blog.users.username}</p>
//                 <p className="blog-posted-at">{blog.created_at}</p>
//               </div>

//               <p className="blog-content">
//                 {blog.content.length > TextLength ? `${blog.content.slice(0, TextLength)}...` : blog.content}
//               </p>
//             </article>
//           </Link>
//         ))}
//       </main>
//       <Pagination postNumber={filteredPosts.length} currentPage={currentPage} setCurrentPage={setCurrentPage} />
//     </>
//   );
// }

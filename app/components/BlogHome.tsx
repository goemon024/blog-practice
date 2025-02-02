import "./bloghome.css";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { supabase } from "lib/util/supabase";
import type { Post } from "../../lib/types/index";
import Pagination from "./Pagination/Pagination";

export default function PostHome() {

  const [allPosts, setAllPosts] = useState<Post[]>([]);  // ブログ総数
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);  // 検索窓を反映して表示対象となる全ブログ
  const [displayPosts, setDisplayPosts] = useState<Post[]>([]);  // homeで表示される9つのブログ
  const [searchTerm, setSearchTerm] = useState<string>("");   // 検索ワード 

  const [currentPage, setCurrentPage] = useState<number>(1);  // page番号

  // 初期レンダリング時の総ブログデータ取得
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select(
            `
            id,
            title,
            content,
            image_path,
            categories(name) ,
            users(name) ,
            created_at
          `,
          )
          .order("created_at", { ascending: false }) // 最新順にソート

        if (error) throw new Error(error.message);

        // console.log("Fetched Data:", data);

        const formattedData = data.map((post) => {
          const category = post.categories.name || "未分類";
          const author = post.users.name || "匿名";
          const postedAt = post.created_at && new Date(post.created_at).toLocaleString();

          // console.log("Formatted Post:", {
          //   id: post.id,
          //   title: post.title,
          //   textLine: post.content,
          //   image_path: post.image_path,
          //   category: category,
          //   userName: author,
          //   userImagePath: "",
          //   postedAt: postedAt,
          // });

          return {
            id: post.id,
            title: post.title,
            textLine: post.content,
            image_path: post.image_path,
            category: category,
            userName: author,
            userImagePath: "",
            postedAt: postedAt,
          };
        });
        // console.log("Formatted Data:", formattedData);
        setAllPosts(formattedData);
        setFilteredPosts(formattedData);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching posts:", error);
      }
    };
    fetchBlog();
  }, []);

  // 検索窓の状態に応じて表示対象となる全ブログ取得
  useEffect(()=>{
    setFilteredPosts(
      !searchTerm?.trim()
      ? allPosts
      : allPosts.filter(
        (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.textLine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.userName.toLowerCase().includes(searchTerm.toLowerCase()),
    ));
    setCurrentPage(1)
  }, [ searchTerm ])

 
  // １ページ当たりの表示データ（９つ）取得。
  useEffect(()=>{
    setDisplayPosts(filteredPosts.slice((currentPage-1)*9,currentPage*9));
  },[ currentPage , filteredPosts])

  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Blog Post"
          className="search-text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchIcon className="search-button">検索</SearchIcon>
      </div>

      <main className="blog-list">
        {displayPosts.map((blog) => (
          // ブログ記事クリック時に該当ページに遷移
          <Link key={blog.id} href={`/posts/${blog.id}`} passHref>
            <article className="blog-card">
              <img src={blog.image_path} alt={blog.title} className="blog-image" />

              <div className="blog-header">
                <h2 className="blog-title">{blog.title}</h2>
                <span className="blog-category">{blog.category}</span>
              </div>

              <div className="blog-meta">
                <p className="blog-author">{blog.userName}</p>
                <p className="blog-posted-at">{blog.postedAt}</p>
              </div>

              <p className="blog-content">{blog.textLine}</p>
            </article>
          </Link>
        ))}
      </main>
      <Pagination postNumber={filteredPosts.length} currentPage={currentPage} setCurrentPage={setCurrentPage}/>

    </>
  );
}

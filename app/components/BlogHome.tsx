import "./bloghome.css";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { supabase } from "lib/util/supabase";
import type { Post } from "../../lib/types/index";

export default function PostHome() {
  // ブログ内容の状態管理
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // データの取得
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
            created_at,
            updated_at
          `,
          )
          .order("created_at", { ascending: false }) // 最新順にソート
          .limit(9); // 最新9件に制限

        if (error) throw new Error(error.message);

        // console.log("Fetched Data:", data);

        const formattedData = data.map((post) => {
          const category = post.categories && Array.isArray(post.categories) ? post.categories[0]?.name : "未分類";
          const author = post.users && Array.isArray(post.users) ? post.users[0]?.name : "匿名";
          return {
            id: post.id,
            title: post.title,
            textLine: post.content,
            image_path: post.image_path,
            category: category,
            userName: author,
            userImagePath: "",
            postedAt: new Date(post.created_at).toLocaleString(),
          };
        });
        // console.log("Formatted Data:", formattedData);
        setPosts(formattedData);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // console.error("Error fetching posts:", error);
      }
    };
    fetchBlog();
  }, []);

  // 検索バーの機能
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.textLine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.userName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
        {filteredPosts.map((blog) => (
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
    </>
  );
}

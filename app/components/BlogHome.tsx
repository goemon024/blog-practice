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
      const { data, error } = await supabase.from("posts").select(`
          id,
          title,
          content,
          image_path,
          categories(name) as category,
          users(name) as user,
          created_at,
          updatad_at,
        `);
      if (error) {
        console.log("Error fetching posts:", error.message);
      } else {
        console.log("Fetched Data:", data);
        const formattedData = data.map((blog) => ({
          id: blog.id,
          title: blog.title,
          content: blog.content,
          image_path: blog.image_path,
          category: blog.categories?.name || "未分類",
          author: blog.users?.name || "匿名",
          postedAt: new Date(blog.created_at).toLocaleString(),
        }));
        setPosts(formattedData);
      }
    };
    fetchBlog();
  }, []);

  // 検索バーの機能
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()),
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
                <p className="blog-author">{blog.author}</p>
                <p className="blog-posted-at">{blog.postedAt}</p>
              </div>

              <p className="blog-content">{blog.content}</p>
            </article>
          </Link>
        ))}
      </main>
    </>
  );
}

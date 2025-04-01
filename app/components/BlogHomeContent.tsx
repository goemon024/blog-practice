"use client";
import "./bloghome.css";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import type { Post } from "lib/types/index";
import Pagination from "./Pagination/Pagination";

import LoadingModal from "./LoadingModal/LoadingModal";

type PostCustom = Pick<Post, "id" | "title" | "content" | "image_path" | "created_at"> & {
  users: { username: string | null };
  categories: { name: string | null };
};

interface BlogHomeContentProps {
  initialPosts: PostCustom[];
}

export const BlogHomeContent: React.FC<BlogHomeContentProps> = ({ initialPosts }) => {
  const [displayPosts, setDisplayPosts] = useState(initialPosts);
  const [currentPage, setCurrentPage] = useState(1);

  const [filteredPosts, setFilteredPosts] = useState<PostCustom[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setFilteredPosts(
      !searchTerm?.trim()
        ? initialPosts
        : initialPosts.filter(
            (post) =>
              post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
              post.users.username?.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
    );
    setCurrentPage(1);
    setIsLoading(false);
  }, [searchTerm, initialPosts]);

  useEffect(() => {
    setDisplayPosts(filteredPosts.slice((currentPage - 1) * 9, currentPage * 9));
  }, [currentPage, filteredPosts]);

  const TextLength = 100;

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
          <Link key={blog.id} href={`/posts/${blog.id}`}>
            <article className="blog-card">
              <img src={blog.image_path ?? ""} alt={blog.title} className="blog-image" />

              <div className="blog-header">
                <h2 className="blog-title">{blog.title}</h2>
                <span className="blog-category">{blog.categories.name}</span>
              </div>

              <div className="blog-meta">
                <p className="blog-author">{blog.users.username}</p>
                <p className="blog-posted-at">{blog.created_at?.toLocaleString()}</p>
              </div>

              <p className="blog-content">
                {blog.content.length > TextLength ? `${blog.content.slice(0, TextLength)}...` : blog.content}
              </p>
            </article>
          </Link>
        ))}
      </main>
      <Pagination postNumber={filteredPosts.length} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {isLoading && <LoadingModal />}
    </>
  );
};

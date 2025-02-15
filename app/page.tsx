"use client";
import React from "react";
// import Pagination from "./components/Pagination/Pagination";

import BlogHome from "./components/BlogHome";

export default function Home() {
  return (
    <div>
      <BlogHome />
      {/* <Pagination postNumber={137} />; */}
      {/* postNumberに任意の数字が入力されるようにする */}
    </div>
  );
}

interface Post {
  id: string;
  user_id: string;
  title: string;
  image_path: string;
  category_id: string;
  created_at: string;
  updated_at: string;
  content: string;
}

const DUMMY_POSTS: Post[] = [
  {
    id: "1",
    user_id: "user123",
    title: "Post 1",
    image_path: "/images/sample1.png",
    category_id: "cat1",
    created_at: "2025-01-01",
    updated_at: "2025-01-02",
    content: "This is the first post.",
  },
  {
    id: "2",
    user_id: "user123",
    title: "Post 2",
    image_path: "/images/sample2.png",
    category_id: "cat2",
    created_at: "2025-01-03",
    updated_at: "2025-01-04",
    content: "This is the second post.",
  },
  {
    id: "3",
    user_id: "user123",
    title: "Post 3",
    image_path: "/images/sample3.png",
    category_id: "cat3",
    created_at: "2025-01-05",
    updated_at: "2025-01-06",
    content: "This is the third post.",
  },
  {
    id: "4",
    user_id: "user123",
    title: "Post 4",
    image_path: "/images/sample4.png",
    category_id: "cat4",
    created_at: "2025-01-07",
    updated_at: "2025-01-08",
    content: "This is the fourth post.",
  },
  {
    id: "5",
    user_id: "user123",
    title: "Post 5",
    image_path: "/images/sample5.png",
    category_id: "cat5",
    created_at: "2025-01-09",
    updated_at: "2025-01-10",
    content: "This is the fifth post.",
  },
];

export default DUMMY_POSTS;

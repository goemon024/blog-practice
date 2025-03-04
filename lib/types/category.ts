import { Post } from "./post";

export interface Category {
  id: bigint;
  name: string;
  created_at: Date;
  updated_at: Date;
  posts?: Post[];
}

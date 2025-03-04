import { Post } from "./post";
import { User } from "./user";

export interface Comment {
  id: bigint;
  content: string;
  user_id: string; // public_users.idと関連
  post_id: bigint; // posts.idと関連
  created_at: Date;
  updated_at?: Date | null;
  posts?: Post;
  users?: User;
}

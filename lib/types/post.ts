import { Comment } from "./comment";
import { User } from "./user";
import { Category } from "./category";


export interface Post {
  id: bigint;
  title: string;
  content: string;
  image_path?: string | null;
  category_id: bigint;
  user_id: string; // public_users.idと関連
  created_at?: Date | null;
  updated_at?: Date | null;
  comment?: Comment[];
  users?: User;
  categories?: Category;
}


// export type Post = {
//   id: number|string;
//   title: string;
//   image_path: string;
//   textLine: string;
//   userName: string;
//   userImagePath: string;
//   category:string;
//   categories:{name:string}[];
//   users:{name:string}[];
//   postedAt:string;
// };


export interface Post {
  id: string;
  title: string;
  content: string;
  image_path?: string | null;
  category_id: number;
  user_id: string;
  created_at: string;
  updated_at?: string;
}
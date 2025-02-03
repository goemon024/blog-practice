export type Post = {
  id: number|string;
  title: string;
  image_path: string;
  textLine: string;
  userName: string;
  userImagePath: string;
  category:string;
  categories:{name:string}[];
  users:{name:string}[];
  postedAt:string;
};

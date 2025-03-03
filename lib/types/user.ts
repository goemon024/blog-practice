import { Post } from './post';
import { Comment } from './comment';


export interface User {

  id: string; // UUIDは通常stringとして扱う
  username: string; // ユーザー名はユニーク
  email: string; // メールアドレスもユニーク
  image_path?: string | null; // 画像パスはオプショナル
  updated_at?: Date | null; // 更新日時はオプショナル
  created_at: Date; // 作成日時は必須
  comment?: Comment[]; // コメントは関連するコメントの配列
  posts?: Post[]; // 投稿は関連する投稿の配列
}


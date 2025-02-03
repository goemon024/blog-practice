import { createClient } from "@supabase/supabase-js";

const supabaseKey =
  typeof window === "undefined"
    ? process.env.SUPABASE_SERVICE_ROLE_KEY // サーバーサイドは高権限キーを使用
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, supabaseKey!);

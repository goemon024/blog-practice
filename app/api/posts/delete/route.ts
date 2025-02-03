import { supabase } from "lib/util/supabase";
import { NextResponse } from "next/server";

// DELETEリクエストを処理
export async function POST(req: Request) {
  try {
    const { id } = await req.json(); // リクエストボディからIDを取得
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      throw error;
    }

    return NextResponse.json({ message: `Post with ID ${id} deleted successfully` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

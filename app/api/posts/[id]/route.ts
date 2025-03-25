import { NextRequest, NextResponse } from "next/server";
import { supabase } from "lib/util/supabase";
import { getToken } from "next-auth/jwt";
// import prisma from "lib/util/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth";
import { deletePost, editPost, getOnePost } from "lib/db/posts";

type PostCustom = {
  id: string;
  title: string;
  content: string;
  image_path?: string | null;
  category_id: string;
  user_id: string;
  image?: File | null;
};

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: 投稿を削除
 *     description: IDで指定された投稿を削除します
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 投稿ID
 *     responses:
 *       200:
 *         description: 削除成功
 *       400:
 *         description: IDが必要です
 *       401:
 *         description: 認証が必要です
 *       403:
 *         description: 削除権限がありません
 *       404:
 *         description: 投稿が見つかりません
 *       500:
 *         description: サーバーエラー
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // トークン認証の追加
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // 投稿の所有者チェックを追加
    const post = await getOnePost(id); // 投稿を取得する関数を呼び出し
    if (!post) {
      return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
    }

    // 投稿の所有者と現在のユーザーを比較
    if (post.user_id !== session.user.id) {
      return NextResponse.json({ error: "削除権限がありません" }, { status: 403 });
    }

    await deletePost(id);

    // await prisma.posts.delete({
    //   where: {
    //     id: BigInt(id),
    //   },
    // });

    return NextResponse.json({ message: `投稿削除に成功。Post with ID ${id} deleted successfully` }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: 投稿を更新
 *     description: IDで指定された投稿を更新します
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 投稿ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category_id:
 *                 type: string
 *               image_path:
 *                 type: string
 *     responses:
 *       200:
 *         description: 投稿の更新に成功
 *       401:
 *         description: 認証が必要です
 *       403:
 *         description: 投稿の編集権限がありません
 *       404:
 *         description: 投稿が見つかりません
 */
export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    let updateData: PostCustom;

    const contentType = req.headers.get("content-type");

    if (contentType?.includes("multipart/form-data")) {
      // imageが存在しimage_pathが存在しない場合

      const formData = await req.formData();
      // eslint-disable-next-line no-console
      console.log("formData", formData);

      const file = formData.get("image") as File;

      // Supabaseストレージへのアップロード
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("blog-images").upload(fileName, file);

      if (uploadError) {
        // eslint-disable-next-line no-console
        console.error("Upload error:", uploadError);
        return NextResponse.json({ error: "ファイルのアップロードに失敗しました" }, { status: 500 });
      }

      // 画像URLの取得
      const fileurl = supabase.storage.from("blog-images").getPublicUrl(fileName).data.publicUrl;

      updateData = {
        id: formData.get("id") as string,
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        category_id: formData.get("category_id") as string,
        user_id: formData.get("user_id") as string,
        image_path: fileurl as string,
      };
    } else {
      // iimage_pathが存在しimageが存在しない場合
      const jsonData = await req.json();
      // eslint-disable-next-line no-console
      console.log("jsonData", jsonData);

      if (!jsonData || typeof jsonData !== "object") {
        return NextResponse.json({ error: "無効なJSONデータです" }, { status: 400 });
      }

      updateData = {
        id: jsonData.id,
        title: jsonData.title,
        content: jsonData.content,
        category_id: jsonData.category_id,
        user_id: jsonData.user_id,
        image_path: jsonData.image_path,
      };
    }

    if (updateData.user_id !== token.sub) {
      return NextResponse.json({ error: "この投稿の編集権限がありません" }, { status: 403 });
    }

    const updatePost = await editPost(updateData);

    // const updatePost = await prisma.posts.update({
    //   where: {
    //     id: BigInt(updateData.id),
    //   },
    //   data: {
    //     title: updateData.title,
    //     content: updateData.content,
    //     category_id: BigInt(updateData.category_id),
    //     user_id: updateData.user_id,
    //     image_path: updateData.image_path,
    //   },
    // });

    // 成功時のレスポンスを追加
    return NextResponse.json({
      success: true,
      data: {
        ...updatePost,
        id: updatePost.id.toString(),
        category_id: updatePost.category_id.toString(),
        image_path: updatePost.image_path,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error:", error);
    return NextResponse.json({ error: "予期せぬエラーが発生しました" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: 特定の投稿を取得
 *     description: IDで指定された投稿の詳細を取得します
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 投稿ID
 *     responses:
 *       200:
 *         description: 投稿の取得に成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     image_path:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                     user_id:
 *                       type: string
 *                     category_id:
 *                       type: string
 *       401:
 *         description: 認証が必要です
 *       403:
 *         description: 投稿の所有者ではありません
 *       404:
 *         description: 投稿が見つかりません
 */

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // トークン認証の追加
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // 投稿の所有者確認を追加
    // const { data: post } = await supabase.from("posts").select("*").eq("id", id).single();
    const post = await getOnePost(id);
    // const post = await prisma.posts.findUnique({
    //   where: {
    //     id: BigInt(id),
    //   },
    // });

    if (!post) {
      return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
    }

    if (post.user_id !== token.sub) {
      return NextResponse.json({ error: "投稿の所有者ではありません" }, { status: 403 });
    }

    // eslint-disable-next-line no-console
    console.log("prisma data", post);

    return NextResponse.json({
      data: {
        id: post.id.toString(), // BigIntをstringに変換
        title: post.title,
        content: post.content,
        image_path: post.image_path,
        created_at: post.created_at,
        user_id: post.user_id,
        category_id: post.category_id.toString(),
      },
    });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log("error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

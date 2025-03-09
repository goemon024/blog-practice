# PORTFORIO
NEXT.JS、REACTの勉強の一環で、ブログアプリを作成。

### 使用技術一覧
<!-- <p style="display: inline"> -->
　<!-- フロントエンドの言語一覧 -->
<div style = "margin-bottom:10px">
    <img src="https://img.shields.io/badge/-HTML-FF5733.svg?logo=html5&logoColor=FFFFFF&style=for-the-badge">
    <img src="https://img.shields.io/badge/-CSS-2965f1.svg?logo=css3&logoColor=white&style=for-the-badge">
    <img src="https://img.shields.io/badge/-TypeScript-007ACC.svg?logo=typescript&logoColor=white&style=for-the-badge">
    <!-- フレームワーク -->
    <img src="https://img.shields.io/badge/-React-61DAFB.svg?logo=react&logoColor=black&style=for-the-badge">
    <img src="https://img.shields.io/badge/-Next.js-000000.svg?logo=nextdotjs&style=for-the-badge">
    <img src="https://img.shields.io/badge/-Prisma-2D3748.svg?logo=prisma&logoColor=FFFFFF&style=for-the-badge">
</div>
<div>
  <!-- DB -->
  <img src="https://img.shields.io/badge/-Supabase-3ECF8E.svg?logo=supabase&logoColor=white&style=for-the-badge">
  <!-- インフラ -->
  <img src="https://img.shields.io/badge/-Vercel-000000.svg?logo=vercel&style=for-the-badge">
</div>

### 機能説明  
・NextAuth.jsとSupabaseを組み合わせた認証システム  
・ユーザ名/パスワードによるカスタム認証フロー  
・JWTペースのセッション管理によるユーザー認証  
・記事一覧表示、詳細表示、検索 、ページネーション  
・signinユーザによる記事作成、記事編集、削除  
・signinユーザによるブログ記事コメント付与  

### アプリイメージ
トップ画面（記事一覧）  
![スクリーンショット](/public/blog-top.png)  
  
ブログ詳細画面  
![スクリーンショット](/public/blog-detail.png)  
  
ユーザプロフィール画面  
![スクリーンショット](/public/user-profile.png)  
  
### アプリＵＲＬ
https://teamsdev2.vercel.app/

**1. git clone**

```
git clone https://github.com/goemon024/blog-practice.git
```

**2. 環境変数ファイルの作成**

```
cp .env.local .env
```

**3. パッケージインストール**

```
npm install
```

**4. 起動**

```
npm run dev
```

## 開発フロー


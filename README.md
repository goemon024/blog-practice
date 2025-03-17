# PORTFORIO
NEXT.JS、REACTの勉強の一環で、ブログアプリを作成。


### 使用技術一覧
<!-- <p style="display: inline"> -->
　<!-- フロントエンドの言語一覧 -->
<div>
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
<br><br><br>

### 機能説明  
・NextAuth.jsとSupabaseを組み合わせた認証システム  
・ユーザ名/パスワードによるカスタム認証フロー  
・JWTペースのセッション管理によるユーザー認証  
・記事一覧表示、詳細表示、検索 、ページネーション  
・signinユーザによる記事作成、記事編集、削除  
・signinユーザによるブログ記事コメント付与 
<br><br><br>

### アプリイメージ
トップ画面（記事一覧）  
![スクリーンショット](/public/blog-top.png)  
  
ブログ詳細画面  
![スクリーンショット](/public/blog-detail.png)  
  
ユーザプロフィール画面  
![スクリーンショット](/public/user-profile.png)  
<br><br><br>

### アプリＵＲＬ
https://blog-practice-goemon024s-projects.vercel.app/
<br>
（簡易sign in）ID：d1, password: test1111  
（注）supabaseが無料プランであるため、upload処理等でサーバーエラーとなることがあります。
<br><br><br>


## 開発環境の構築方法
**1. git clone**

```
git clone https://github.com/goemon024/blog-practice.git
```

**2. 環境変数ファイルの作成**

```
touch .env.local .env
```

**3. supabaseのプロジェクトを作成して、以下の環境変数をenv,env.localに記述**
‐ envに記述（supabase のconnectタブとORMsタブを表示させて取得する。）  
```
DATABASE_URL =
DIRECT_URL =
NEXT_PUBLIC_SUPABASE_HOSTNAME = 
```
‐ env.localに記述（supabaseのproject settingsのData APIを表示させて取得する）。  

‐ NEXTAUTH_SECRETは、openssl rand -base64 32でランダム文字列生成をして入力。  

```
NEXT_PUBLIC_SUPABASE_URL = 
NEXT_PUBLIC_SUPABASE_ANON_KEY = 
SUPABASE_SERVICE_ROLE_KEY = 
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=
```
**4. パッケージインストール**

```
npm install
```
<br><br>

**5. supabaseのDB設定**
![スクリーンショット](/public/public-table.png)  
<br>
1. supabase-table.txtファイルの中身をsupabaseのSQL editorにコピペしてrun。
2. Storageにて、blog-imagesとprofile-imagesという名称のbacketをpublic設定で作成
3. Project Settings、Authentication、Sign In/UpのEmailの設定において、Enable Email Providerのみを有効化する（confirm email, Secure email changeを非有効化）。  
4. 1で作成された4つのpublicテーブルのRLS設定がdisabledになっているのを確認する。  
<br><br>

**6. local サーバ起動**

```
npm run dev
```
<br><br><br>

## 今後の開発課題
blog create処理の際のＵＸ改善。
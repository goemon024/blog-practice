# PORTFORIO
NEXT.JS、REACTの勉強の一環で、ブログアプリを作成。

### 使用技術一覧
<p style="display: inline">
　<!-- フロントエンドの言語一覧 -->
    <img src="https://img.shields.io/badge/-HTML-FF5733.svg?logo=html5&logoColor=FFFFFF&style=for-the-badge">
    <img src="https://img.shields.io/badge/-CSS-2965f1.svg?logo=css3&logoColor=white&style=for-the-badge">
    <img src="https://img.shields.io/badge/-TypeScript-007ACC.svg?logo=typescript&logoColor=white&style=for-the-badge">
    <!-- フレームワーク -->
    <img src="https://img.shields.io/badge/-React-61DAFB.svg?logo=react&logoColor=black&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Next.js-000000.svg?logo=nextdotjs&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Prisma-2D3748.svg?logo=prisma&logoColor=FFFFFF&style=for-the-badge">
</p>
<p style="display: inline">
  <!-- DB -->
  <img src="https://img.shields.io/badge/-Supabase-3ECF8E.svg?logo=supabase&logoColor=white&style=for-the-badge">
  <!-- インフラ -->
  <img src="https://img.shields.io/badge/-Vercel-000000.svg?logo=vercel&style=for-the-badge">
</p>

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



**1. git clone**

```
git clone ~~~
```

**2. 環境変数ファイルの作成**

```
cp .env.example .env
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

### 1. Issue の作成

1. Issue Template を元に Issue を作成してください。
2. Assignees で誰が担当しているのかを選択してください。
3. Projects で GitHub Projects のタスク管理と紐付けを行なってください。
4. Issue を必ずミーティングで、いつ対応するのかをチームで決めます。

*`備考`*
- バグや表示崩れについては、Bug report で作成してください。
  - 実装途中にバグを発見した際は作成してください。
  - 必要であれば、ミーティングで修正対応について議論いたします。

### 2. Branch

#### ブランチ命名規則（**プレフィックス**をつける）

- fe: フロントエンド
- be: バックエンド
- deps: 依存関係（ライブラリー）の変更

- feature: 機能追加
- fix: コード修正（リファクタリング等）
- bug: バグ修正
- add: 依存関係の追加
- update: 依存関係の更新
- remove: 依存関係の削除

※ 該当項目がない場合は適宜追加

**＜例＞**

```
git checkout -b 'fe/feature/todotop_layout'
git checkout -b 'fe/fix/todotop_layout'
git checkout -b 'fe/bug/todotop_layout'
git checkout -b 'deps/add/test-library'
```

### 3. Commit

#### コミットメッセージ

- 日本語もしくは英語で端的に

**＜例＞**

```
git commit -m 'Top画面 作成'
git commit -m 'create top layout'
```

### 4. PullRequest

**1. プルリクエスト前の作業**

プルリクエストを上げる前に必ず、自分が作業を行なっているブランチで `git pull origin main` を行うこと。<br/>
もし、コンフリクトが発生したら、ローカル上で解決する、解決の仕方がわからない場合は、メンバーに相談する。

**2. `git pull origin main` を行なった後の作業**

package に更新がないか、確認するため、 `npm install` コマンドを実行する。<br/>
`found 0 vulnerabilities` と表示されれば OK。

**3. `npm run format` と `npm run lint` の実行**

- 作業が終わったら `npm run lint` をかけて、Errorが報告されなくなるまで修正を行う。（Error の修正が難しい場合には、そのままでも良いのでプルリクエストにどのような Error が出ているかを追記する）
- 上記作業が終わった段階で `npm run format` をかけてコードのフォーマットの修正を行う。

**4. プルリクエスト作成時**

- `PullRequestTemplate`を使ってください。
- 作ったブランチから main ブランチへマージするプルリクを作ってください。
- プルリクに issue 番号を紐付けてください。
- レビュアーに Assignees つけてください。
- レビュー依頼の際は、PR 内にメンションコメント＆Slack にてレビュアーに声掛けお願いします。

**5. マージ**

- マージはスカッシュコミット（プルリク内のコミットを 1 つににまとめてコミット）でお願いします。
  - マージの際に`Marge Pull Request`ではなく`Squash and merge`を選んでマージしてください。

## 使用技術

### フロントエンド
- [HTML](https://developer.mozilla.org/ja/docs/Web/HTML)
- [CSS](https://developer.mozilla.org/ja/docs/Web/CSS)
- [JavaScript](https://developer.mozilla.org/ja/docs/Web/JavaScript)
- [TypeScript](https://www.typescriptlang.org)
- [React.js](https://ja.react.dev)
- [Next.js](https://nextjs.org)

### バックエンド
- [Supabase](https://supabase.com)

### インフラ
- [Vercel](https://vercel.com)

### ツール
- [GitHub](https://github.co.jp)

## 言語 / パッケージ

- [Node.js](https://nodejs.org/ja)
- [npm](https://docs.npmjs.com/cli/v10/commands/npm-version)

# ドキュメント

## 環境構築

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

- feature: 機能追加
- fix: コード修正（リファクタリング等）
- bug: バグ修正

※ 該当項目がない場合は適宜追加

**＜例＞**

```
git checkout -b 'fe/feature/todotop_layout'
git checkout -b 'fe/fix/todotop_layout'
git checkout -b 'fe/bug/todotop_layout'
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

**3. プルリクエスト作成時**

- `PullRequestTemplate`を使ってください。
- 作ったブランチから main ブランチへマージするプルリクを作ってください。
- プルリクに issue 番号を紐付けてください。
- レビュアーに Assignees つけてください。
- レビュー依頼の際は、PR 内にメンションコメント＆Slack にてレビュアーに声掛けお願いします。

**4. マージ**

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

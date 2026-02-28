# hirovodka monorepo

このリポジトリは 2 つの Astro プロジェクトを同居させた monorepo です。

- `site/` → `https://hirovodka.com`（プロフィール/リンク集）
- `blog/` → `https://blog.hirovodka.com`（Markdown ブログ + RSS）


> CIや単純な `npm run build` 実行向けに、ルートにも `package.json` を置いています。  
> ルートの `npm run build` は `site` と `blog` のビルドを順番に実行します。

## ローカル開発

```bash
# profile site
cd site
npm i
npm run dev

# blog
cd ../blog
npm i
npm run dev
```

## ビルド

```bash
cd site && npm run build
cd blog && npm run build
```

## Cloudflare Pages 設定

**重要:** ルートでビルドすると `dist` が存在せずデプロイに失敗します。  
**必ず「Root directory」に `site` または `blog` を指定し、プロジェクトを 2 つに分けてデプロイしてください。**

### 1) hirovodka.com 用
- **Root directory**: `site`（必須）
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Environment variable (任意)**: `SITE_URL=https://hirovodka.com`

### 2) blog.hirovodka.com 用
- **Root directory**: `blog`（必須）
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Environment variable (任意)**: `SITE_URL=https://blog.hirovodka.com`

## RSS集約（site 側）

`site/src/site.config.ts` でリンクとRSS元URLを管理しています。

- SNSリンク: `LINKS`
- RSS元URL: `RSS_SOURCES`

トップページ（`site/src/pages/index.astro`）がビルド時にRSSを取得し、最新記事を静的HTMLへ埋め込みます。
取得失敗時はビルドを落とさず「取得できませんでした」を表示します。

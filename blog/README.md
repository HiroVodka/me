# blog/ theme migration note

この環境では GitHub / npm への外部アクセスが 403 でブロックされており、`saicaca/fuwari` 本体を取得できませんでした。

## 実行して失敗したコマンド

```bash
git clone --depth 1 https://github.com/saicaca/fuwari /tmp/fuwari
npm view fuwari version
curl -I https://raw.githubusercontent.com/saicaca/fuwari/main/README.md
```

## ネットワーク制限がない環境での移行手順（README準拠の一般的手順）

```bash
cd blog
rm -rf src public astro.config.mjs package.json package-lock.json tsconfig.json
npx degit saicaca/fuwari .
npm install
npm run dev
```

必要に応じて `src/config.ts`（または同等の設定ファイル）でサイト名・URL・SNS等を更新してください。

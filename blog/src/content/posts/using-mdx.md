---
title: Using MDX
published: 2024-06-01
description: Notes on mixing MDX-style content into this Astro blog.
image: "/images/blog-placeholder-5.jpg"
tags: [Content, Docs]
category: Docs
draft: false
---

このテーマには `@astrojs/mdx` を入れていませんが、MDX がどういうものか、どうやって組み込むかを簡単にまとめておきます。

## Why MDX?

MDX は Markdown にコンポーネントを直接埋め込める拡張です。過去に MDX で書いた記事がある場合でも、Astro の MDX インテグレーションを入れればそのまま移行できます。

## Config

MDX を使いたい場合は次のコマンドでインテグレーションを追加します。

```bash
pnpm astro add mdx
```

`astro.config.mjs` から MDX を読み込むと、MDX ファイルでも fuwari の Markdown 拡張やスタイルをそのまま使えます。

## Component Example

```astro
import HeaderLink from "../../components/HeaderLink.astro";

<HeaderLink href="#" onClick={() => alert('clicked!')}>
  Embedded component in MDX
</HeaderLink>
```

> **Note**: インタラクティブにするには Client Directive (`client:load` など) が必要です。指示を付けない場合は静的 HTML として描画されます。

## References

- [MDX Syntax Documentation](https://mdxjs.com/docs/what-is-mdx)
- [Astro Usage Documentation](https://docs.astro.build/en/basics/astro-pages/#markdownmdx-pages)

@AGENTS.md

# お金の計算機シリーズ（money-calc）

日本のユーザー向け「お金の計算機」を集約するハブ&スポーク型サイト。
YMYL領域のため**計算精度が最優先**。

## 技術スタック
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- 計算機ページは **SSG**。計算ロジックは**全てクライアント側**で完結（サーバー処理なし）。
- 解説記事は **MDX**（`/content`）。テストは **Vitest**（`npm test`）。
- ホスティングは Vercel 想定。

## ディレクトリ
- `/app` … 各計算機ページ（ルーティング）
- `/lib` … 計算ロジック（純粋関数・年度別定数・**テスト必須**）
- `/content` … 解説記事（MDX、各計算機1500字以上）
- `/components` … 入力フォーム・結果表・グラフなど共通UI

## 計算精度のルール（厳守）
- 計算ロジックは必ず**公的資料を出典**にする（国税庁・各自治体・協会けんぽ等）。
- ロジックに**出典コメントと適用年度**を明記。
- **テストで既知の正解値と照合**する。
- 料率・控除額は**年度ごとに定数ファイルへ分離**（税制改正に追従）。
- 画面に「本ツールは概算です。正確な額は専門家や公的機関でご確認ください」と明記。

## 作る順序
1. 年収手取り計算機（集客の入口）← 最初の1本
2. 住宅ローンシミュレータ（収益エンジン）
3. ふるさと納税 上限額シミュレータ
（以降 NISA/iDeCo、退職金 などロングテール）

## コマンド
- `npm run dev` … 開発サーバー
- `npm test` … 計算ロジックのテスト
- `npm run build` … 本番ビルド（SSG）

## 画像生成（design-agent 連携）
記事のアイキャッチ・図版・OGP などの画像が必要になったら、隣の `../design-agent`（画像生成エージェント）を使う。**画像はこのプロジェクト内で自作せず、必ず design-agent 経由で生成する。**

- 出力先: `money-calc/public/images/<slug>.jpg`（参照は `/images/<slug>.jpg`）。命名は記事/計算機のslugに合わせる（例 `nenshu-tedori.jpg`）。
- 実行はこのプロジェクト直下（cwd = money-calc）から。`--out` は cwd 基準の相対パスでOK。エージェントの `.env`・依存はエージェント側で自動解決される。

```bash
# 記事アイキャッチ（16:9）
node ../design-agent/src/run.mjs image \
  --prompt "<英語プロンプト>, editorial photo, photorealistic, no text, no logo" \
  --out public/images/nenshu-tedori.jpg --ar 16:9

# OGP（文字入り。背景は自動生成、文字はベクター合成）
node ../design-agent/src/run.mjs banner \
  --prompt "<背景の英語プロンプト>, no text" \
  --text "年収手取り計算機" --sub "2025年度の税・社保に対応" \
  --ar 1.91:1 --out public/images/ogp-nenshu-tedori.jpg

# 手持ち画像の最適化・配置 / 複数枚バッチ
node ../design-agent/src/run.mjs place --in <file-or-dir> --out public/images
node ../design-agent/src/run.mjs batch <jobs.json>
```

- 既定エンジンは `auto`（HF→失敗でPollinations）。無料で高品質。`engine:` 表示で実使用エンジンが分かる。
- 使い方の詳細・コマンド一覧は `../design-agent/README.md`、Claude向け運用は `../design-agent/CLAUDE.md`。
- YMYLサイトなので画像は装飾用途に留め、**数値・計算結果を画像内に焼き込まない**（本文/表で示す）。人物写真は実在人物を指定しない。

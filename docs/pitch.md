# ピッチ原稿（5分プレゼン版）

## スライド構成（8枚）

### 1. タイトル
> YenAgent (円エージェント)
> LINEで動く、日本のフリーランス向け自律決済AIエージェント

### 2. 課題（問題提起）
- 日本の副業・フリーランスは **1,200万人**
- 請求 → 振込 → 着金 → 経費仕分け がいまだ手作業
- 海外案件は SWIFT/PayPalで数日 + 手数料 + FX で手取り削れる
- 「AIエージェント時代」と言われながら、決済まで自動化できているのか？

### 3. ソリューション
> **LINEで日本語で話しかけるだけで、AIが請求 → 入金 → 納品検知 → 支払いを全自動で完結する**

90秒デモへ（[demo-script.md](./demo-script.md)）

### 4. 技術
- **OpenClaw plugin** として実装（ハッカソンテーマ準拠）
- **LINE adapter** (公式 `@openclaw/line`) で日本のユーザーにリーチ
- **JPYC (mock on Amoy)** で円建て決済 → 為替・手数料説明不要
- **マイルストーン型 Escrow** で「段階解放」を on-chain で表現
- 4つの autonomous tools: createInvoice / createEscrow / monitorDelivery / releasePayment

### 5. なぜこのチームか
- Injective Japan モデレーター（DeFi実装経験）
- Claude Code + AI チーム化された制作プロセス
- 日本のステーブルコイン・規制動向に精通

### 6. なぜ勝てるか
- **3トラック同時カバー**: Autonomous Agent + On-chain Settlement + Cross-border
- **Japan特化**: 唯一のLINE bot事例 / 日本語契約解読
- **デモ映え**: 観客の目の前で tx が流れる
- **本番展開ストーリー**: Injective Japan B2B案件として翌週から営業可能

### 7. ロードマップ
- Phase 1（今日）: MVP デモ完成
- Phase 2（〜1ヶ月）: GitHub Webhook自動納品検知 / 経費仕分け
- Phase 3（〜3ヶ月）: mainnet実JPYC切替 / B2B SaaS版（Outlook/Slack統合）
- Phase 4（〜6ヶ月）: クロスボーダー（USDC mode）/ 確定申告連携

### 8. クロージング
> 「Bridge AI Reasoning with Blockchain Execution」
> ── YenAgent (円エージェント) は、その橋を **LINE と JPYC で日本に降ろす** プロダクトです。
> github.com/(your-handle)/yenagent

## トーン指針

- 早口だが滑らない速度（1スライド30秒）
- 「AI」「on-chain」「ステーブルコイン」など強キーワードはやや強調
- 数字は丸めて言う（「約1,200万」「数秒で」）
- デモを最優先 → 失敗時は躊躇なく動画再生に切り替え

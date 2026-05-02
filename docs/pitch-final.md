# YenAgent (円ジェント) — Clawathon Tokyo ピッチ最終版

> 想定持ち時間: **5分（プレゼン3分 + デモ90秒 + Q&A 30秒）**
> 1スライド30秒目安。ピッチ後すぐデモへ移行。

---

## Slide 1 / Title (10秒)

# YenAgent
## 円ジェント

### LINEで動く、日本のフリーランス向け自律決済AIエージェント

**Clawathon Tokyo Edition / 2026-05-02**
Yuki Koga · Injective Japan

> Bridging AI Reasoning with Blockchain Execution.

---

## Slide 2 / 課題 (30秒)

# 副業1,200万人時代、決済はまだ手作業

- 日本のフリーランス・副業ワーカーは **1,200万人超**（2025年）
- 請求 → 振込 → 着金 → 経費仕分け、いまだに **手作業 + 振込手数料 + タイムラグ**
- 海外案件は **SWIFT / PayPal で数日 + FX損失**で手取りが目減り
- AIエージェント時代と言われながら、**決済まで自動化できているサービスは皆無**

> AIが請求書"作る"までは進化したが、**振り込みまで**やってくれるエージェントは無い。

---

## Slide 3 / ソリューション (20秒)

# YenAgent: LINE/TUIで日本語、JPYCで決済まで完結

```
ユーザー（日本語） →  AIエージェント  →  Polygon Amoy
   "請求書出して"  →  Claude推論     →  JPYCエスクロー
                                       →  自律release
```

**4つの自律ツール** を OpenClaw plugin として実装：

1. `createInvoice` — 自然言語から請求書構造化
2. `createEscrow` — JPYCをエスクローにロック
3. `monitorDelivery` — GitHub PR / URLで納品検知
4. `releasePayment` — マイルストーン段階解放

→ **次スライドで実機デモ**

---

## Slide 4 / 技術スタック (30秒)

# OpenClaw skill model に完全準拠

| レイヤー | 採用 |
|---------|------|
| **エージェントランタイム** | **OpenClaw** (TUI / 公式LINE/Discord/Slackアダプタ) |
| **AI Reasoning** | Claude Opus 4.7 (OpenClaw経由) |
| **スキル定義** | `~/.openclaw/skills/yenagent/SKILL.md`（公式形式） |
| **on-chain実行** | viem + Polygon Amoy testnet |
| **ステーブルコイン** | Mock JPYC ERC20 (mainnet本番では実JPYC電子決済手段) |
| **コントラクト** | Solidity 0.8.24 + Hardhat / OpenZeppelin |

**重要**: SKILL.md だけでLINE / Discord / Slack / Signal すべてに同じ業務ロジックが乗る。**OpenClaw のチャネル抽象を最大活用**。

---

## Slide 5 / ライブデモ (90秒)

# **[ 画面切替: TUI ]**

> [`docs/demo-script-final.md`](./demo-script-final.md) に沿って実演。

ハイライト：
- 自然言語1行から請求書作成
- ブロックチェーン操作前の **明示的確認ゲート**
- 実Amoy txが目の前で発火 → Explorerに着弾
- マイルストーン release で **payeeへ実JPYC着金**
- ガス不足等のエラーを **Claude 自律でリカバリ提案**

---

## Slide 6 / トラック適合 (15秒)

# 4トラック中3トラック直撃

| トラック | 該当性 |
|---------|--------|
| **Autonomous Agent Workflows** | ✅ 4ツール自律連携 |
| **On-chain Settlement for AI** | ✅ JPYCエスクロー + milestone release |
| **AI-Driven Governance** | △ multi-payerでon-chain投票化（roadmap） |
| **Cross-border Agent Operations** | ✅ USDCモード切替で日本↔海外対応 |

スポンサー賞接続：
- **ISEAI**: SKILL.md そのまま管理画面に投入可能
- **XRPL**: JPYC × クロスボーダーは XRPL Japan の主戦場
- **World**: 請求権者の人間性検証（World ID）でなりすまし防止
- **NEAR / MAGLAB**: Japan特化エージェント経済

---

## Slide 7 / ロードマップ (15秒)

# Phase 1 → 4

| フェーズ | 期間 | 内容 |
|---------|------|------|
| **Phase 1** | **本日** | OpenClaw TUI で4ツールE2E、Amoyに実tx |
| **Phase 2** | 〜2週間 | LINE Bot 公式adapter接続 / GitHub Webhook自律納品検知 |
| **Phase 3** | 〜1ヶ月 | mainnet実JPYC切替 / ISEAI管理画面ホスティング / B2B SaaS化 |
| **Phase 4** | 〜3ヶ月 | クロスボーダーUSDCモード / 確定申告CSV / 法人向けOutlook/Teams連携 |

すでにOpenClawスキル形式 → **Phase 2でユーザー獲得まで最速ルート**。

---

## Slide 8 / クロージング (10秒)

# 「Bridge AI Reasoning with Blockchain Execution」

YenAgent は、その橋を **LINE と JPYC で日本に降ろす** プロダクトです。

副業1,200万人の手作業を、AIに任せませんか。

```
GitHub:  github.com/(your-handle)/yenagent
TUI:     openclaw tui  →  YenAgent skill ready
Contract: 0x5f692E7e62B372BE71434816bE35781bE5fcf454 (Amoy)
```

**Q&A 30秒**

---

## ピッチ実演メモ

- スライド1〜4は **早口だが滑らない速度**（30秒/枚）
- スライド5（デモ）に入る前に **画面共有切替**（TUI画面に）
- **数字は丸めて**: 「約1,200万人」「数秒で」「手数料1円以下」
- **デモ完了後にスライド6に戻る**（トラック適合とロードマップ）
- 最終クロージングは **強く・短く**

---

## 提出フォーム用テキスト（コピペ可）

### プロダクト名
YenAgent (円ジェント)

### 1行説明
LINEで動く日本のフリーランス向け自律決済AIエージェント。OpenClaw skillで4つのツール（請求書発行→JPYCエスクロー→納品検知→自動release）を実行し、人手なしで請求から決済まで完結する。

### 詳細説明（500字）
副業1,200万人時代の日本に、AIが請求から決済まで全自動でやってくれる仕組みを届ける。OpenClaw上のskillとして実装し、ユーザーが日本語で「ABC社の案件、3万円、3分割で請求書」と話しかければ、Claude Opus 4.7が自然言語を構造化、Polygon Amoy上のJPYCエスクローにロック、GitHub PR等で納品検知し、自律的にmilestone単位で解放する。OpenClawのチャネル抽象を活用するためLINE/Discord/Slack等どこにでも同じ業務ロジックが乗る。本日のMVPはMockJPYCで動作するtestnet版だが、SKILL.md形式に準拠しているため、ISEAIのマネージド環境にもそのままドロップ可能。日本の規制下の正規円ステーブルJPYC・OpenClaw・Claude を組み合わせ、「AI Reasoning と Blockchain Execution の橋」を Japan特化で構築した。

### トラック
Primary: Autonomous Agent Workflows + On-chain Settlement for AI
Secondary: Cross-border Agent Operations

### 技術スタック
OpenClaw 2026.4.x / Claude Opus 4.7 / TypeScript / viem / Solidity 0.8.24 / Hardhat / Polygon Amoy testnet

### Demo URL / GitHub
（提出時記入）

### Contract Address
- MockJPYC: 0x7200829959bf70085D9AeaDFCDFACc1E99356db7
- EscrowLite: 0x5f692E7e62B372BE71434816bE35781bE5fcf454

### tx Evidence
（[`docs/evidence.md`](./evidence.md) 参照）

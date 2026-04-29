# YenAgent (円ジェント)

> **LINE上で動く、日本のフリーランス向け自律決済AIエージェント**
> 請求書発行 → 入金監視 → 納品検知 → JPYC自動release を、OpenClawプラグインとして実装。

[Clawathon Tokyo Edition 2026 (May 2)](https://luma.com/zw01ink4) 出場プロダクト。

---

## 何ができるか

LINEで日本語で話しかけるだけで、以下の流れが**人手なし**で完結します。

```
[フリーランサー] LINE: 「ABC社の案件、3万円で請求書出して」
   ↓
[YenAgent] 過去履歴から明細生成 → 請求書PDF & on-chain claim ID 発行
   ↓
[クライアント] LINE: ワンタップで JPYC エスクロー入金
   ↓
[YenAgent] GitHub PR マージ等で納品検知 → 自律的に on-chain release 実行
   ↓
[フリーランサー] tx hash 通知（手数料 ~$0.001、決済 ~5秒）
```

## アーキテクチャ

```
LINE (ユーザー)
   ↕ LINE Messaging API
OpenClaw runtime
   ├─ @openclaw/line             (LINE adapter, 公式)
   ├─ LLM: Claude Sonnet 4.6
   └─ yenagent plugin (このリポジトリ)
        ├─ tools/createInvoice
        ├─ tools/createEscrow
        ├─ tools/monitorDelivery
        └─ tools/releasePayment
             ↓ viem
        Polygon Amoy testnet
        ├─ MockJPYC (ERC20)
        └─ Escrow contract
```

詳細は [docs/architecture.md](./docs/architecture.md) を参照。

## ディレクトリ構成

| ディレクトリ | 役割 |
|------------|------|
| `plugin/` | OpenClawプラグイン本体（TypeScript） |
| `contracts/` | Solidity（MockJPYC + Escrow、Hardhat） |
| `scripts/` | デプロイ・seed・デモ用tx送信スクリプト |
| `docs/` | アーキ図・ピッチ原稿・デモスクリプト |

## クイックスタート

```bash
# プラグイン
cd plugin && npm install && npm run build

# コントラクト
cd contracts && npm install
npx hardhat compile
npx hardhat run scripts/deploy.ts --network amoy

# OpenClaw でロード
npx openclaw plugin add ./plugin
npx openclaw start
```

詳細手順は各ディレクトリの README を参照。

## ステータス

- [x] プロジェクト雛形
- [ ] OpenClawプラグイン4ツール実装
- [ ] MockJPYC + Escrow contract（Polygon Amoy）
- [ ] LINE Bot 接続テスト
- [ ] E2Eデモ動画
- [ ] ピッチデック

## 想定する拡張（ロードマップ）

- 経費自動仕分け・確定申告CSV出力
- USDC ↔ JPYC 切替（クロスボーダー対応）
- 複数フリーランサー協業時のマイルストーン投票
- World ID / KYC 連携で請求権者の人間性検証
- mainnet本番では実JPYC（電子決済手段）を採用

## ライセンス

MIT — see [LICENSE](./LICENSE).

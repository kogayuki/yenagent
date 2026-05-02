# YenAgent — オンチェーン証拠リスト (Polygon Amoy testnet)

> Hackathon 提出時にURLをそのまま貼れる。ピッチ・README・サブミッションフォームに使う。

## デプロイ済みコントラクト

| コントラクト | アドレス | Explorer |
|------------|---------|----------|
| MockJPYC (ERC20, 18 dec) | `0x7200829959bf70085D9AeaDFCDFACc1E99356db7` | [`view`](https://amoy.polygonscan.com/address/0x7200829959bf70085D9AeaDFCDFACc1E99356db7) |
| EscrowLite (milestone-based) | `0x5f692E7e62B372BE71434816bE35781bE5fcf454` | [`view`](https://amoy.polygonscan.com/address/0x5f692E7e62B372BE71434816bE35781bE5fcf454) |

Deployer: [`0x7CFbd5AA04B07840A0e6412323a95122c2eae551`](https://amoy.polygonscan.com/address/0x7CFbd5AA04B07840A0e6412323a95122c2eae551)

## トランザクション証拠（時系列）

| # | アクション | tx | 証明する内容 |
|---|----------|-----|-------------|
| 1 | MockJPYC `faucet(100k)` | [`0x6caa29a8...3f39778a3df`](https://amoy.polygonscan.com/tx/0x6caa29a85e57a19504259fe91fb67b1899354df51a056dabbba338f39778a3df) | 任意mint機構が機能 |
| 2 | JPYC `approve(escrow, 30000)` | [`0xd0b8a7f0...e72fe97338`](https://amoy.polygonscan.com/tx/0xd0b8a7f007fbb629a061225b0a1bd0284dfbda0968f2c0dc1cf0e8e72fe97338) | createEscrowツールの内部1tx目 |
| 3 | EscrowLite `createEscrow(30000, 3 milestones)` | [`0xb3e65140...371dd36b25`](https://amoy.polygonscan.com/tx/0xb3e65140f9e93d8115fc94f5a653e88a56a61bf8014f680c05619b371dd36b25) | エスクローID=0 が30,000JPYCで3分割ロック |
| 4 | EscrowLite `release(0, 1)` | [`0xb548af09...324cb260da`](https://amoy.polygonscan.com/tx/0xb548af09bae37f9a2fb1d19068fc5ccd2eed145e18815ea2b4f279324cb260da) | milestone 1で10,000JPYCがpayeeへ実解放 |

## エスクロー状態（Read-Only検証用）

```
escrowId: 0
payer: 0x7CFbd5AA04B07840A0e6412323a95122c2eae551
payee: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
token: 0x7200829959bf70085D9AeaDFCDFACc1E99356db7 (MockJPYC)
amount: 30,000 JPYC (= 30000e18 wei)
released: 10,000 JPYC
milestoneCount: 3
milestonesPaid: 1
memo: "INV-TEST-001"
```

`getEscrow(0)` を [Polygon Amoy Explorer Read tab](https://amoy.polygonscan.com/address/0x5f692E7e62B372BE71434816bE35781bE5fcf454#readContract) で叩けばライブ確認可能。

## 検証手順（審査員向け）

1. **コントラクト確認**: 上記アドレスで Polygonscan を開き、`Read Contract` タブで `getEscrow(0)` を実行
2. **tx確認**: 上の4本のtx URLを開き、Status=Success・Gas消費・イベント発火を確認
3. **コード一致確認**: GitHub repo のSolidityソースとExplorerの bytecode が一致

## Hardhatローカルテスト

```
✔ 3分割マイルストーンを順番通り release できる (1307ms)
✔ 順番を飛ばすと revert する

  2 passing (1s)
```

`contracts/test/Escrow.test.ts` 参照。

## OpenClaw skill 動作確認

- `~/.openclaw/skills/yenagent/SKILL.md` 配置済み
- TUI で「ABC社の案件、3万円、5月末締め、3分割で請求書」と入力 → Claude (claude-opus-4-7) がSKILLを読み込み・`createInvoice.ts` を Bash で起動・JSON結果を整形して返答（スクショ証拠あり）
- ガス不足時に Claude が自律的に faucet 提案で fallback（`docs/screenshots/...`）

# YenAgent — 当日デモ進行台本（90秒 + Q&A 30秒）

## 配役 / 機材

- **発表者**: Yuki（OpenClaw TUI操作 + ピッチ）
- **画面**: 横並び3面
  - **左**: OpenClaw TUI（フォントサイズ大きめ、文字くっきり）
  - **中央**: ピッチスライド（次のスライド/補足図）
  - **右**: Polygon Amoy Explorer（事前にescrowIdとtxを開いてある状態）

## ライブデモ進行（90秒厳守）

| 秒 | 場面 | 操作 / セリフ |
|----|------|--------------|
| **0:00** | 導入 | 「副業1,200万人時代の日本のフリーランサーに必要なのは、請求から決済まで全自動でやってくれるAIエージェントです」 |
| **0:08** | TUI起動済み画面 | 「これは僕のローカルOpenClawです。LINEでもDiscordでも同じスキルが動きます。今日はTUIで」 |
| **0:15** | **入力①** | TUIに打ち込む：<br>`ABC社の案件、3万円、5月末締め、3分割で請求書を発行して` |
| **0:22** | Claude応答 | 「YenAgent SKILLを読んで、createInvoiceツールを起動。請求書INV-xxxを発行」（テーブル表示）。<br>セリフ：「3万円を1万円×3マイルストーンに自動分割。クライアントに送る前提のドラフトです」 |
| **0:35** | **入力②** | `クライアント承認取れた。エスクロー作って。私のアドレスは ...、3万JPYC、3分割、メモはINV-DEMO` |
| **0:42** | Claude確認 | 「**ブロックチェーンへtxが流れます。実行していい？**」<br>セリフ：「重要な操作前に必ず確認するよう、SKILLで設計してます」 |
| **0:48** | **入力③** | `OK` |
| **0:50** | tx発火 | TUIに「approve tx → createEscrow tx」のURL2本表示<br>**右画面のExplorerに切り替え**、tx着弾を見せる |
| **1:00** | セリフ | 「Polygon Amoy testnetに **30,000 JPYCをロック**しました。手数料 0.005 POL、5秒で着金確認」 |
| **1:08** | **入力④** | `納品しました。GitHub PR: https://github.com/openclaw/openclaw/pull/1` |
| **1:13** | Claude応答 | monitorDelivery が発火 → GitHub APIで状態取得 → 「PR検知完了」 |
| **1:20** | **入力⑤** | `milestone 1 を release して` |
| **1:25** | tx発火 | release tx URL → Explorer で payee に **10,000 JPYC着金**を見せる |
| **1:30** | クロージング | 「ここまで人手は **タップだけ**。請求書発行から決済確定まで、AIエージェントが全部走らせました。**Bridging AI Reasoning with Blockchain Execution** 、それを LINE と JPYC で日本に降ろすのが YenAgent です」 |

## フェイルセーフ（順位優先順）

### Plan B-1: ガス不足エラー時
シナリオ通り見せる。「**Claude が自律的にエラーを検知して faucet を案内します**」と喋りながら見せる。**むしろagentの成熟度の証明**として使える。

### Plan B-2: ネットワーク詰まり / Amoy遅延時
事前に流したtx hash（[`evidence.md`](./evidence.md)記載の4本）を Explorer で開いて見せ、「**こちらが先ほど同じツールで流したtx**」と切替。

### Plan B-3: TUI応答が極端に遅い時
入力③の時点で「**裏で動画が録ってあるので、ここから録画切り替えます**」と素直に切替。録画は事前作成しておく（後述）。

### Plan B-4: Wi-Fi切断
**ngrok / インターネット不要**でも、TUIとローカルOpenClawとAmoy RPC（公衆ノード使うが）はキャッシュ済みtxを表示できる。最後の手段で「録画再生のみ」へ。

## Q&A 想定（30秒持ち時間）

| 質問 | 回答（10秒） |
|------|-----|
| なぜ JPYC？ | 規制下の正規円ステーブル・FX不要・日本ユーザーがCEXで簡単入手 |
| なぜ Polygon？ | gas安・toolingで最速ローンチ。本番はJPYC社の選好チェーンに合わせる |
| 本物のLINE Botにいつ載る？ | OpenClawの公式LINE adapter（`@openclaw/line`）で構築途中。Webhook詰まり中だが、TUI動作と完全互換 |
| ISEAIで動く？ | はい。SKILL.mdをそのまま投入できます。非技術者向けの導線になります |
| 投資助言は？ | しません。SKILLで断定的助言を禁じる system prompt を入れています |
| 同じことpyth + claude + viem で書けば？ | 書けます。ただし **OpenClaw skill model** が「LINE/Discord/Slack/Signal どれでも同じ業務ロジックを使える」ポータビリティを担保します |
| サイバー攻撃のリスクは？ | testnetなので資産価値ゼロ。本番はWorld ID等で人間性検証 + agent鍵を分離 |

## 当日チェックリスト（10:00-15:00 の準備時間）

- [ ] OpenClaw TUI起動・gateway接続確認
- [ ] `~/.openclaw/skills/yenagent/SKILL.md` 配置確認
- [ ] テストウォレット POL残高確認（**最低 0.05 POL**、足りなければ補充）
- [ ] MockJPYC残高確認（少なくとも 100k JPYC）
- [ ] Polygon Amoy Explorer のタブを4枚事前に開いておく（contract / 4tx）
- [ ] フォントサイズ大きめ・ターミナル背景は薄色推奨
- [ ] スマホ録画用 (デモのバックアップ動画用)
- [ ] バッテリー満充電 + 充電器
- [ ] Wi-Fiバックアップ（テザリング設定）

## 録画用バックアップ動画スクリプト

別ファイル `docs/demo-recording.md` で（後で作成）。
本番デモが完璧でも事前録画は必ず用意。3分動画で90秒デモ + Explorerウォークスルー。

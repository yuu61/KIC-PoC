---
title: L2/L3 設計・DNS・オブザーバビリティ
description: 60行のACLによるフラッディング抑制、Unbound フルリゾルバ、Prometheus + Grafana の監視スタック、Proxmox による仮想化。
order: 3
updatedDate: 2026-07-14
---

## L2/L3 設計とブロードキャスト抑制

家庭向け・SOHO向けの機器では難しい、L2/L3 のフィルタリングを IX2215 で行い、まともなLAN環境を構築しています。

その中身は **60行ほどの ACL** です。通常のネットワークではありえない量ですが、裏を返せば、既存環境はそれだけのフィルタを書かないと静かにならないほど汚染されているということです。

![IX2215 の ACL 設定出力。blockl2(EtherType)、bdhcp(IPv4)、oldlan(IPv4・IPv6 の両方)の各リストが定義されている](/KIC-PoC/images/acl-output.png)

フィルタは大きく3系統に分かれています。

- **blockl2** — 特定 EtherType のL2フレームを遮断
- **bdhcp** — 学内LAN側からの DHCP(udp/67-68)を遮断し、[問題2](/KIC-PoC/problems/) のレース応答を PoC セグメントに持ち込ませない
- **oldlan** — NetBIOS、SNMP、SSDP、WS-Discovery、mDNS、LLMNR、プリンタ探索(BJNP 等)、Dropbox LAN Sync といった探索系トラフィックを IPv4/IPv6 の両方で遮断

この抑制の効果は [現状の課題](/KIC-PoC/problems/) に載せた実測動画のとおり、無関係パケット 75% → 8% 前後です。

## Unbound フルリゾルバをローカルに設置

DHCP で Google Public DNS(8.8.8.8)や Cloudflare DNS(1.1.1.1)を配る構成をよく見かけますが、利用者はこれらの事業者へクエリを送信することにも、そのプライバシーポリシーにも明示的に同意していません。本来は不適切な構成です。ユーザー数の増加につれて NAPT のセッションが溢れる問題もあります(この対策としては DoH という選択肢もあります)。

本PoCでは Proxmox VE 上に Unbound のコンテナを構築し、外部のパブリックDNSに依存しない、高速で安定した名前解決を提供しています。性能面は 100,000 qps まで耐えられる見込みです。

## オブザーバビリティ

監視・テレメトリ・ログ集約の標準スタック(Prometheus / Grafana / SNMP / Rsyslog)を LXC で構築し、Grafana ダッシュボードを公開しています。

**公開ダッシュボード: [https://tukushityann.net/grafana/](https://tukushityann.net/grafana/)**

![Grafana ダッシュボード。IX2215 のインターフェース状態とトラフィック、C9800 と AP の状態、Proxmox のリソース、Unbound の QPS とキャッシュヒット率が1画面に並ぶ](/KIC-PoC/images/grafana.png)

ルーターのインターフェース状態、WLC に join した AP 数、サーバーのリソース、DNS の QPS まで、この構成の生存状態はすべてここで見られます。

## 仮想化による高い運用効率

WLC(C9800-CL)の VM も、各種サービスのコンテナも、すべてミニPC 1台の Proxmox VE 上に載せています。物理的な設置スペースと消費電力を抑えつつ、高密度で効率的なマシン運用を実現しています。

![Proxmox VE の管理画面。VM 100 (c9800) と LXC 101 (unbound)、102 (local-server) が1ノードに同居](/KIC-PoC/images/proxmox.png)

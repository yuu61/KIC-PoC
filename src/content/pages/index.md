---
title: エンタープライズ機器を用いたキャンパスネットワークの再設計と実証
description: 単一SSIDローミングと L2/L3 フラッディング抑制で、ユーザー体験の向上と運用効率の両立を狙う学内LANオーバーレイ
updatedDate: 2026-07-14
demo: https://tukushityann.net/grafana/
---

## 概要

「一応動くから」と誰も問題視しないまま、教室ごとの Wi-Fi 繋ぎ替えも遅さも「当たり前」として内面化され、本来要求できるはずの快適さが諦められている——KIC-PoC は、この“慣れ”が覆い隠してきた学内LANの課題に正面から向き合うプロジェクトです。

稼働中の学内LANは止めず、エンタープライズ機器(Cisco Catalyst 9800-CL、Aironet AP3802I、NEC IX シリーズ)によるオーバーレイネットワークを併走させます。利用者を SSID 繋ぎ替えという因習から解放し、他人宛ての雑音が消えて自分宛てだけが届く“静かな体験”を返したうえで、L3 分離による効率と、監視スタックによる可観測性まで、たった一つの再設計から地続きに実現します。

百聞は一見に如かず。同じ場所・同じクライアントで、届くパケットを既存LAN(左)と本PoC(右)で同時にキャプチャした様子がこちらです。

<video controls muted playsinline preload="metadata" poster="/images/pac-poster.jpg" width="1920" height="1080">
  <source src="/videos/pac.mp4" type="video/mp4" />
</video>

既存LANでは届くパケットの **約75%が自分と無関係**(他人宛てのブロードキャスト/マルチキャスト)なのに対し、PoC 側では **8%前後** まで抑えられています。

## 目指すもの

| 柱 | 内容 |
| --- | --- |
| UX | 単一SSIDによるシームレスローミング(繋ぎ替え不要) |
| 効率 | MGMT / USER セグメントの L2/L3 分離とマルチキャスト制御 |
| オブザーバビリティ | 監視・テレメトリ・ログ集約の標準スタック |
| セキュリティ | 管理面の分離と現代的な無線セキュリティ |

## 背景と課題

現状の学内LANは、言うなればアンチパターンの教科書です。

- **/16 の過大なサブネット** — 建物全体が1本のL2になり、届くパケットの75%が無関係
- **10台の DHCP サーバー** — レース応答の勝者によって出口ルーターと ISP が接続ごとに変わる
- **誤った無線設計と運用** — 「当たり前ですが教室を移動したら繋ぎ変えましょう」という案内(それは本来 WLC の仕事)
- **効果のない負荷分散と冗長化** — VRRP も GLBP もない3台のルーターに、10台の DHCP が GW をバラバラに配るだけ(大半が NURO、ぷらら向けは2台のみ)
- **脆弱なセキュリティと運用** — SNMPv1/public、Telnet 開放、管理VLANなし

それぞれの詳細は [現状の課題](/problems/) にまとめています。

## 全体構成

![全体構成図。上半分が既存の学内LAN(192.168.0.0/16 untag)、下半分がPoCオーバーレイ(IX2215×3 + Proxmox + C9800-CL)と自宅側(IX3315)](/images/architecture.jpg)

- **WLC**: Cisco Catalyst 9800-CL(IOS-XE 17.15、Proxmox 上の VM)
- **AP**: Cisco Aironet AIR-AP3802I(FlexConnect、各部屋2台 × 3部屋)
- **L2 / ルーティング基盤**: NEC IX2215 × 3(各部屋1台)+ NEC IX3315(センタールーター)。部屋間は EtherIP トンネルで trunk(VLAN100/999)を延伸して1つのL2に連結(敷設ケーブル長を抑える狙い)
- **サーバー**: Proxmox VE + LXC(Prometheus / Grafana / SNMP / Rsyslog / Unbound / nginx)
- **遠隔運用・ユーザー出口・公開**: 自宅の IX3315 と EtherIP over IKEv2/IPsec で接続。ユーザー(VLAN999)の外向き通信もこのセンタールーターで NAPT し、IPv6 も提供。tukushityann.net は static NAPT で公開

セグメントは管理 VLAN100(10.98.38.0/24: WLC WMI・AP管理・サーバー管理・SNMP)とユーザー VLAN999(172.16.0.0/22: SSID KIC-PoC-WiFi、WPA3/WPA2-Personal、IPv4/IPv6 デュアルスタック)に分離しています。

機材選定の裏話として、無線系は Cisco で統一しつつ、ルーターは L2TPv3 を扱える機材を揃えられなかったため EtherIP が使える NEC IX シリーズを採用しました。サーバーはミニPC上の Proxmox VE です。

設計の詳細は [無線設計とローミング](/wireless/) と [L2/L3 設計・DNS・オブザーバビリティ](/infra/) にまとめています。

## 成果: 問題への対応状況

| # | 現状の問題 | PoC での対応 | 状態 |
| --- | --- | --- | --- |
| 問題1 | /16 フラットL2・無関係パケット75% | ユーザーを独立VLAN(999)の別L2に収容し、IX2215 の ACL で探索系フラッディングを遮断。管理面も専用L3に分離 | 管理セグ=分離 / ユーザーセグ=L2・egress とも分離(センタールーターで NAPT・IPv6 提供) |
| 問題2 | DHCP 10台レース・GW/ISP が接続ごとに変動 | 各L3セグメントに権威ある単一 DHCP/GW(IX2215) | 解決(PoC内) |
| 問題3 | SSID で接続制御・手動繋ぎ替え | 単一SSID + 802.11k/v/r による WLC 管理ローミング。低RSSI/低レート端末は WLC が強制切断(Optimized Roaming)しスティッキー化を防止 | 解決(全域シームレス実証は残課題) |
| 問題4 | VRRP/GLBP 不在の偽冗長・偽負荷分散 | 単一権威 GW で「リースごと GW 変動」を排除。真の冗長(VRRP/GLBP)は本番化ステップ | 部分(偽LB排除)/ 冗長はスコープ外 |
| 問題5 | SNMPv1/public・Telnet・管理VLAN無し | 管理VLAN分離で管理面(SNMP/Telnet)を一般端末から隔離・WPA3/WPA2+PMF | 解決 |

## 接続してみる

PoC エリア内(対象の3部屋)では、以下の SSID に接続できます。

- SSID: `KIC-PoC-WiFi`
- パスワード: `NewOrder`

![Wi-Fi接続用QRコード(SSID: KIC-PoC-WiFi)](/images/wifi-qr.png)

## 残課題・今後の展望

- **学校側 egress の根治** — 現状はユーザー出口をセンタールーター(自宅 IX3315)へ EtherIP で延伸し、そこで NAPT・IPv6 提供を行って回避している。学校側の既存ルーター・巨大L2 を直接通したときの新規フロー初手ドロップ自体は権限外で根治できておらず、学内インフラだけで清潔に egress する方法は今後の研究課題として残す
- **全AP展開** — 各部屋の AP join を完了させ、マルチAPローミングの本格的な検証へ
- **eduroam への展開** — Google Secure LDAP を用いた認証基盤の接続

## まとめ

アンチパターン化した学内LANに対し、エンタープライズ機器で“あるべき実装”をオーバーレイとして構築しました。UX の向上(単一SSIDシームレスローミング)と効率性(セグメント分離・可観測性)の両立を、ひとつの設計で示しています。

## 発表者について

**山﨑 結友**([@tukushityann](https://twitter.com/tukushityann))
神戸電子専門学校 ITエキスパート学科 / SRE NEXT 2026 NOC Core Network Lead

![SRE NEXT 2026 NOC での作業風景](/images/noc-work.jpg)

![NOC のラック。NEC IX3315 やタイムサーバー、Aruba AP が積まれている](/images/noc-rack.jpg)

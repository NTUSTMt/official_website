# 台科大登山社官方網站 (NTUST Mountaineering Club Official Website)

[![GitHub repo](https://img.shields.io/badge/GitHub-Repo-blue?logo=github)](https://github.com/NTUSTMt/official_website.git)

這是一個為台科大登山社打造的現代化全端官網，旨在提供完善的社員服務、活動報名及裝備租借功能。

## 最新更新 (Latest Updates)

- **風格調整**: 全站改為「純白/淺色系」風格，提供更清新、現代的閱讀體驗。
- **導覽列優化**: 實作了首頁專屬的導覽列行為 —— 進入首頁時地位於 Hero 底部，滾動至頂部時自動固定（Sticky）。
- **結構簡化**: 移除了首頁的組織章程區塊，使 Landing Page 更加聚焦於核心活動與精神。

## 核心功能 (Core Features)

- **現代化設計 (Modern Design)**: 基於玻璃擬物化 (Glassmorphism) 風格，兼顧美感與易用性。
- **雙平台支援 (Dual-Platform)**: 完美支援電腦版網頁與 PWA (手機 APP 體驗)。
- **我的足跡 (My Footprints)**: 會員專區，檢視個人登山履歷與紀錄。
- **一鍵報名 (One-click Registration)**: 簡化繁瑣的活動報名流程。
- **裝備租借 (Equipment Rental)**: 線上預約與庫存管理。
- **LINE 整合 (LINE Integration)**: 支援 LINE 登入與主動式訊息通知。

## 技術棧 (Tech Stack)

- **框架 (Framework)**: Next.js 16 (App Router)
- **語言 (Language)**: TypeScript
- **樣式 (Styling)**: Tailwind CSS (OKLCH Color Space)
- **字體 (Typography)**: Playfair Display (Display), Crimson Pro (Serif), JetBrains Mono (Mono)
- **PWA**: @serwist/next

## 開發進度 (Development Status)

- [x] **Phase 1: 基礎架構 (Infrastructure)**
  - [x] Next.js 專案初始化
  - [x] PWA 支援配置
  - [x] 導覽列與頁尾組件實作
  - [x] 全站白色系風格調整
  - [x] 首頁內容對齊原型 (已簡化)
- [ ] **Phase 2: 會員系統 (Member System)**
  - [ ] LINE 登入整合
  - [ ] 會員資料庫設計 (Supabase)
  - [ ] 個人足跡與數位會員證
- [ ] **Phase 3: 活動與裝備 (Events & Gear)**
  - [ ] 活動報名系統邏輯
  - [ ] 裝備租借與庫存連動

## 開始開發 (Getting Started)

```bash
npm install
npm run dev
```

---
*註：為了還原設計質感，專案使用了多種 Google Fonts。開發環境中建議使用 Webpack 模式以確保 PWA 與字體載入穩定。*

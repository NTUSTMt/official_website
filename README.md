# 台科大登山社官方網站 (NTUST Mountaineering Club Official Website)

[![GitHub repo](https://img.shields.io/badge/GitHub-Repo-blue?logo=github)](https://github.com/NTUSTMt/official_website.git)

這是一個為台科大登山社打造的現代化全端官網，旨在提供完善的社員服務、活動報名及裝備租借功能。
目前專案正處於開發第一階段，已完成基礎頁面架構與 PWA 支援。

This is a modern full-stack official website for the NTUST Mountaineering Club. The project is currently in Phase 1, with basic page structure and PWA support completed.

## 核心功能 (Core Features)

- **現代化設計 (Modern Design)**: 基於玻璃擬物化 (Glassmorphism) 風格，兼顧美感與易用性。
- **雙平台支援 (Dual-Platform)**: 完美支援電腦版網頁與 PWA (手機 APP 體驗)。
- **我的足跡 (My Footprints)**: 會員專區，檢視個人登山履歷與紀錄。
- **一鍵報名 (One-click Registration)**: 簡化繁瑣的活動報名流程。
- **裝備租借 (Equipment Rental)**: 線上預約與庫存管理。
- **LINE 整合 (LINE Integration)**: 支援 LINE 登入與主動式訊息通知。
- **後台管理 (Admin Dashboard)**: 供社團幹部管理會員、活動與財務。

## 技術棧 (Tech Stack)

- **框架 (Framework)**: Next.js 14+ (App Router)
- **語言 (Language)**: TypeScript
- **樣式 (Styling)**: Tailwind CSS
- **資料庫 (Database)**: Supabase / PostgreSQL
- **身分驗證 (Auth)**: NextAuth.js / Supabase Auth (LINE Login)

## 未來擴充想法 (Future Roadmap)

以下為計畫中但尚未實作的功能 (Suggested features for future implementation):

1. **裝備損耗與維修追蹤 (Equipment Lifecycle)**: 自動化追蹤裝備狀態，管理維修紀錄。
2. **歷史軌跡與社團傳承 (GPX & Archive)**: 建立數位典藏空間，分享 GPX 軌跡與活動相簿。
3. **幹部權限細分 (Role-Based Access Control)**: 針對總務、裝備長、活動長等不同職位提供細部權限。

## 開發進度 (Development Status)

- [x] **Phase 1: 基礎架構 (Infrastructure)**
  - [x] Next.js 專案初始化
  - [x] PWA 支援 (@serwist/next)
  - [x] 基礎頁面導覽 (/about, /events, /equipment, /profile)
  - [x] Supabase 客戶端配置
- [ ] **Phase 2: 會員系統 (Member System)**
  - [ ] LINE 登入整合
  - [ ] 會員資料庫設計
  - [ ] 個人足跡功能
- [ ] **Phase 3: 活動與裝備 (Events & Gear)**
  - [ ] 活動報名系統
  - [ ] 裝備租借系統

## 開始開發 (Getting Started)

```bash
npm install
npm run dev
```

---
*註：若遇見 `Module not found: Can't resolve './mp1cyw0q-background.jpg'` 錯誤，請確保原始 HTML 原型已移至 `legacy/` 資料夾中以避免 Tailwind 掃描出錯。*

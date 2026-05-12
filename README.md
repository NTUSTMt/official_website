# 台科大登山社官方網站 (NTUST Mountaineering Club Official Website)

[![GitHub repo](https://img.shields.io/badge/GitHub-Repo-blue?logo=github)](https://github.com/NTUSTMt/official_website.git)

這是一個為台科大登山社打造的現代化全端官網，旨在提供完善的社員服務、活動報名及裝備租借功能。

- **規章制度遷移**: 完成了從 Jimdo 舊站到 Next.js 的規章遷移。採用分散式頁面架構，並透過 Google Docs 嵌入實現章程的即時管理。
- **活動中心實作**: 建立了完整的活動入口、行事曆 (Calendar) 與活動清單。
- **我的足跡 (Profile)**: 建立了個人儀表板，包含詳細爬山資料管理、出團紀錄與裝備借用歷史。

## 核心功能 (Core Features)
# 台科大登山社全新官網 (NTUST Mountaineering Club Official Website)

這是國立臺灣科技大學登山社的全新官網，旨在將舊有的 Jimdo 網站現代化，並提供更好的使用者體驗與功能整合。

## 🚀 技術棧 (Tech Stack)
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Typography**: Playfair Display, Crimson Pro, JetBrains Mono, Inter
- **Theme**: 純白/淺色系 (Modern Light Theme)
- **Integration**: Google Docs (嵌入章程), LINE API (登入預備)

## 🛠 已完成功能 (Completed Features)
- **首頁 (Landing Page)**: 具備 Sticky Glassmorphism 導覽列與 Hero 區塊。
- **我的足跡 (Profile)**:
  - 個人簡介與頭像管理。
  - 詳細資料表單：包含保險所需的完整個人與緊急聯絡人資訊。
  - 歷史紀錄：整合出團紀錄（報名狀態）與裝備租借歷史。
- **活動中心 (Events Hub)**: 
  - 包含活動分級、近期行程 (Calendar) 及詳細活動列表。
  - 整合報名入口與歷史花絮。
- **裝備租借 (Equipment)**:
  - 結構化裝備資料庫，支援按類別篩選。
  - 實作多項裝備一次性預約 (購物車機制)。
- **規章制度 (Rules)**:
  - 分散式管理：入社、裝備、社辦、章程四大部分。
  - 實作側邊導覽介面與 Google Docs 同步機制。
- **關於山社 (About)**: 
  - 整合 1979 年以來的創社簡史。
  - 完整收錄從 68 學年度至今的歷任社長傳承名單。
  - 採用時光軸 (Timeline) 設計呈現歷史脈絡。

## 📅 未來開發路徑 (Future Roadmap)
1. **活動系統 (Events)**:
   - 實作報名功能與行事曆整合。
2. **裝備管理 (Equipment)**:
   - 數位化裝備租借流程與規章同意系統。
3. **後台管理 (Admin)**:
   - 幹部專用的活動與裝備 CRUD 介面。

## 📦 部署說明 (Deployment)
由於 GitHub 權限限制，建議使用以下指令進行生產環境部署：
```bash
vercel --prod
```

## ✒️ 致謝 (Credits)
- 原始網頁設計與照片提供：高靖捷 (105級社長)
- 歷史資料來源：台科大登山社舊版 Jimdo 官網

## 開始開發 (Getting Started)

```bash
npm install
npm run dev
```

---
*註：為了還原設計質感，專案使用了多種 Google Fonts。開發環境中建議使用 Webpack 模式以確保 PWA 與字體載入穩定。*

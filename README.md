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

- **後台管理系統 (Admin Dashboard)**: 
  - 實作了幹部專用的全站管理後台。
  - **內容管理 (CMS)**：可動態修改首頁標語、統計數據、公告與歷史里程碑。
  - **活動管理 (Events)**：支援活動上架、編輯與隊員名單審核（正取/備取）。
  - **裝備管理 (Equipment)**：圖卡式庫存管理、領取/歸還流程審核、維修狀態標記。
  - **社員管理 (Users)**：完整的社員通訊錄與詳細資料（保險資訊）檢視功能。
- **資料庫整合 (Supabase Integration)**:
  - 成功從靜態 Mock 資料遷移至真實的 Supabase (PostgreSQL) 雲端資料庫。
  - 實作了資料存取層 (Services)，支援即時同步與持久化存儲。

## 📅 未來開發路徑 (Future Roadmap)
1. **認證系統 (Authentication)**:
   - 實作 Supabase Auth，支援 Google 與 LINE 登入。
2. **多媒體存儲 (Storage)**:
   - 串接 Cloudflare R2 管理活動照片與裝備圖片。
3. **自動化通知**:
   - 整合 LINE Bot 提醒活動報名進度與裝備歸還。


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

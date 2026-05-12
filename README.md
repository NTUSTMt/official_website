# 台科大登山社全新官網 (NTUST Mountaineering Club Official Website)

[![GitHub repo](https://img.shields.io/badge/GitHub-Repo-blue?logo=github)](https://github.com/NTUSTMt/official_website.git)

這是一個為台科大登山社打造的現代化全端官網，旨在將舊有的 Jimdo 網站現代化，提供完善的社員服務、活動報名及裝備租借功能，並具備高度靈活的內容管理系統。

## 🚀 技術棧 (Tech Stack)
- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Vanilla CSS + Tailwind (Utility-first for layout)
- **Typography**: Playfair Display, Crimson Pro, Nunito, Inter
- **Theme**: 純白/淺色系 (Modern Premium Light Theme)
- **Icons**: Lucide React

## 🛠 已完成功能 (Completed Features)
- **首頁 (Landing Page)**: 具備 Sticky Glassmorphism 導覽列與純淨品牌 Hero 區塊。
- **我的足跡 (Profile)**: 包含個人簡介、保險資料管理與歷史出團紀錄。
- **活動中心 (Events Hub)**: 
  - **活動分級**: 動態管理的難度分級說明。
  - **學期行事曆**: 管理員可上傳每學期的精美行程海報，支援左右滑動瀏覽。
  - **活動列表**: 整合報名入口、費用說明與狀態顯示。
- **裝備租借 (Equipment)**: 結構化裝備資料庫，支援類別篩選與多項預約機制。
- **規章制度 (Rules)**: 分散式管理入社、裝備、社辦、章程，透過 Google Docs 嵌入實現同步。
- **關於山社 (About)**: 
  - **歷史時光軸**: 1979 年至今的創社簡史。
  - **歷任幹部**: 完整收錄歷代傳承名單，後台可動態編輯並支援照片上傳。
  - **職責說明**: 動態管理的幹部分工與登山守則。

- **後台管理系統 (Admin Dashboard)**: 
  - **全站內容 (GENERAL/ABOUT)**：動態修改公告、里程碑與關於我們內文。
  - **幹部管理 (LEADERSHIP)**：管理歷屆名單、上傳頭像，支援手機端橫向滑動檢視。
  - **職責與分級 (ROLES/LEVELS)**：動態設定幹部職責說明與活動難度分級。
  - **活動與報名 (EVENTS)**：
    - **進階編輯器**: 全新雙欄位活動編輯器（左側 Metadata 預覽，右側 Markdown 內容），支援**活動封面圖片即時預覽與上傳**。
    - **報名管理**: 審核隊員報名名單，新增 **報名截止日** 欄位。
    - **近期行程 (CALENDAR)**: 集中管理學期行事曆圖片上傳。
  - **裝備管理 (EQUIPMENT)**：圖卡式庫存管理、審核流程。
  - **社員管理 (USERS)**：檢視社員保險資訊與通訊錄。
  - **規章制度 (RULES)**：新增專用管理分頁，包含入社規範、活動參與指引、租借規則、社辦規範及組織章程的分頁架構。
- **資料庫與多媒體 (Supabase & Storage)**: 
  - 全面遷移至真實雲端資料庫，實作 Services 層處理持久化存儲。
  - **Bucket 分類存儲**: 已實作 `avatars` (幹部), `calendars` (行事曆), `events` (活動) 分離管理。

## 📅 未來開發路徑 (Future Roadmap)
1. **認證系統 (Authentication)**:
   - 實作 Supabase Auth，支援 Google 與 LINE 登入。
2. **多媒體存儲 (Storage)**:
   - 使用 Supabase Storage 進行分類存儲：
     - `avatars`: 歷任幹部頭像。
     - `calendars`: 學期行事曆海報。
     - `events`: 活動封面圖片。
   - (未來計劃) 串接 Cloudflare R2 以優化全球存取速度。
3. **自動化通知**:
   - 整合 LINE Bot 提醒活動報名進度與裝備歸還。



## 🛠 環境變數設定 (Environment Variables)

本專案使用 Supabase 作為後端資料庫。請確保在本地開發環境中建立 `.env.local` 檔案：

```bash
# 複製範例檔案 (Copy example file)
cp .env.example .env.local
```

### 必要變數 (Required Variables):
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 專案 URL。
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 匿名金鑰 (Anon Key)。

> [!TIP]
> 如果缺少環境變數，系統將自動切換至 **模擬模式 (Mock Mode)**，使用 `src/data` 中的靜態資料，以便在沒有資料庫連線的情況下進行前端開發。

## 🔍 常見問題排查 (Troubleshooting)

### `TypeError: Failed to fetch`
- **原因**: 通常是因為 `NEXT_PUBLIC_SUPABASE_URL` 為空或無效。
- **解決**: 檢查 `.env.local` 是否正確設定，並重啟開發伺服器 (`npm run dev`)。

### 資料未更新 (Data not updating)
- **原因**: 如果正在使用模擬模式，儲存操作將不會持久化到資料庫。
- **解決**: 檢查管理後台 (Admin Dashboard) 是否顯示「尚未設定 Supabase」的警告。

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

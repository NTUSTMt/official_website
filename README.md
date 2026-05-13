# 台科大登山社官網 - 會員與足跡系統 (NTUST Mountaineering Club)

本專案已完成現代化升級，新增了全面的會員管理系統與「我的足跡」個人化門戶。

## 🚀 新增功能亮點

### 1. 會員管理中心 (Admin Member Management)
*   **全版高效表格 (`/admin/users`)**：採用 Edge-to-Edge Excel 風格介面，消除側邊限制以極大化作業空間。支援水平捲動，直觀顯示「身分、學號/單位、LINE ID、Email、狀態與餘額」。
*   **深度詳情檢視**：新增「>」快捷按鈕，點擊後開啟高對齊 Modal，檢視該社員的 14 項保險詳細資料、專業技能標籤與完整的財務摘要。
*   **模組化佈局優化**：針對不同管理模組實作彈性版型；會員管理享有全寬視野，而內容管理與規則設定則維持最佳閱讀寬度 (Max-width)。
*   **即時狀態操作**：支援在表格中直接切換社員身分（Active/Unpaid/Alumni）並快速調整帳戶餘額。
*   **安全守衛**：採用環境變數驗證與 Middleware 攔截，確保管理路徑的安全。

### 2. 我的足跡 (My Footprints)
*   **個人簡介**：動態展示社員身分、專業技能標籤及財務狀態。
*   **山岳足跡**：允許社員手動登錄攀登歷史，並能自動同步社團官方出隊紀錄。
*   **全方位資料管理 (`/profile/details`)**：全新升級的個人資料門戶，支援包含「性別、出生日期、證件號碼、國籍、詳細通訊地址及完整緊急聯絡資訊」等 14 項出隊保險必備欄位。
*   **資料安全保障**：所有機密資訊皆加密存儲於 Supabase，僅供社團保險與入園申請行政使用。

### 3. 活動報名系統 (Activity Registration)
*   **一鍵報名**：整合 LINE 登入身分，自動帶入個人檔案中的資料並提供即時確認介面。
*   **後端驗證**：自動檢查重複報名、活動名額限制及報名截止狀態。
*   **狀態追蹤**：提供即時的報名狀態回饋（待審核/已確認）及繳費狀態管理。

### 4. 後台管理系統 (Admin Dashboard)
- **會員管理中心 (`/admin/users`)**: 採用全版 (Edge-to-Edge) Excel 風格設計，支援水平捲動以檢視完整會員資料（包含保險、聯絡與財務資訊），並提供全體會員 CSV 匯出功能。
- **彈性佈局架構**: `AdminLayout` 支援 `fullWidth` 參數。會員管理預設為全版顯示，而活動管理、裝備庫存、規章制度則維持標準寬度限制（`max-w-7xl`），確保內容可讀性。
- **資料同步**: 深度整合 Supabase，支援即時狀態更新與圖片上傳。

### 5. 管理後台全中文化 (Localization)
*   **全介面在地化**：已完成管理後台（`/admin`）及其子模組（活動、會員、裝備、規章）的全中文化轉譯。
*   **專業術語標準化**：系統狀態、操作按鈕、資料載入提示等均採用符合社團行政流程的繁體中文術語，降低操作門檻。
*   **歷史花絮 CMS**：新增專屬照片牆管理模組，支援多圖批次上傳、自動生成預覽與活動說明編輯。
*   **登入介面優化**：管理員登入頁面與導覽列標籤已全面優化，提供一致的視覺與語言體驗。

## 🛠 技術實作細節
*   **資料庫**：Supabase (PostgreSQL) 擴充 `events` 與 `event_registrations` 資料表。
*   **認證**：整合 LINE 登入 (NextAuth) 與 Supabase Adapter。
*   **前端**：使用 Framer Motion 實作流暢的報名彈窗 (RegistrationModal)。

## 📝 後續維護說明 (README Update)
*   **環境變數**：請確保 `.env.local` 包含 `SUPABASE_SERVICE_ROLE_KEY`。
*   **SQL 同步**：新增功能請執行 `src/lib/activity_schema.sql`。
*   **活動管理**：後台管理介面將持續擴充活動新增與報名名單匯出功能。

## ⚠️ 部署注意事項 (Vercel Deployment)
若在 Vercel 部署後遇到 `Server error: There is a problem with the server configuration`，通常是因為缺少 NextAuth (Auth.js) v5 所需的環境變數。請確保在 Vercel Settings > Environment Variables 中設定以下變數：

1.  **`AUTH_SECRET`** (必填): 可使用 `npx auth secret` 產生。
2.  **`AUTH_TRUST_HOST`**: 設定為 `true`。
3.  **`LINE_CLIENT_ID`** & **`LINE_CLIENT_SECRET`**: LINE Login 專案的憑證。
4.  **`NEXT_PUBLIC_SUPABASE_URL`** & **`SUPABASE_SERVICE_ROLE_KEY`**: Supabase 專案的連接資訊。

## 📊 目前開發進度 (Progress Status)

本專案正依照「台科大登山社全新官網架構與設計企劃」穩定推進中：

| 階段 | 項目 | 狀態 | 備註 |
| :--- | :--- | :--- | :--- |
| **Phase 1** | 基礎建設 & UI 系統 | ✅ 已完成 | Next.js, Tailwind, 玻璃擬物化設計已上線 |
| **Phase 2** | 資料庫 & 身分驗證 | ✅ 已完成 | Supabase 整合與 LINE Login (NextAuth) 功能正常 |
| **Phase 3** | 核心功能 (活動/裝備) | ✅ 已完成 | 活動報名與**裝備即時庫存同步系統**已全面上線 |
| **Phase 4** | 後台管理 & PWA | ✅ 已完成 | `/admin` 全功能儀表板與離線 PWA 支援已實作 |
| **Phase 5** | 進階社團專屬功能 | 🟡 進行中 | 安全資料自動帶入、繳費查核、**庫存原子更新 (RPC)** 已完成 |

## 🛠 待辦事項 (Roadmap)
- [ ] **LINE 自動通知**：串接 LINE Notify/Messaging API，在報名成功或審核通過時發送推播。
- [ ] **GPX 數位典藏**：實作 GPX 檔案上傳與地圖展示功能，傳承開隊經驗。
- [ ] **裝備損耗追蹤**：細化裝備管理，增加「損壞回報」與「維修狀態」標記功能。
- [x] **裝備庫存同步**：確保租借流程與庫存數量即時連動（已於 Phase 5 提前完成）。


---
*語言：繁體中文 / English*


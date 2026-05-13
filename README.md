# 台科大登山社官網 - 會員與足跡系統 (NTUST Mountaineering Club)

本專案已完成現代化升級，新增了全面的會員管理系統與「我的足跡」個人化門戶。

## 🚀 新增功能亮點

### 1. 後台管理中心 (Admin Dashboard)
*   **全站內容管理 (`/admin`)**：負責 CMS 設定，包括「關於我們」、歷任幹部、活動分級說明及社務職掌等內容。
*   **活動與報名管理 (`/admin/events`)**：專門用於管理活動行程、新增活動以及進行「隊員名單審核」。
    *   **名單深度整合**：自動關聯隊員個人資料（真實姓名、系級、學號、緊急聯絡資訊）。
    *   **狀態即時控制**：快速切換審核狀態（待審核/已確認）與繳費狀態（已繳費/未繳費）。
    *   **報表匯出**：支援一鍵下載 CSV 報名表，提升幹部統計效率。
*   **安全守衛**：採用環境變數驗證與 Middleware 攔截，確保管理路徑的安全。

### 2. 我的足跡 (My Footprints)
*   **個人簡介**：動態展示社員身分、專業技能標籤及財務狀態。
*   **山岳足跡**：允許社員手動登錄攀登歷史，並能自動同步社團官方出隊紀錄。
*   **詳細資料管理**：社員可自行完善緊急聯絡人、證件號碼等資訊，用於自動化報名流程。

### 3. 活動報名系統 (Activity Registration)
*   **一鍵報名**：整合 LINE 登入身分，自動帶入個人檔案中的緊急聯絡人資訊。
*   **後端驗證**：自動檢查重複報名、活動名額限制及報名截止狀態。
*   **狀態追蹤**：提供即時的報名狀態回饋（待審核/已確認）及繳費狀態管理。

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

---
*語言：繁體中文 / English*

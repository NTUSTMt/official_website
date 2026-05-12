# 台科大登山社官網 - 會員與足跡系統 (NTUST Mountaineering Club)

本專案已完成現代化升級，新增了全面的會員管理系統與「我的足跡」個人化門戶。

## 🚀 新增功能亮點

### 1. 後台管理中心 (Admin Dashboard)
*   **安全存取**：隱藏式登入路徑 `/admin/login`，採用環境變數進行憑證驗證，並透過 HttpOnly Cookie 維持安全會話。
*   **會員管理 (Excel-like)**：提供高效的表格介面，支援即時搜尋、社員狀態切換（Active/Unpaid/Alumni）及財務餘額調整。
*   **權限守衛**：實作 Middleware 自動攔截未授權的後台存取請求。

### 2. 我的足跡 (My Footprints)
*   **個人簡介**：動態展示社員身分、專業技能標籤及財務狀態。
*   **山岳足跡**：允許社員手動登錄攀登歷史，並能自動同步社團官方出隊紀錄。
*   **詳細資料管理**：社員可自行完善緊急聯絡人、證件號碼等資訊，用於自動化報名流程。

## 🛠 技術實作細節
*   **資料庫**：Supabase (PostgreSQL) 擴充 `user_profiles` 與 `user_peaks` 資料表。
*   **認證**：自定義 API Auth 路由 + Next.js Middleware。
*   **介面**：採用高級感 (Premium) 的現代化設計，包含微動畫、磨砂玻璃效果與 HSL 調色盤。
*   **修正**：解決了 `userService.ts` 中物件方法間遺漏逗號導致的語法錯誤 (Build Error)。

## 📝 後續維護說明 (README Update)
*   **環境變數**：請確保 `.env.local` 包含 `ADMIN_USER` 與 `ADMIN_PASS`。
*   **SQL 同步**：若新增欄位，請執行 `src/lib/database.sql` 中的定義。
*   **租借系統連動**：目前已預留餘額欄位，後續可串接裝備歸還後的逾期自動扣款邏輯。

---
*語言：繁體中文 / English*

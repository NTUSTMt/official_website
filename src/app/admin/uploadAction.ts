"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * 伺服器端上傳 Action
 * 使用 Service Role Key 繞過 RLS 權限限制
 */
export async function uploadFileAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const bucket = (formData.get("bucket") as string) || "avatars";
    const fileName = formData.get("fileName") as string;

    if (!file || !fileName) {
      console.error("Upload failed: Missing file or fileName", { bucket });
      throw new Error("缺少檔案或檔案名稱");
    }

    console.log(`Starting upload to bucket: ${bucket}, fileName: ${fileName}, size: ${file.size} bytes`);

    // Convert File to ArrayBuffer for more reliable upload in Server Actions
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 執行上傳 (使用 admin client)
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, buffer, {
        cacheControl: "3600",
        upsert: true, // 允許覆蓋
        contentType: file.type // Explicitly set content type
      });

    if (uploadError) {
      console.error("Supabase Admin Storage Upload Error:", uploadError);
      // 特別檢查如果是桶子不存在的錯誤
      if (uploadError.message.includes("not found")) {
        throw new Error(`儲存桶「${bucket}」不存在，請先在 Supabase 控制台建立此 Storage Bucket 並設為 Public。`);
      }
      throw new Error(`儲存服務錯誤: ${uploadError.message}`);
    }

    // 獲取公開 URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(fileName);

    console.log("Upload successful, public URL:", publicUrl);
    return { success: true, publicUrl };
  } catch (error: any) {
    console.error("Upload Action Final Catch:", error);
    return { success: false, error: error.message || "伺服器上傳處理失敗" };
  }
}

/**
 * 伺服器端批次上傳 Action
 */
export async function uploadFilesAction(formData: FormData) {
  try {
    const files = formData.getAll("files") as File[];
    const bucket = (formData.get("bucket") as string) || "activity-images";
    
    if (!files || files.length === 0) {
      throw new Error("缺少檔案");
    }

    const results = await Promise.all(
      files.map(async (file) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        const { error: uploadError } = await supabaseAdmin.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabaseAdmin.storage
          .from(bucket)
          .getPublicUrl(filePath);

        return publicUrl;
      })
    );

    return { success: true, publicUrls: results };
  } catch (error: any) {
    console.error("Batch Upload Action Error:", error);
    return { success: false, error: error.message };
  }
}

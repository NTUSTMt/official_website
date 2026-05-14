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
      throw new Error("缺少檔案或檔案名稱");
    }

    // 執行上傳 (使用 admin client)
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true, // 允許覆蓋
      });

    if (uploadError) {
      console.error("Supabase Admin Upload Error:", uploadError);
      throw new Error(uploadError.message);
    }

    // 獲取公開 URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return { success: true, publicUrl };
  } catch (error: any) {
    console.error("Upload Action Error:", error);
    return { success: false, error: error.message };
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

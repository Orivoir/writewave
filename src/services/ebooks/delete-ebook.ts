// src/services/ebooks/deleteEbook.ts
import Ebook from "@/models/Ebook";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@/lib/s3";

// @TODO: Gérer les erreurs S3 en async log ou retry
// @TODO: Logger les suppressions importantes (audit log ?)
// @TODO: la response devrait contenir un ebookDeleted doc en `success: true`
export async function deleteEbook({
  ebookId,
  userId,
}: {
  ebookId: string;
  userId: string;
}) {
  const ebook = await Ebook.findById(ebookId);
  
  if (!ebook) throw new Error("EbookNotFound");

  const isAuthor = ebook.author.toString() === userId;
  if (!isAuthor) throw new Error("Forbidden");

  const defaultUrl = process.env.DEFAULT_COVER_URL;
  if (ebook.coverImage && ebook.coverImage !== defaultUrl) {
    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_EBOOK_COVERS!,
          Key: ebook.coverImageKey,
        })
      );
    } catch (err) {
      console.warn("⚠️ Failed to delete image from S3:", err);
      throw new Error("Failed to delete image from S3") 
      // Optionnel : retry async ou log externe
    }
  }

  await ebook.deleteOne();
  return { success: true, ebookDeleted: ebook };
}

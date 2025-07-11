// src/services/ebooks/updateEbook.ts
import Ebook from "@/models/Ebook";
import EbookTheme from "@/models/EbookTheme";
import slugify from "slugify";
import { Types } from "mongoose";
import s3deleteFile from "@/lib/s3deletefile";
import s3uploadfile from "@/lib/s3uploadfile";
import parseTags from "@/lib/parse-tags";
import type {Fields} from "formidable";

type UpdateEbookInput = {
  userId: string;
  ebookId: string;
  fields: Fields;
  fileBuffer?: Buffer;
  mimetype?: string;
  filesize?: number;
};

export async function updateEbook({
  userId,
  ebookId,
  fields,
  fileBuffer,
  mimetype,
  filesize,
}: UpdateEbookInput) {
  const ebook = await Ebook.findById(ebookId);

  if (!ebook) throw new Error("EbookNotFound");

  if (ebook.author.toString() !== userId) throw new Error("Unauthorized");

  // Title
  const title = fields.title?.[0];
  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      throw new Error("InvalidTitle");
    }
    ebook.title = title;
    ebook.slug = slugify(title, { lower: true, strict: true });
  }

  // Description
  if (fields.description !== undefined) {
    ebook.description = fields.description?.[0] || "";
  }

  // Tags
  if (fields.tags) {
    ebook.tags = parseTags(fields.tags[0]);
  }

  // Theme
  const themeId = fields.themeId?.[0];
  if (themeId) {
    const theme = await EbookTheme.findById(themeId);
    if (!theme) throw new Error("ThemeNotFound");
    ebook.theme = theme._id as Types.ObjectId;
  }

  // Cover image update
  if (fileBuffer && filesize && filesize > 0) {
    if (ebook.coverImageKey) {
      await s3deleteFile({
        bucketName: process.env.S3_BUCKET_EBOOK_COVERS!,
        key: ebook.coverImageKey,
      });
    }

    const upload = await s3uploadfile({
      bucketName: process.env.S3_BUCKET_EBOOK_COVERS!,
      fileBuffer,
      type: mimetype!,
      identifier: ebook.slug,
    });

    if (!upload.success) throw new Error("UploadFailed");

    ebook.coverImage = upload.url!;
    ebook.coverImageKey = upload.key!;
  }

  await ebook.save();
  return ebook;
}

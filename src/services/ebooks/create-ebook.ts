// src/services/ebooks/createEbook.ts
import Ebook from "@/models/Ebook";
import EbookTheme from "@/models/EbookTheme";
import slugify from "slugify";
import s3uploadfile from "@/lib/s3uploadfile";

export async function createEbook({
  authorId,
  title,
  description = "",
  tags = [],
  fileBuffer,
  mimetype,
  filesize,
}: {
  authorId: string;
  title: string;
  description?: string;
  tags?: string[];
  fileBuffer?: Buffer;
  mimetype?: string;
  filesize?: number;
}) {
  const slug = slugify(title, { lower: true, strict: true });

  const theme = await EbookTheme.findOne({ identifier: process.env.DEFAULT_EBOOK_THEME_IDENTIFIER });
  
  if (!theme) throw new Error("Missing default theme");

  let coverImage = process.env.DEFAULT_COVER_URL!;
  let coverImageKey = "";

  if (fileBuffer && filesize && filesize > 0) {
    const upload = await s3uploadfile({
      bucketName: process.env.S3_BUCKET_EBOOK_COVERS!,
      fileBuffer,
      type: mimetype!,
      identifier: slug,
    });

    if (!upload.success) {
      // Should fallback on default cover image ?
      throw new Error("Upload failed");
    }

    coverImage = upload.url!;
    coverImageKey = upload.key!;
  }

  const ebook = new Ebook({
    author: authorId,
    title,
    slug,
    description,
    tags,
    theme: theme._id,
    coverImage,
    coverImageKey,
    visibility: "draft",
    isForSale: false,
  });

  await ebook.save();
  return ebook;
}

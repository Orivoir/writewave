import Chapter from "@/models/Chapter";
import Ebook from "@/models/Ebook";
import { getValidChapterOrder } from "@/lib/get-valid-chapter-order";
import s3uploadfile from "@/lib/s3uploadfile";
import s3deletefile from "@/lib/s3deletefile";
import { Fields } from "formidable";

interface UpdateChapterParams {
  ebookId: string;
  chapterId: string;
  userId: string;
  fields: Fields;
  fileBuffer?: Buffer;
  mimetype?: string;
  filesize?: number;
}

export async function updateChapter({
  ebookId,
  chapterId,
  userId,
  fields,
  fileBuffer,
  mimetype,
  filesize,
}: UpdateChapterParams) {
  const ebook = await Ebook.findById(ebookId);
  if (!ebook) throw new Error("EbookNotFound");
  if (ebook.author.toString() !== userId) throw new Error("Forbidden");

  const chapter = await Chapter.findOne({ _id: chapterId, ebook: ebookId });
  if (!chapter) throw new Error("ChapterNotFound");

  if (fields.title?.[0]) chapter.title = fields.title[0];
  if (fields.slug?.[0]) chapter.slug = fields.slug[0];
  if (fields.content?.[0]) chapter.content = fields.content[0];
  if (fields.summary?.[0] !== undefined) chapter.summary = fields.summary[0];
  if (fields.draft?.[0] !== undefined) chapter.draft = fields.draft[0] === "true";
  if (fields.readingTime?.[0]) {
    const parsed = parseInt(fields.readingTime[0], 10);
    if (!isNaN(parsed)) chapter.readingTime = parsed;
  }

  if (fields.order?.[0]) {
    const parsed = parseInt(fields.order[0], 10);
    if (!isNaN(parsed)) {
      chapter.order = await getValidChapterOrder(ebookId, parsed);
    }
  }

  if (fileBuffer && filesize && filesize > 0) {
    if (chapter.featuredImageKey) {
      await s3deletefile({
        bucketName: process.env.S3_BUCKET_EBOOK_COVERS!,
        key: chapter.featuredImageKey,
      });
    }

    const uploadResult = await s3uploadfile({
      bucketName: process.env.S3_BUCKET_EBOOK_COVERS!,
      fileBuffer,
      type: mimetype!,
      identifier: chapter.slug,
    });

    if (uploadResult.success) {
      chapter.featuredImageKey = uploadResult.key!;
      chapter.featuredImageUrl = uploadResult.url!;
    }
  }

  await chapter.save();
  return chapter;
}

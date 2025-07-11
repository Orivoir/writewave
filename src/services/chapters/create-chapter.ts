import Chapter from "@/models/Chapter";
import Ebook from "@/models/Ebook";
import { getValidChapterOrder } from "@/lib/get-valid-chapter-order";
import slugify from "slugify";

interface CreateChapterParams {
  ebookId: string;
  userId: string;
  data: {
    title: string;
    content?: string;
    summary?: string;
    order?: number;
  };
}

export async function createChapter({ ebookId, userId, data }: CreateChapterParams) {
  const ebook = await Ebook.findById(ebookId);
  if (!ebook) throw new Error("EbookNotFound");

  if (ebook.author.toString() !== userId) throw new Error("Forbidden");

  const title = data.title;
  if (!title || typeof title !== "string") throw new Error("InvalidTitle");

  const slug = slugify(title, { lower: true, strict: true });
  const content = typeof data.content === "string" ? data.content : "";
  const summary = typeof data.summary === "string" ? data.summary : "";

  const order = await getValidChapterOrder(ebookId, data.order);

  const chapter = new Chapter({
    ebook: ebookId,
    title,
    slug,
    content,
    summary,
    order,
    draft: true,
  });

  await chapter.save();
  return chapter;
}

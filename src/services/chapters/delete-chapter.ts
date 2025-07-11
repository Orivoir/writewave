import Ebook from "@/models/Ebook";
import Chapter from "@/models/Chapter";

interface DeleteChapterParams {
  ebookId: string;
  chapterId: string;
  userId: string;
}

export async function deleteChapter({ ebookId, chapterId, userId }: DeleteChapterParams) {
  
  const ebook = await Ebook.findById(ebookId);
  
  if (!ebook) throw new Error("EbookNotFound");
  
  if (ebook.author.toString() !== userId) throw new Error("Forbidden");

  const chapter = await Chapter.findOne({ _id: chapterId, ebook: ebookId });
  
  if (!chapter) throw new Error("ChapterNotFound");

  await chapter.deleteOne();

  return chapter;
}

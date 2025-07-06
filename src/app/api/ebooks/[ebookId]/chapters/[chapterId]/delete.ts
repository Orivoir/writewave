// DELETE /api/ebooks/{ebookId}/chapters/{chapterId}
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Ebook from "@/models/Ebook";
import Chapter from "@/models/Chapter";

// @TODO: encapsuled try/catch + handler error
export async function DELETE(_: NextRequest, { params }: { params: { ebookId: string, chapterId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const ebook = await Ebook.findById(params.ebookId);
  if (!ebook) {
    return NextResponse.json({ error: "Ebook not found" }, { status: 404 });
  }

  if (ebook.author.toString() !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const chapter = await Chapter.findOne({ _id: params.chapterId, ebook: params.ebookId });
  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  await chapter.deleteOne();

  return NextResponse.json(
    {
      success: true,
      chapterDeleted: chapter
    },
    { status: 200 }
  );
}

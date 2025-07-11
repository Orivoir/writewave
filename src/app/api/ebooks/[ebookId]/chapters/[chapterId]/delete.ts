import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import { deleteChapter } from "@/services/chapters";

export async function DELETE(_: NextRequest, { params }: { params: { ebookId: string; chapterId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const deleted = await deleteChapter({
      ebookId: params.ebookId,
      chapterId: params.chapterId,
      userId: session.user.id,
    });

    return NextResponse.json({ success: true, chapterDeleted: deleted }, { status: 200 });

  } catch (err: any) {
    const map: Record<string, [string, number]> = {
      EbookNotFound: ["Ebook not found", 404],
      ChapterNotFound: ["Chapter not found", 404],
      Forbidden: ["Unauthorized", 403],
    };

    const [message, code] = map[err.message] ?? ["Internal Server Error", 500];
    return NextResponse.json({ error: message }, { status: code });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import { updateChapter } from "@/services/chapters";
import { parseForm } from "@/lib/file-utils";
import toNativeRequest from "@/lib/to-native-request";

export async function PUT(req: NextRequest, { params }: { params: { ebookId: string; chapterId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const { ebookId, chapterId } = params;

  try {
    const {
      fields,
      fileBuffer,
      mimetype,
      filesize
    } = await parseForm(toNativeRequest(req), "featuredImage");

    const chapter = await updateChapter({
      ebookId,
      chapterId,
      userId: session.user.id,
      fields,
      fileBuffer,
      mimetype,
      filesize,
    });

    return NextResponse.json(chapter, { status: 200 });
  } catch (err: any) {

    const map: Record<string, [string, number]> = {
      EbookNotFound: ["Ebook not found", 404],
      ChapterNotFound: ["Chapter not found", 404],
      Forbidden: ["Unauthorized", 403],
    };

    const [message, status] = map[err.message] ?? ["Internal Server Error", 500];
    return NextResponse.json({ error: message }, { status });
  }
}

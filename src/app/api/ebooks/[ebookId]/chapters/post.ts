import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import { createChapter } from "@/services/chapters";

export async function POST(req: NextRequest, { params }: { params: { ebookId: string } }) {

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const { ebookId } = params;
  if (!ebookId) {
    return NextResponse.json({ error: "Missing ebookId" }, { status: 400 });
  }

  const body = await req.json();

  try {
    const chapter = await createChapter({ userId: session.user.id, ebookId, data: body });
    
    return NextResponse.json({chapterCreated: chapter}, { status: 201 });

  } catch (err: any) {
    const messageMap: Record<string, [string, number]> = {
      EbookNotFound: ["Ebook not found", 404],
      Forbidden: ["Forbidden", 403],
      InvalidTitle: ["Title is required", 400],
    };

    const [msg, code] = messageMap[err.message] ?? ["Internal Server Error", 500];
    return NextResponse.json({ error: msg }, { status: code });
  }
}

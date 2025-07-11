import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createNote } from "@/services/notes";

export async function POST(req: NextRequest, { params }: { params: { ebookId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const {ebookId} = await params

    const note = await createNote({
      ebookId: ebookId,
      userId: session.user.id,
      title: body.title,
      content: body.content,
      chapterId: body.chapterId,
      type: body.type,
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error: any) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

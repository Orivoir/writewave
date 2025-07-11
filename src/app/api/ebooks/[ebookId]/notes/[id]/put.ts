import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateNote } from "@/services/notes";

export async function PUT(req: NextRequest, { params }: { params: { ebookId: string, id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();

  try {
    const note = await updateNote({
      userId: session.user.id,
      ebookId: params.ebookId,
      noteId: params.id,
      data,
    });

    return NextResponse.json(note);
  } catch (err) {
    if (err instanceof Error && err.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (err instanceof Error && err.message === "NotFound") {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    console.error("PUT /notes error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

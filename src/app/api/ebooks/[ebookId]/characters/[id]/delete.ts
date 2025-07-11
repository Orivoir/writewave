// app/api/ebooks/[ebookId]/characters/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { deleteCharacter } from "@/services/characters";

export async function DELETE(_: NextRequest, { params }: { params: { ebookId: string; id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const deleted = await deleteCharacter({
      ebookId: params.ebookId,
      characterId: params.id,
      userId: session.user.id,
    });
    return NextResponse.json({ success: true, characterDeleted: deleted });
  } catch (error: any) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status });
  }
}

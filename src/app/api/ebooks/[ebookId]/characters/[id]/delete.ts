import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Character from "@/models/Character";

// DELETE /api/ebooks/[ebookId]/characters/[id]
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const character = await Character.findById(params.id);
  if (!character) return NextResponse.json({ error: "Character not found" }, { status: 404 });

  await character.deleteOne();
  return NextResponse.json({ success: true });
}

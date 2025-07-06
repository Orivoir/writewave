import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Character from "@/models/Character";

// PUT /api/ebooks/[ebookId]/characters/[id]

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const body = await req.json();

  const character = await Character.findById(params.id);
  if (!character) return NextResponse.json({ error: "Character not found" }, { status: 404 });

  if (body.name) character.name = body.name;
  if (body.gender) character.gender = body.gender;
  if (body.description !== undefined) character.description = body.description;
  if (Array.isArray(body.relations)) character.relations = body.relations;

  await character.save();
  return NextResponse.json(character);
}

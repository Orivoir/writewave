import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Character from "@/models/Character";

// POST /api/ebooks/characters
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const body = await req.json();

  if (!body.name || !body.gender) {
    return NextResponse.json({ error: "Name and gender are required" }, { status: 400 });
  }

  const character = new Character({
    ebook: body.ebook,
    name: body.name,
    gender: body.gender,
    description: body.description || "",
    relations: Array.isArray(body.relations) ? body.relations : [],
  });

  await character.save();
  return NextResponse.json(character, { status: 201 });
}

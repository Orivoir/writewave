import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import { createCharacter } from "@/services/characters";

export async function POST(req: NextRequest, { params }: { params: { ebookId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  try {
    const body = await req.json();

    if (!body.name || !body.gender) {
      return NextResponse.json({ error: "Name and gender are required" }, { status: 400 });
    }

    const character = await createCharacter({
      ebookId: params.ebookId,
      userId: session.user.id,
      name: body.name,
      gender: body.gender,
      description: body.description,
      relations: body.relations,
    });

    return NextResponse.json({characterCreated: character}, { status: 201 });

  } catch (err: any) {
    const map: Record<string, [string, number]> = {
      EbookNotFound: ["Ebook not found", 404],
      Forbidden: ["Unauthorized", 403],
    };

    const [message, code] = map[err.message] ?? ["Internal Server Error", 500];
    return NextResponse.json({ error: message }, { status: code });
  }
}

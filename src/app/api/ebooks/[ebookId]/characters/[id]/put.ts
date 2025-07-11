import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import { updateCharacter } from "@/services/characters";

export async function PUT(req: NextRequest, { params }: { params: { id: string; ebookId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  try {
    const body = await req.json();

    const updated = await updateCharacter({
      ebookId: params.ebookId,
      characterId: params.id,
      userId: session.user.id,
      name: body.name,
      gender: body.gender,
      description: body.description,
      relations: body.relations,
    });

    return NextResponse.json(updated, { status: 200 });

  } catch (err: any) {
    const map: Record<string, [string, number]> = {
      EbookNotFound: ["Ebook not found", 404],
      CharacterNotFound: ["Character not found", 404],
      Forbidden: ["Unauthorized", 403],
    };

    const [message, code] = map[err.message] ?? ["Internal Server Error", 500];
    return NextResponse.json({ error: message }, { status: code });
  }
}

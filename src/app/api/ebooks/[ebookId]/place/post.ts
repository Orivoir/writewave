import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Place from "@/models/Place";

// @TODO: check request body data
export async function POST(req: NextRequest, { params }: { params: { ebookId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const { ebookId } = params;
  const body = await req.json();

  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "Field 'name' is required and must be a string" }, { status: 400 });
  }

  // Optionnel: vérifier que session.user.id est bien auteur ebook (sécurité)

  const place = new Place({
    ebook: ebookId,
    name: body.name,
    type: body.type,
    description: body.description,
    parentPlace: body.parentPlace,
    climate: body.climate,
    importance: body.importance,
    notes: body.notes,
  });

  await place.save();

  return NextResponse.json(place, { status: 201 });
}

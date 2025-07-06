import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Place from "@/models/Place";

export async function PUT(
  req: NextRequest,
  { params }: { params: { ebookId: string; placeId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const { ebookId, placeId } = params;

  const place = await Place.findById(placeId);
  if (!place) return NextResponse.json({ error: "Place not found" }, { status: 404 });

  if (place.ebook.toString() !== ebookId)
    return NextResponse.json({ error: "Place does not belong to ebook" }, { status: 400 });

  // @TODO: vérifier que session.user.id est bien auteur ebook (sécurité)

  const body = await req.json();

  if (body.name !== undefined) place.name = body.name;
  if (body.type !== undefined) place.type = body.type;
  if (body.description !== undefined) place.description = body.description;
  if (body.parentPlace !== undefined) place.parentPlace = body.parentPlace;
  if (body.climate !== undefined) place.climate = body.climate;
  if (body.importance !== undefined) place.importance = body.importance;
  if (body.notes !== undefined) place.notes = body.notes;

  await place.save();

  return NextResponse.json(place);
}

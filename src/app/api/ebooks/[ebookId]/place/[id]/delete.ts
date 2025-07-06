import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Place from "@/models/Place";

export async function DELETE(
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

  // Optionnel: vérifier que session.user.id est bien auteur ebook (sécurité)

  await place.deleteOne();

  return NextResponse.json({ message: "Place deleted" });
}

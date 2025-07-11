import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { deletePlace } from "@/services/places";

export async function DELETE(req: NextRequest, { params }: { params: { ebookId: string; placeId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {

    const {ebookId, placeId} = await params

    const placeDeleted = await deletePlace({
      ebookId,
      placeId,
      userId: session.user.id
    });
    
    return NextResponse.json({placeDeleted});

  } catch (error: any) {
    if (error.message === "Ebook not found" || error.message === "Place not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error.message === "Place does not belong to ebook") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

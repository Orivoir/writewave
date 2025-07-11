import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updatePlace } from "@/services/places";

export async function PUT(
  req: NextRequest,
  { params }: { params: { ebookId: string; placeId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();

    const place = await updatePlace({
      ebookId: params.ebookId,
      placeId: params.placeId,
      userId: session.user.id,
      data,
    });

    return NextResponse.json(place);
  } catch (error: any) {
    switch (error.message) {
      case "Ebook not found":
      case "Place not found":
        return NextResponse.json({ error: error.message }, { status: 404 });
      case "Forbidden":
        return NextResponse.json({ error: error.message }, { status: 403 });
      case "Place does not belong to ebook":
        return NextResponse.json({ error: error.message }, { status: 400 });
      default:
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
}

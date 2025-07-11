// app/api/ebooks/[ebookId]/places/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createPlace } from "@/services/places";

export async function POST(req: NextRequest, { params }: { params: { ebookId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  try {
    const place = await createPlace({
      userId: session.user.id,
      ebookId: params.ebookId,
      data: body,
    });

    return NextResponse.json(place, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof Error && error.message === "InvalidName") {
      return NextResponse.json({ error: "Field 'name' is required and must be a string" }, { status: 400 });
    }

    console.error("Error creating place:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

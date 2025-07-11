import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import { parseForm } from "@/lib/file-utils";
import toNativeRequest from "@/lib/to-native-request";
import { updateEbook } from "@/services/ebooks";

export async function PUT(req: NextRequest, { params }: { params: { ebookId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const {ebookId} = await params;

    const {
      fields,
      fileBuffer,
      mimetype,
      filesize
    } = await parseForm(toNativeRequest(req), "coverImage"); // Should be catch at middleware !?
    
    const ebookUpdated = await updateEbook({
      userId: session.user.id,
      ebookId,
      fields,
      fileBuffer,
      mimetype,
      filesize
    })

    return NextResponse.json(ebookUpdated, { status: 200 });

  } catch (error) {
    console.error("PUT /api/ebooks error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

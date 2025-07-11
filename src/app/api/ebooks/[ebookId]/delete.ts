import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import { deleteEbook } from "@/services/ebooks";

export async function DELETE(_: NextRequest, { params }: { params: { ebookId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { ebookId } = params;
    
    if (!ebookId) {
      return NextResponse.json({ error: "Missing ebook ID" }, { status: 400 });
    }

    const {success, ebookDeleted} = await deleteEbook({
      ebookId,
      userId: session.user.id,
    });

    if(success) {
      return NextResponse.json({ebookDeleted});
    } else {
      console.warn("Cant delete ebook with a result.success: false")
      return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }

  } catch (error: any) {
    console.error("Error deleting ebook:", error);

    const messageMap: Record<string, [string, number]> = {
      EbookNotFound: ["Ebook not found", 404],
      Forbidden: ["Forbidden", 403],
    };

    const [msg, code] = messageMap[error.message] ?? ["Internal Server Error", 500];
    return NextResponse.json({ error: msg }, { status: code });
  }
}

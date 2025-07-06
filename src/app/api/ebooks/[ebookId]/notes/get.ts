import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Note from "@/models/Note";
import { paginate } from "@/lib/paginate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Ebook from "@/models/Ebook";

export async function GET(req: NextRequest, { params }: { params: { ebookId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const {ebookId} = await params;

  const ebook = await Ebook.findById(ebookId);

  if (!ebook || ebook.author.toString() !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "10", 10);
  
  const result = await paginate(Note, { ebook: params.ebookId }, page, pageSize);

  return NextResponse.json(result);
}

// GET /api/ebooks/{ebookId}/chapters
// app/api/ebooks/[ebookId]/chapters/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Chapter from "@/models/Chapter";
import { Types } from "mongoose";
import { paginate } from "@/lib/paginate";


export async function GET(req: NextRequest, { params }: { params: { ebookId: string } }) {
  try {
    await dbConnect();

    const { ebookId } = await params;
    
    if (!Types.ObjectId.isValid(ebookId)) {
      return NextResponse.json({ error: "Invalid ebook ID" }, { status: 400 });
    }

    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "10", 10);
    
    const result = await paginate(Chapter, { ebook: params.ebookId }, page, pageSize, {content: 0, updateAt: 0, createdAt: 0});

    return NextResponse.json(result);

  } catch (err) {
    console.error("GET /api/ebooks/[ebookId]/chapters error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

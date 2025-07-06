import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Chapter from "@/models/Chapter";
import { Types } from "mongoose";

export async function GET(req: NextRequest, { params }: { params: { chapterId: string } }) {
  try {
    await dbConnect();

    const { chapterId } = await params;

    if (!Types.ObjectId.isValid(chapterId)) {
      return NextResponse.json({ error: "Invalid chapter ID" }, { status: 400 });
    }

    const chapter = await Chapter.findById(chapterId, { __v: 0 });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    return NextResponse.json(chapter);
  } catch (err) {
    console.error("GET /api/chapters/[chapterId] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Ebook from "@/models/Ebook";
import Chapter from "@/models/Chapter";
import { getValidChapterOrder } from "@/lib/get-valid-chapter-order";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const ebookId = searchParams.get("ebookId");

  if (!ebookId) {
    return NextResponse.json({ error: "Missing ebookId" }, { status: 400 });
  }

  const ebook = await Ebook.findById(ebookId);
  if (!ebook) {
    return NextResponse.json({ error: "Ebook not found" }, { status: 404 });
  }

  if (ebook.author.toString() !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const title = body.title;
  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const slug = slugify(title, { lower: true, strict: true });
  const content = typeof body.content === "string" ? body.content : "";
  const summary = typeof body.summary === "string" ? body.summary : "";

  const order = await getValidChapterOrder(ebookId, body.order);

  const chapter = new Chapter({
    ebook: ebookId,
    title,
    slug,
    content,
    summary,
    order,
    draft: true,
  });

  await chapter.save();

  return NextResponse.json(chapter, { status: 201 });
}

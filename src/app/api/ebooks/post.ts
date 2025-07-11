import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import { parseForm } from "@/lib/file-utils";
import parseTags from "@/lib/parse-tags";
import toNativeRequest from "@/lib/to-native-request";
import { createEbook } from "@/services/ebooks";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const {
      fields,
      fileBuffer,
      mimetype,
      filesize
    } = await parseForm(toNativeRequest(req), "coverImage"); // Should be catch at middleware ?

    const title = fields.title?.[0];
    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const description = fields.description?.[0] || "";
    const tags = parseTags(fields.tags?.[0])

    const ebookCreated = await createEbook({
      authorId: session.user.id,
      title,
      description,
      tags,
      fileBuffer,
      mimetype,
      filesize
    })

    return NextResponse.json(ebookCreated, { status: 201 });

  } catch (err) {
    console.error("POST /api/ebooks error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

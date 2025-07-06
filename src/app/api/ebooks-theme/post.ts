import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Theme from "@/models/EbookTheme";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const body = await req.json();
  const { name } = body;
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const identifier = slugify(name, { lower: true, strict: true });

  const exists = await Theme.findOne({
    $or: [
      { name, author: session.user.id },
      { identifier, author: session.user.id }
    ]
  });

  if (exists) {
    return NextResponse.json({ error: "Theme with same name or identifier already exists" }, { status: 400 });
  }

  const theme = await Theme.create({
    author: session.user.id,
    name,
    identifier,
    isPublic: false
  });

  return NextResponse.json({themeCreated: theme}, { status: 201 });
}

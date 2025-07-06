import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Character from "@/models/Character";
import { paginate } from "@/lib/paginate";

// GET /api/ebooks/[ebookId]/characters
export async function GET(req: NextRequest, { params }: { params: { ebookId: string } }) {

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {ebookId} = await params

  await dbConnect();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  const result = await paginate(Character, {ebook: ebookId}, page, pageSize);
  return NextResponse.json(result);
}

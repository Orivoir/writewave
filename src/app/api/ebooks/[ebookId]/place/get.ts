import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Place from "@/models/Place";
import { paginate } from "@/lib/paginate";

export async function GET(req: NextRequest, { params }: { params: { ebookId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const { ebookId } = params;

  // Pagination params from query string
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

  const result = await paginate(Place, { ebook: ebookId }, page, pageSize);

  return NextResponse.json(result);
}

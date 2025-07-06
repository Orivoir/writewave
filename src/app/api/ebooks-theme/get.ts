import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Theme from "@/models/EbookTheme";
import { paginate } from "@/lib/paginate";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const custom = searchParams.has("custom");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  const filter = custom
    ? { author: session.user.id }
    : { isPublic: true, author: { $ne: session.user.id } };

  const result = await paginate(Theme, filter, page, pageSize);

  return NextResponse.json(result);
}

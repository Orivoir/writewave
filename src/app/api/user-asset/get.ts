import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import UserAsset, { IUserAsset } from "@/models/UserAsset";
import { paginate } from "@/lib/paginate";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await dbConnect();

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

  // filtre par user
  const filter = { user: session.user.id };

  const result = await paginate<IUserAsset>(UserAsset, filter, page, pageSize);

  return NextResponse.json(result);
}

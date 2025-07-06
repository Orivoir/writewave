import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Ebook from "@/models/Ebook";
import { paginate } from "@/lib/paginate";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const result = await paginate(Ebook, { author: session.user.id }, page, limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching ebooks:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

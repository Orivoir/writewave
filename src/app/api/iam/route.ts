// app/api/iam/route.ts

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // ta config next-auth
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import nativeMongoDAO from "@/lib/mongo-client"
import {ObjectId} from "mongodb"

export async function GET(request: NextRequest) {

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const withAccounts = url.searchParams.has("withAccounts");

  await dbConnect()

  const user = await User.findById(session.user.id).select("-__v -createdAt -updatedAt").lean();
  let accounts = null;

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if(withAccounts) {
    const connection = await nativeMongoDAO

    const db = connection.db()

    accounts = await db.collection("accounts").find({
      userId: new ObjectId(session.user.id)
    })
    .project({
      __v: 0,
      createAt: 0,
      updateAt: 0,
      id_token: 0,
      
    })
    .toArray()
  }

  return NextResponse.json({ user, accounts });
}

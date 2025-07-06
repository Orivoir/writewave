import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import UserAsset from "@/models/UserAsset";
import { parseForm } from "@/lib/file-utils";
import s3uploadfile from "@/lib/s3uploadfile";
import { randomUUID } from "crypto";
import toNativeRequest from "@/lib/to-native-request";

export async function POST(req: NextRequest) {

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const { fileBuffer, filename, mimetype, filesize } = await parseForm(toNativeRequest(req), "file");

  const bucketName = process.env.S3_BUCKET_LIBRARY_USER!;
  const identifier = randomUUID();

  // upload sur S3
  const s3Result = await s3uploadfile({
    fileBuffer,
    bucketName,
    type: mimetype,
    identifier,
  });

  if (!s3Result) return NextResponse.json({ error: "Upload failed" }, { status: 500 });

  // Construire url publique depuis env S3_PUBLIC_URL + bucket + clé
  const url = s3Result.url || `${process.env.S3_PUBLIC_URL}/${bucketName}/${s3Result.key}`;

  // créer doc userAsset
  const newAsset = await UserAsset.create({
    user: session.user.id,
    filename,
    key: s3Result.key,
    url,
    size: filesize,
    mimeType: mimetype,
  });

  return NextResponse.json(newAsset);
}

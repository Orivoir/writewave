import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import UserAsset from "@/models/UserAsset";
import s3deletefile from "@/lib/s3deletefile";

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  // id ici est la clé S3
  const key = params.id;

  // retrouver l'asset
  const asset = await UserAsset.findOne({ key });

  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  // Vérifier appartenance
  if (asset.user.toString() !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const bucketName = process.env.S3_BUCKET_LIBRARY_USER!;

  // Supprimer le fichier S3
  const deleted = await s3deletefile({ bucketName, key });

  if (!deleted) {
    return NextResponse.json({ error: "Failed to delete file from S3" }, { status: 500 });
  }

  // Supprimer le doc Mongo
  await asset.deleteOne();

  return NextResponse.json({ message: "Asset deleted successfully" });
}

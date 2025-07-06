import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Ebook from "@/models/Ebook";
import s3 from "@/lib/s3"
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

// @TODO: Gérer les erreurs S3 en async log ou retry
// @TODO: Logger les suppressions importantes (audit log ?)
// @TODO: la response devrait contenir un ebookDeleted doc en `success: true`
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const ebookId = searchParams.get("id");

    if (!ebookId) {
      return NextResponse.json({ error: "Missing ebook ID" }, { status: 400 });
    }

    const ebook = await Ebook.findById(ebookId);

    if (!ebook) {
      return NextResponse.json({ error: "Ebook not found" }, { status: 404 });
    }

    // Vérifie si c’est bien l’auteur (ou un admin)
    const isAuthor = ebook.author.toString() === session.user.id;
    if (!isAuthor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Supprimer l’image si ce n’est pas celle par défaut
    const defaultUrl = process.env.DEFAULT_COVER_URL;
    if (ebook.coverImage && ebook.coverImage !== defaultUrl) {
      try {
        const bucket = process.env.S3_BUCKET_EBOOK_COVERS!;
        const key = ebook.coverImageKey
        await s3.send(new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        }));
      } catch (err) {
        console.warn("⚠️ Failed to delete image from S3:", err);
        // @TODO: gérer retry ou log externe ?
      }
    }

    await ebook.deleteOne();

    // @TODO send deleted ebook ? 
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error deleting ebook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
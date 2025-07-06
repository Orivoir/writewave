import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Ebook from "@/models/Ebook";
import EbookTheme from "@/models/EbookTheme";
import slugify from "slugify";
import { parseForm } from "@/lib/file-utils";
import parseTags from "@/lib/parse-tags";
import toNativeRequest from "@/lib/to-native-request";
import s3deleteFile from "@/lib/s3deletefile";
import s3uploadfile from "@/lib/s3uploadfile";
import { Types } from "mongoose";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const ebookId = searchParams.get("id");
    if (!ebookId) {
      return NextResponse.json({ error: "Missing ebook ID" }, { status: 400 });
    }

    const existingEbook = await Ebook.findById(ebookId);
    if (!existingEbook) {
      return NextResponse.json({ error: "Ebook not found" }, { status: 404 });
    }

    if (existingEbook.author.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { fields, fileBuffer, mimetype, filesize } = await parseForm(toNativeRequest(req), "coverImage");

    // MAJ title + slug si title présent
    const title = fields.title?.[0];
    if (title !== undefined) {
      if (typeof title !== "string" || title.trim() === "") {
        return NextResponse.json({ error: "Title must be a non-empty string" }, { status: 400 });
      }
      existingEbook.title = title;
      existingEbook.slug = slugify(title, { lower: true, strict: true });
    }

    // MAJ description si présent
    const description = fields.description?.[0];
    if (description !== undefined) {
      existingEbook.description = description;
    }

    // MAJ tags si présent
    if (fields.tags) {
      existingEbook.tags = parseTags(fields.tags[0]);
    }

    // MAJ theme si themeId présent
    const themeId = fields.themeId?.[0];
    if (themeId) {
      const theme = await EbookTheme.findById(themeId);
      if (!theme) {
        return NextResponse.json({ error: "Theme not found" }, { status: 400 });
      }

      existingEbook.theme = theme._id as Types.ObjectId
    }

    // MAJ cover image si nouveau fichier uploadé
    if (fileBuffer && filesize > 0) {
      if (existingEbook.coverImageKey) {
        await s3deleteFile({
          bucketName: process.env.S3_BUCKET_EBOOK_COVERS!,
          key: existingEbook.coverImageKey,
        });
      }

      const uploadResult = await s3uploadfile({
        bucketName: process.env.S3_BUCKET_EBOOK_COVERS!,
        fileBuffer,
        type: mimetype,
        identifier: existingEbook.slug, // garder slug actuel pour nommage
      });

      if (!uploadResult.success) {
        return NextResponse.json({ error: "Failed to upload new cover image" }, { status: 500 });
      }

      existingEbook.coverImage = uploadResult.url || existingEbook.coverImage;
      existingEbook.coverImageKey = uploadResult.key || existingEbook.coverImageKey;
    }

    await existingEbook.save();

    return NextResponse.json(existingEbook, { status: 200 });
  } catch (error) {
    console.error("PUT /api/ebooks error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

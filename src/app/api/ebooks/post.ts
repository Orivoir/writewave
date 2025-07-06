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
import s3uploadfile from "@/lib/s3uploadfile";


export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const {
      fields,
      fileBuffer,
      mimetype,
      filesize
    } = await parseForm(toNativeRequest(req), "coverImage");

    const title = fields.title?.[0];
    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const description = fields.description?.[0] || "";
    const tags = parseTags(fields.tags?.[0])

    const slug = slugify(title, { lower: true, strict: true });
    const defaultTheme = await EbookTheme.findOne({ identifier: process.env.DEFAULT_EBOOK_THEME_IDENTIFIER });

    if (!defaultTheme) {
      return NextResponse.json({ error: "No default theme" }, { status: 500 });
    }

    let coverImageUrl = process.env.DEFAULT_COVER_URL!;
    let coverImageKey = "";

    if (fileBuffer && filesize > 0) {

      const uploadResult = await s3uploadfile({
        bucketName: process.env.S3_BUCKET_EBOOK_COVERS!,
        fileBuffer,
        type: mimetype,
        identifier: slug
      })

      if (!uploadResult.success) {
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
      }

      coverImageUrl = uploadResult.url || "";
      coverImageKey = uploadResult.key || "";
    }

    const ebook = new Ebook({
      author: session.user.id,
      title,
      slug,
      description,
      coverImage: coverImageUrl,
      coverImageKey,
      theme: defaultTheme._id,
      tags,
      visibility: "draft",
      isForSale: false,
    });

    await ebook.save();
    return NextResponse.json(ebook, { status: 201 });

  } catch (err) {
    console.error("POST /api/ebooks error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

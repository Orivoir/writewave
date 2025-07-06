import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Ebook from "@/models/Ebook";
import Chapter from "@/models/Chapter";
import s3uploadfile from "@/lib/s3uploadfile";
import s3deletefile from "@/lib/s3deletefile";
import { parseForm } from "@/lib/file-utils";
import { getValidChapterOrder } from "@/lib/get-valid-chapter-order";
import toNativeRequest from "@/lib/to-native-request";

export async function PUT(req: NextRequest, { params }: { params: { ebookId: string, chapterId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const ebook = await Ebook.findById(params.ebookId);
  if (!ebook || ebook.author.toString() !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const chapter = await Chapter.findOne({ _id: params.chapterId, ebook: params.ebookId });
  if (!chapter) return NextResponse.json({ error: "Chapter not found" }, { status: 404 });

  const { fields, fileBuffer, mimetype, filesize } = await parseForm(toNativeRequest(req), "featuredImage");

  if (fields.title?.[0]) chapter.title = fields.title[0];
  if (fields.slug?.[0]) chapter.slug = fields.slug[0];
  if (fields.content?.[0]) chapter.content = fields.content[0];
  if (fields.summary?.[0] !== undefined) chapter.summary = fields.summary[0];
  if (fields.draft?.[0] !== undefined) chapter.draft = fields.draft[0] === 'true';
  if (fields.readingTime?.[0]) chapter.readingTime = parseInt(fields.readingTime[0], 10);

  if (fields.order?.[0]) {
    const order = parseInt(fields.order[0], 10);
    chapter.order = await getValidChapterOrder(params.ebookId, order);
  }

  if (fileBuffer && filesize > 0) {
    if (chapter.featuredImageKey) {
      await s3deletefile({ bucketName: process.env.S3_BUCKET_EBOOK_COVERS!, key: chapter.featuredImageKey });
    }
    const uploadResult = await s3uploadfile({
      bucketName: process.env.S3_BUCKET_EBOOK_COVERS!,
      fileBuffer,
      type: mimetype,
      identifier: chapter.slug
    });
    if (uploadResult.success) {
      chapter.featuredImageKey = uploadResult.key;
      chapter.featuredImageUrl = uploadResult.url;
    }
  }

  await chapter.save();

  return NextResponse.json(chapter, { status: 200 });
}

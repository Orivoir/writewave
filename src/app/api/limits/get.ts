import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Ebook from "@/models/Ebook";
import Character from "@/models/Character";
import Place from "@/models/Place";
import Epub from "@/models/Epub";
import Theme from "@/models/EbookTheme";
import Note from "@/models/Note";
import UserAsset from "@/models/UserAsset";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    await dbConnect();

    const limits = {
      free: {
        ebooks: 3,
        characters: 30,
        places: 20,
        epubs: 5,
        themes: 2,
        notes: 50,
        chapters: 10,
        assets: 5,
      },
      premium: {
        ebooks: Infinity,
        characters: Infinity,
        places: Infinity,
        epubs: Infinity,
        themes: 20,
        notes: Infinity,
        chapters: 100,
        assets: 100
      },
    };

    if (!session || !session.user?.id) {
      return NextResponse.json({ limits });
    }

    const ebookIds = await Ebook.find({ author: session.user.id }).distinct("_id");

    const [ebookCount, characterCount, placeCount, epubCount, themeCount, noteCount, assetsCount] = await Promise.all([
      Ebook.estimatedDocumentCount({ author: session.user.id }),
      Character.estimatedDocumentCount({ ebook: { $in: ebookIds } }),
      Place.estimatedDocumentCount({ ebook: { $in: ebookIds } }),
      Epub.estimatedDocumentCount({ ebook: { $in: ebookIds } }),
      Theme.estimatedDocumentCount({ author: session.user.id }),
      Note.estimatedDocumentCount({ ebook: { $in: ebookIds } }),
      UserAsset.estimatedDocumentCount({ user: session.user.id })
    ]);

    return NextResponse.json({
      current: {
        ebooks: ebookCount,
        characters: characterCount,
        places: placeCount,
        epubs: epubCount,
        themes: themeCount,
        notes: noteCount,
        assets: assetsCount
      },
      limits,
    });
  } catch (err) {
    console.error("[GET /api/limits]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

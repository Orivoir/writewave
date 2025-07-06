import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Theme from "@/models/EbookTheme";
import Ebook from "@/models/Ebook";

/**
 * Supprime un thème d'ebook s'il n'est pas utilisé par d'autres utilisateurs.
 * Si le thème est public et utilisé, il est converti en thème plateforme (`author: null`).
 */
export async function DELETE(req: NextRequest, { params }: { params: { identifier: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const theme = await Theme.findOne({ identifier: params.identifier });
  if (!theme) return NextResponse.json({ error: "Theme not found" }, { status: 404 });

  if (theme.author?.toString() !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (theme.isPublic) {
    const ebookUsing = await Ebook.findOne({ theme: theme._id, author: { $ne: session.user.id } });
    if (ebookUsing) {
      theme.author = undefined;
      await theme.save();
      return NextResponse.json({ success: true, convertedToPlatformTheme: true });
    }
  }

  await theme.deleteOne();
  return NextResponse.json({ success: true });
}

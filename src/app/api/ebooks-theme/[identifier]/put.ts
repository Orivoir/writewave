// PUT /ebooks-theme/[identifier]
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Theme, { EbookUpdate } from "@/models/EbookTheme";


export async function PUT(req: NextRequest, { params }: { params: { identifier: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const theme = await Theme.findOne({ identifier: params.identifier });
  
  if (!theme) {
    return NextResponse.json({ error: "Theme not found" }, { status: 404 });
  }
  
  if (theme?.author?.toString() !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json() as Partial<EbookUpdate>;

  for (const key of Object.keys(body) as (keyof EbookUpdate)[]) {
    // @ts-ignore
    theme[key] = body[key]!;
  }
  
  

  await theme.save();
  return NextResponse.json(theme);
}

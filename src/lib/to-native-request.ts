import { IncomingMessage } from "http";
import { NextRequest } from "next/server";

// Hack: cast NextRequest to IncomingMessage for formidable
export default function toNativeRequest(req: NextRequest): IncomingMessage {
  const body = req.body as any;
  const headers: any = {};
  req.headers.forEach((value, key) => (headers[key.toLowerCase()] = value));

  return Object.assign(body, {
    headers,
    method: req.method,
    url: req.url,
  }) as unknown as IncomingMessage;
}
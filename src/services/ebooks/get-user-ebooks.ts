// src/services/ebooks/getUserEbooks.ts
import Ebook from "@/models/Ebook";
import { paginate } from "@/lib/paginate";

export async function getUserEbooks(userId: string, options: { page?: number; limit?: number } = {}) {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;

  return paginate(Ebook, { author: userId }, page, limit);
}

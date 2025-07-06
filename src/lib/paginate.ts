import type { Model, Document, FilterQuery } from "mongoose";

export interface PaginationResult<T> {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Paginate a mongoose model query
 * @param model mongoose model
 * @param filter mongoose filter query
 * @param page current page number (1-based)
 * @param pageSize number of docs per page
 */
export async function paginate<T extends Document>(
  model: Model<T>,
  filter: FilterQuery<T>,
  page: number = 1,
  pageSize: number = 10,
  projection: Record<string, 0 | 1> = {}
): Promise<PaginationResult<T>> {
  if (page < 1) page = 1;
  if (pageSize < 1) pageSize = 10;

  const skip = (page - 1) * pageSize;

  const [totalDocs, docs] = await Promise.all([
    model.countDocuments(filter),
    model
      .find(filter, {__v: 0, ...projection})
      .skip(skip)
      .limit(pageSize)
      .sort({ updatedAt: -1 }),
  ]);

  const totalPages = Math.ceil(totalDocs / pageSize);

  return {
    docs,
    totalDocs,
    totalPages,
    currentPage: page,
    pageSize,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

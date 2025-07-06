import { IEbook } from "@/models/Ebook";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface EbookResponse {
  docs: IEbook[];
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

interface CreateEbookInput {
  title: string;
  slug: string;
  description?: string;
  theme: string;
  tags?: string[];
  visibility: string;
  isForSale: boolean;
  coverImage?: string;
  coverImageKey?: string;
}

interface UpdateEbookInput {
  id: string;
  data: Partial<CreateEbookInput>;
}

export function useEbooks(page: number = 1, limit: number = 10) {
  const queryClient = useQueryClient();

  const getEbooks = useQuery<EbookResponse, Error>({
  queryKey: ["ebooks", page, limit],
  queryFn: async () => {
    const res = await fetch(`/api/ebooks?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch ebooks");
    return res.json();
  },
  staleTime: 1000 * 60 * 5,
  // keepPreviousData: true, // ✅ fonctionne maintenant
});

  const createEbook = useMutation({
    mutationFn: async (newEbook: CreateEbookInput) => {
      const res = await fetch("/api/ebooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEbook),
      });
      if (!res.ok) throw new Error("Failed to create ebook");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ebooks"] }),
  });

  const updateEbook = useMutation({
    mutationFn: async ({ id, data }: UpdateEbookInput) => {
      const res = await fetch(`/api/ebooks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update ebook");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ebooks"] }),
  });

  const deleteEbook = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/ebooks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete ebook");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ebooks"] }),
  });

  return { getEbooks, createEbook, updateEbook, deleteEbook };
}

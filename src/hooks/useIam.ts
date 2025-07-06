import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export interface IamResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    image: string;
    emailVerified: null | boolean;
    role: "free" | "premium" | "admin";
  };
  accounts?: Array<Record<string, any>>;
}

export function useIam(withAccounts = false) {
  const { data: session, status } = useSession();

  const expires = status === "authenticated" && session?.expires
    ? new Date(session.expires).getTime() - Date.now(): 0;

  return {
    query: useQuery<IamResponse, Error>({
      queryKey: ["iam", { withAccounts }],
      queryFn: async () => {
        const res = await fetch(`/api/iam${withAccounts ? "?withAccounts" : ""}`);
        if (!res.ok) throw new Error("Failed to fetch user info");
        return res.json();
      },
      enabled: status === "authenticated",
      staleTime: expires > 0 ? expires : 0,
    }),
    get isLoading() {
      return this.query.isLoading || status === "loading" 
    }
  }
}

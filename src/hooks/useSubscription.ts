import { useQuery } from "@tanstack/react-query";

export interface SubscriptionPlan {
  amount: number;
  currency: string;
  interval: string;
  nickname: string | null;
}

export interface SubscriptionResponse {
  id: string;
  status: string;
  cancelAtPeriodEnd: boolean;
  plan: SubscriptionPlan;
  isInTrial: boolean;
  trialEnd: string | null;
}

export function useSubscription(customerId?: string) {
  return useQuery<SubscriptionResponse, Error>({
    queryKey: ["subscription", customerId],
    queryFn: async () => {
      if (!customerId) throw new Error("Missing customerId");
      const res = await fetch(`/api/subscription/${customerId}`);
      if (!res.ok) throw new Error("Failed to fetch subscription");
      return res.json();
    },
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000,
    select: (data) => ({
      ...data,
      isPremium: data.status === "active" || data.status === "trialing",
    }),
  });
}

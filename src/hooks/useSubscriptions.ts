import { useQuery } from "@tanstack/react-query";
import { SubscriptionStatus } from "@/models/User";

export type SubscriptionInfo = {
  id: string;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan: {
    amount: number;
    currency: string;
    interval: string;
    nickname: string | null;
  };
  isInTrial: boolean;
  trialEnd: string | null;
};

async function fetchSubscription(customerId: string): Promise<SubscriptionInfo | null> {
  const res = await fetch(`/api/stripe/subscription/${customerId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch subscription");
  }

  const data = await res.json();
  return data.subscription ?? null;
}

export function useSubscription(customerId: string) {
  return useQuery<SubscriptionInfo | null>({
    queryKey: ["subscription", customerId],
    queryFn: () => fetchSubscription(customerId),
    enabled: !!customerId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

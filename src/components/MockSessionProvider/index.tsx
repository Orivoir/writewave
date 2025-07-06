import { SessionProvider, SessionContext } from "next-auth/react";
import type { Session } from "next-auth";
import type { SessionContextValue } from "next-auth/react";

export default function MockSessionProvider({
  children,
  session,
  status,
}: {
  children: React.ReactNode;
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
}) {
  let value: SessionContextValue;

  if (status === "authenticated" && session) {
    value = {
      data: session,
      status: "authenticated",
      update: async () => session,
    };
  } else {
    value = {
      data: null,
      status: status as "loading" | "unauthenticated",
      update: async () => null,
    };
  }

  return (
    <SessionProvider session={session}>
      <SessionContext.Provider value={value}>
        {children}
      </SessionContext.Provider>
    </SessionProvider>
  );
}

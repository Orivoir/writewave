import NextAuth from "next-auth";
import type { UserRole } from "@/models/User";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    };
  }

  interface User {
    id: string;
  }

  interface JWT {
    sub: string;
  }
}

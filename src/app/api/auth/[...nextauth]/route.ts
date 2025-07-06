import NextAuth, {NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongo-client";
import { ObjectId } from "mongodb";
import { UserRole } from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'email public_profile'
        }
      }
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASS,
        },
      },
      from: process.env.EMAIL_FROM,
    })
  ],
  adapter: MongoDBAdapter(clientPromise), // si tu veux persister les users
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // custom login page
  },
  events: {
    async createUser({ user }) {
      const db = (await clientPromise).db();
      await db.collection("users").updateOne(
        { _id: new ObjectId(user.id) },
        {
          $set: {
            role: "free",
            // isCompleted: true, // ou false selon conditions
          }
        }
      );
    }
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id.toString()
      }
      return token
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user = {id: token.sub || ""}
      }
      return session;
    },
  },
}

// ⬇️ Ici tu réutilises les options
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
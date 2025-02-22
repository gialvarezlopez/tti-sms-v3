//pages/api/auth/[...nextauth].ts
import NextAuth, {
  NextAuthOptions,
  User as NextAuthUser,
  Session,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { UserProps } from "@/types/types";

import { JWT } from "next-auth/jwt";

// Define the type for the object returned from authorize
interface CustomUser extends NextAuthUser {
  id: string;
  accessToken: string;
  roles: string[];
  branch: {
    name: string;
    id: string;
  };
}

// Extend the Session type to include custom fields
export interface CustomSession extends Session {
  user: CustomUser;
}

// Extend the JWT type to include custom fields
interface CustomJWT extends JWT {
  user?: CustomUser;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL;
          const { data } = await axios.post<UserProps>(
            `${baseUrl}/api/v1/user/login`,
            {
              email: credentials?.email,
              password: credentials?.password,
            }
          );
          if (data) {
            const user: CustomUser = {
              id: data.id || "",
              name: `${data.first_name} ${data.last_name}`,
              email: data.email || "",
              accessToken: data.token || "",
              roles: Array.isArray(data.roles)
                ? data.roles
                : [data.roles || ""],
              branch: {
                name: data.branch.name || "",
                id: data.branch.id || "",
              },
            };

            return user;
          } else {
            return null;
          }
        } catch (error) {
          //console.log(error);
          //throw new Error(`${error}`);
          if (axios.isAxiosError(error)) {
            const errorMessage =
              error.response?.data?.message || "Authentication error";
            throw new Error(errorMessage);
          } else {
            throw new Error(`Unknown error ${error}`);
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user, trigger, session }): Promise<CustomJWT> {
      if (user) {
        (token as CustomJWT).user = user as CustomUser;
      }

      if (trigger === "update" && session?.user) {
        if ((token as CustomJWT).user) {
          (token as CustomJWT).user = {
            ...(token as CustomJWT).user,
            ...session.user,
          };
        }
      }

      return token as CustomJWT;
    },
    async session({ session, token }): Promise<CustomSession> {
      return {
        ...session,
        user: (token as CustomJWT).user as CustomUser,
      } as CustomSession;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
};

export default NextAuth(authOptions);

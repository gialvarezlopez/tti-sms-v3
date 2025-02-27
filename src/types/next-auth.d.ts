// src/types/next-auth.d.ts
import { User as NextAuthUser } from "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      jwt: string;
      roles: string[];
      branch: {
        name: string;
        id: string;
      };
    } & DefaultSession["user"];
  }

  interface User extends NextAuthUser {
    id: string;
    jwt: string;
    roles: string[];
    branch: {
      name: string;
      id: string;
    };
  }
}

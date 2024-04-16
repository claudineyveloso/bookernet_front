import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

interface LoginResponse {
  id: string;
  email: string;
  is_active: boolean;
  user_type: string;
  token: string;
  password: string;
}

interface LoginUserPayload {
  email: string;
  password: string;
}

const handler = NextAuth({
  pages: {
    signIn: "/", // Redireciona para a página inicial ao invés de "/signIn"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            return null;
          }

          const response = await axios.post<LoginResponse>(
            "http://localhost:8080/login",
            {
              email: credentials?.email,
              password: credentials.password,
            },
          );
          if (response.status === 200 && response.data.token) {
            return {
              id: response.data.id,
              email: response.data.email,
              is_active: response.data.is_active,
              token: response.data.token,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Erro ao fazer login:", error);
          return null;
        }
      },
    }),
  ],
});

export { handler as GET, handler as POST };

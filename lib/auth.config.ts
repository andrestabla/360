import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
        error: '/login', // Error code passed in url query string as ?error=
        verifyRequest: '/auth/verify-request', // (used for check email message)
        newUser: '/dashboard' // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                // If logged in and on login page, redirect to dashboard
                if (nextUrl.pathname === '/login') {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                // @ts-ignore
                session.user.role = token.role;
            }
            // Ensure email/name persist if available
            if (token.email && session.user) session.user.email = token.email;
            if (token.name && session.user) session.user.name = token.name;

            return session;
        },
        async jwt({ token, user, trigger, session }) {
            // Handle session updates (e.g. role change) but ONLY merge safe fields
            if (trigger === "update" && session?.user) {
                // explicit list of allowed fields to update in the token
                if (session.user.role) token.role = session.user.role;
                if (session.user.name) token.name = session.user.name;
                // DO NOT merge full object: return { ...token, ...session.user };
            }

            if (user) {
                token.sub = user.id;
                token.email = user.email;
                token.name = user.name;
                // @ts-ignore
                token.role = user.role;
                // Note: We deliberately exclude 'image'/'picture' if it might be a large base64 string
            }
            return token;
        }
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig

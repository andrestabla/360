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
            return session;
        },
        async jwt({ token, user, trigger, session }) {
            if (trigger === "update" && session) {
                return { ...token, ...session.user };
            }

            if (user) {
                token.sub = user.id;
                // @ts-ignore
                token.role = user.role;
            }
            return token;
        }
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig

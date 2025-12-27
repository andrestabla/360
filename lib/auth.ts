import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/server/db"
import { accounts, sessions, users, verificationTokens } from "@/shared/schema"
import { authConfig } from "./auth.config"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { z } from "zod"

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    session: { strategy: "jwt" }, // Use JWT for credentials provider compatibility
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                console.log("[Auth] Authorize called with email:", credentials?.email);

                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    console.log(`[Auth] Attempting login for: ${email}`);

                    try {
                        const user = await db.query.users.findFirst({
                            where: eq(users.email, email),
                        });

                        if (!user) {
                            console.log(`[Auth] User not found: ${email}`);
                            return null;
                        }

                        if (!user.password) {
                            console.log(`[Auth] User found but has no password (OAuth likely): ${email}`);
                            return null;
                        }

                        const passwordsMatch = await bcrypt.compare(password, user.password);

                        if (passwordsMatch) {
                            console.log(`[Auth] Password match! Login successful for ${email}`);

                            // Update last login
                            try {
                                await db.update(users)
                                    .set({ lastLogin: new Date() })
                                    .where(eq(users.id, user.id));
                            } catch (err) {
                                console.error('[Auth] Failed to update lastLogin:', err);
                            }

                            const returnUser = {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                image: user.image,
                                role: user.role
                            };

                            console.log(`[Auth] Returning user object:`, returnUser);
                            return returnUser;
                        } else {
                            console.log(`[Auth] Invalid password for ${email}`);
                        }
                    } catch (dbError) {
                        console.error('[Auth] Database error during authorize:', dbError);
                        return null; // Or throw if you want 500
                    }
                } else {
                    console.error("[Auth] Zod validation failed", parsedCredentials.error);
                }

                console.log("[Auth] Invalid credentials return null");
                return null;
            },
        }),
    ],
})

import { betterAuth } from "better-auth";

// Initialize Better Auth as required
// Note: Better Auth handles JWT internally, we don't need a separate JWT plugin
export const auth = betterAuth({
  // Use JWT for session management with 7-day expiration
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    updateAge: 24 * 60 * 60, // Update session every 24 hours if active
  },
  // Configure to work with backend that sets httpOnly cookies
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  // Do NOT store tokens in localStorage as per requirements
  // Rely on httpOnly cookies set by backend
  cookies: {
    sessionToken: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    },
  },
  // Use email and password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // For simplicity in this implementation
  },
  // Configure auth endpoints to match backend
  socialProviders: {},
  // Error handling
  dangerouslyDisplayErrors: process.env.NODE_ENV !== "production",
});

// Export auth methods as required
export const { signIn, signOut, signUp, useSession } = auth;

// Export types for frontend components
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}
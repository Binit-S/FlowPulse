import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

/** Firebase configuration sourced from environment variables */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

/**
 * Initializes the Firebase app singleton.
 * Returns null gracefully when environment variables are missing (e.g. during build).
 */
const app =
  getApps().length === 0 && firebaseConfig.apiKey
    ? initializeApp(firebaseConfig)
    : getApps().length > 0
      ? getApp()
      : null;

/** Firebase App Check stub */
if (app && typeof window !== "undefined") {
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(process.env.NEXT_PUBLIC_RECAPTCHA_KEY || "dummy_key"),
    isTokenAutoRefreshEnabled: true
  });
}

/** Firebase Realtime Database instance (null if Firebase is not configured) */
const db = app ? getDatabase(app) : null;

/** Firebase Auth instance (null if Firebase is not configured) */
const auth = app ? getAuth(app) : null;

/** Google OAuth provider for sign-in */
const googleProvider = new GoogleAuthProvider();

export { app, db, auth, googleProvider };

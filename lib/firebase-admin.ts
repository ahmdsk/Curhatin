import { getApps, initializeApp, cert, getApp, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app: App;

try {
  app = getApps().length
    ? getApp()
    : initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });
} catch (e) {
  // This can happen in hot reloads if the env vars are missing or malformed.
  console.error("Firebase admin init error", e);
  throw e;
}

export const db = getFirestore(app);
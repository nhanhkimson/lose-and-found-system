import admin from "firebase-admin";

function initFirebaseAdmin(): admin.app.App | null {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (json) {
    const serviceAccount = JSON.parse(json) as admin.ServiceAccount;
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
    .trim();

  if (projectId && clientEmail && privateKey) {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  return null;
}

export function getFirebaseAuth(): admin.auth.Auth | null {
  const app = initFirebaseAdmin();
  return app ? admin.auth(app) : null;
}

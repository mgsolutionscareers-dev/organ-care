import admin from 'firebase-admin';

let isFirebaseAdminInitialized = false;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID || 'organcare-health-84c2b';
  
  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    });
    isFirebaseAdminInitialized = true;
    console.log(`[Firebase Admin] Initialized with Service Account for ${projectId}`);
  } else {
    // Initialize with application default or project ID
    admin.initializeApp({ projectId });
    isFirebaseAdminInitialized = true;
    console.log(`[Firebase Admin] Initialized with Project ID: ${projectId}`);
  }
} catch (err) {
  console.warn(`[Firebase Admin] Not fully configured yet (${err.message}). Optional server-side token checks will run in mock/passthrough mode.`);
}

export { admin, isFirebaseAdminInitialized };


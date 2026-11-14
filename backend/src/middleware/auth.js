import { admin, isFirebaseAdminInitialized } from '../config/firebase.js';

export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Missing or invalid Authorization header.'
    });
  }

  const token = authHeader.split('Bearer ')[1];

  if (!isFirebaseAdminInitialized) {
    // Development pass-through when service account key isn't provided locally
    req.user = { uid: 'dev-user-mock', email: 'guest@organcare.org' };
    return next();
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Firebase token verification error:', error.message);
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Invalid or expired Firebase authentication token.'
    });
  }
};


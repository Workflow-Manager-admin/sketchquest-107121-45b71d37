const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

/**
 * Configure CORS to allow frontend access (custom origin or all for dev).
 */
const corsOptions = {
  origin: process.env.CORS_ALLOWED_ORIGIN || "http://localhost:3000",
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

/**
 * PUBLIC_INTERFACE
 * Firebase Admin initialization.
 * Make sure GOOGLE_APPLICATION_CREDENTIALS env variable points to a valid Firebase service account file.
 */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const openapiTags = [
  {
    name: "Authentication",
    description: "Endpoints related to user authentication using Firebase Admin SDK."
  }
];

/**
 * @swagger
 * /api/auth/anonymous-login:
 *   post:
 *     summary: Perform anonymous login via backend and return Firebase custom token.
 *     description: |
 *       Generates an anonymous Firebase user using the Admin SDK, returns a custom token for frontend authentication.
 *       Takes a displayName (optional) from the body to label the user.
 *     tags:
 *       - Authentication
 *     requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                displayName:
 *                  type: string
 *                  description: Desired username or display name for the session.
 *                  example: Player42
 *            required: false
 *     responses:
 *       200:
 *         description: Successful. Returns Firebase custom token and UID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Firebase custom token for frontend authentication.
 *                 uid:
 *                   type: string
 *                   description: Firebase user UID.
 *       500:
 *         description: Internal server error.
 */
app.post('/api/auth/anonymous-login', async (req, res) => {
  try {
    const { displayName } = req.body || {};
    // Create a new anonymous user with optional displayName
    let userRecord;
    try {
      userRecord = await admin.auth().createUser({
        displayName: displayName || undefined
      });
    } catch (err) {
      // If duplicate, fallback to creating a plain anonymous user
      if (err.code === 'auth/uid-already-exists' || err.code === 'auth/email-already-exists') {
        userRecord = await admin.auth().createUser({});
      } else {
        throw err;
      }
    }
    // Issue a custom token for this user
    const token = await admin.auth().createCustomToken(userRecord.uid);
    return res.status(200).json({ token, uid: userRecord.uid });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Failed to login anonymously." });
  }
});

// (Legacy) Also keep /api/login-anonymous route for backward compatibility
app.post('/api/login-anonymous', async (req, res) => {
  try {
    const { displayName } = req.body || {};
    let userRecord;
    try {
      userRecord = await admin.auth().createUser({
        displayName: displayName || undefined
      });
    } catch (err) {
      if (err.code === 'auth/uid-already-exists' || err.code === 'auth/email-already-exists') {
        userRecord = await admin.auth().createUser({});
      } else {
        throw err;
      }
    }
    const token = await admin.auth().createCustomToken(userRecord.uid);
    return res.status(200).json({ token, uid: userRecord.uid });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Failed to login anonymously." });
  }
});

app.get('/api/healthz', (_, res) => res.send('ok'));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend server listening on port ${PORT}`);
});

module.exports = app;

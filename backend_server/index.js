const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
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
 * /api/login-anonymous:
 *   post:
 *     summary: Anonymous login for on-boarding user.
 *     description: Authenticates the user anonymously using Firebase Admin SDK and returns a custom auth token.
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
 *         description: Returns a custom token and UID for the authenticated session.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Firebase custom auth token for frontend auth.
 *                 uid:
 *                   type: string
 *                   description: The UID of the anonymous user.
 *       500:
 *         description: Error occurred during anonymous login.
 */
app.post('/api/login-anonymous', async (req, res) => {
  try {
    // Anonymous sign-in: create user record (if not present)
    // Optionally provide displayName if sent by client
    const { displayName } = req.body || {};
    const userRecord = await admin.auth().createUser({
      displayName: displayName || null,
      // The uid will be auto-generated.
    }).catch(async (err) => {
      // If user exists with same displayName, fallback: just create an anon user without name.
      if (err.code === 'auth/uid-already-exists' || err.code === 'auth/email-already-exists') {
        return admin.auth().createUser({});
      }
      throw err;
    });

    // Issue a Firebase custom token for the client to log in with on frontend
    const token = await admin.auth().createCustomToken(userRecord.uid);
    res.json({
      token,
      uid: userRecord.uid
    });
  } catch (e) {
    // Firebase Admin SDK issues, credential problems, DB errors, etc.
    res.status(500).json({ error: e.message || 'Failed to login anonymously.' });
  }
});

app.get('/api/healthz', (_, res) => res.send('ok'));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend server listening on port ${PORT}`);
});

module.exports = app;

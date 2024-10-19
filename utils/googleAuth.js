require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userId = payload["sub"];
  const email = payload["email"];
  // Return user data (or create a new user in your DB)
  console.log("payload from google token: ", payload);
  return { userId, email, payload };
}

module.exports = {
  verifyGoogleToken,
};

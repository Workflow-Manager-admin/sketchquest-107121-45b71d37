import React, { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithCustomToken, onAuthStateChanged, updateProfile } from "firebase/auth";

// PUBLIC_INTERFACE
export const AuthContext = createContext();

/**
 * Calls the backend to request an admin-generated Firebase custom token for anonymous login.
 * @param {string} username 
 * @returns {Promise<{token: string, uid: string}>}
 */
/**
 * Makes a POST request to the backend to perform anonymous login and receive a Firebase custom token.
 * @param {string} username
 * @returns {Promise<{token: string, uid: string}>}
 */
/**
 * Makes a POST request to the backend to perform anonymous login and receive a Firebase custom token.
 * Surfaces network/CORS errors in more detail for easier debugging.
 * @param {string} username
 * @returns {Promise<{token: string, uid: string}>}
 */
async function callBackendAnonymousLogin(username) {
  // Determine backend URL: allows .env override, else defaults to http://localhost:5001
  const endpoint =
    (process.env.REACT_APP_BACKEND_URL
      ? process.env.REACT_APP_BACKEND_URL.replace(/\/$/, "")
      : "http://localhost:5001") + "/api/auth/anonymous-login";
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Allows cookies if needed
      body: JSON.stringify({ displayName: username })
    });
    if (!res.ok) {
      // Try to extract error message
      const contentType = res.headers.get("content-type") || "";
      let serverError = "Failed to log in anonymously. Try again later.";
      if (contentType.includes("application/json")) {
        const json = await res.json();
        if (json && json.error) {
          serverError = json.error;
        }
      }
      throw new Error(serverError);
    }
    return res.json();
  } catch (e) {
    // Handle fetch-level error, usually 'Failed to fetch' due to CORS/network/down server
    // (TypeError or a string like "Failed to fetch")
    let extraMsg = "";
    if (
      typeof e === "object" &&
      e instanceof TypeError &&
      e.message &&
      /fetch/i.test(e.message)
    ) {
      extraMsg =
        " (Possible connectivity, CORS, or server-down issue. Make sure the backend server is running at " +
        endpoint +
        " and is accessible from the browser. If running locally, verify CORS settings and that there are no firewalls or port conflicts.)";
    }
    throw new Error("Anonymous login failed: " + (e.message || e) + extraMsg);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
  }, []);

  // PUBLIC_INTERFACE
  /**
   * Attempts anonymous login by calling the backend to create and sign in with a custom token,
   * and sets the displayName in Firebase.
   * @param {string} username The chosen username (already validated by UI)
   */
  async function login(username) {
    try {
      // receive custom token from backend, then use it to sign in
      const { token, uid } = await callBackendAnonymousLogin(username);

      const cred = await signInWithCustomToken(auth, token);
      if (cred && cred.user && cred.user.displayName !== username) {
        await updateProfile(cred.user, { displayName: username });
      }
      setUser({ ...cred.user, displayName: username });
    } catch (e) {
      // Compose more actionable error to surface to UI
      let msg = "Login failed: ";
      if (e.code) {
        msg += `[${e.code}] `;
      }
      if (e.message) {
        msg += e.message;
      }
      throw new Error(msg);
    }
  }
  // PUBLIC_INTERFACE
  function logout() {
    try {
      auth.signOut();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Logout error:", e);
    }
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

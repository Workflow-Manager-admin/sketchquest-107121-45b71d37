import React, { createContext, useState, useEffect } from "react";
import { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithCustomToken, onAuthStateChanged, updateProfile } from "firebase/auth";

// PUBLIC_INTERFACE
export const AuthContext = createContext();

/**
 * Calls the backend to request an admin-generated Firebase custom token for anonymous login.
 * @param {string} username 
 * @returns {Promise<{token: string, uid: string}>}
 */
async function callBackendAnonymousLogin(username) {
  const res = await fetch(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5001"}/api/login-anonymous`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ displayName: username })
  });
  if (!res.ok) {
    throw new Error("Failed to log in anonymously. Try again later.");
  }
  return res.json();
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

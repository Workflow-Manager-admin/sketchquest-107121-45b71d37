import React, { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInAnonymously, onAuthStateChanged, updateProfile } from "firebase/auth";

// PUBLIC_INTERFACE
export const AuthContext = createContext();

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
   * Attempts anonymous login and sets the displayName.
   * If already authenticated, updates displayName if needed.
   * @param {string} username The chosen username (already validated by UI)
   */
  /**
   * Attempts anonymous login and sets the displayName.
   * If already authenticated, updates displayName if needed.
   * Enhanced to throw on Firebase config/misconfig errors.
   */
  async function login(username) {
    try {
      // If missing firebase config, throw explicitly so frontend shows better error
      if (
        (typeof auth === "undefined") ||
        !auth.app ||
        !auth.app.options ||
        Object.values(auth.app.options).some(
          v => typeof v === "string" && v.includes("_HERE")
        )
      ) {
        throw new Error(
          "Firebase not configured: Check src/firebase.js for correct keys. " +
          "Visit Firebase Console > Project Settings > General > Your Apps " +
          "and copy your actual config into src/firebase.js or use .env.local variables."
        );
      }

      if (!auth.currentUser) {
        // Not signed in, do anonymous sign-in
        let cred = await signInAnonymously(auth);
        await updateProfile(cred.user, { displayName: username });
        setUser({ ...cred.user }); // ensure force update with new displayName
      } else {
        // Already signed-in (should rarely happen on login page), just update
        await updateProfile(auth.currentUser, { displayName: username });
        setUser({ ...auth.currentUser });
      }
    } catch (e) {
      // Log full error for diagnostics
      // Optionally, you could send e.message to some bug report system here
      // eslint-disable-next-line no-console
      console.error("Login error:", e);
      throw e;
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

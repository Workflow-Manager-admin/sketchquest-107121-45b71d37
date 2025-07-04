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
  async function login(username) {
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
  }
  // PUBLIC_INTERFACE
  function logout() {
    auth.signOut();
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

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
  async function login(username) {
    // Anonymous auth, set username for displayName
    let cred = await signInAnonymously(auth);
    await updateProfile(cred.user, { displayName: username });
    setUser(auth.currentUser);
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

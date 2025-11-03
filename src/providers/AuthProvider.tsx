import React from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";

export const AuthContext = React.createContext<User | null>(null);
export function useUser() { return React.useContext(AuthContext); }

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setReady(true); });
    return () => unsub();
  }, []);

  if (!ready) return null;
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
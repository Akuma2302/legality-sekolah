import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { authToken } from '../services/authToken';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = still checking for a stored token

  useEffect(() => {
    const token = authToken.get();
    if (!token) {
      setUser(null);
      return;
    }
    api.me()
      .then(setUser)
      .catch(() => {
        authToken.clear();
        setUser(null);
      });
  }, []);

  const signIn = async (username, password) => {
    const { token, user: signedInUser } = await api.signin({ username, password });
    authToken.set(token);
    setUser(signedInUser);
    return signedInUser;
  };

  const signOut = () => {
    authToken.clear();
    setUser(null);
  };

  const value = {
    user,
    loading: user === undefined,
    isAuthenticated: !!user,
    role: user?.role,
    fullName: user?.full_name,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

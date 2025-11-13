'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: any | null;
  roles: number[];
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [roles, setRoles] = useState<number[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ---------------- Load user from localStorage ----------------
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedRoles = localStorage.getItem('roles');
    const storedUser = localStorage.getItem('user');

    if (storedToken) setAccessToken(storedToken);
    if (storedRoles) setRoles(JSON.parse(storedRoles));
    if (storedUser) setUser(JSON.parse(storedUser));

    setLoading(false);
  }, []);

  // ---------------- Axios Interceptor for token refresh ----------------
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      res => res,
      async err => {
        const originalReq = err.config;
        if (err.response?.status === 401 && !originalReq._retry) {
          originalReq._retry = true;
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            await logout();
            return Promise.reject(err);
          }
          try {
            const { data } = await axios.post('/api/auth/refresh', { token: refreshToken });
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data;
            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            setAccessToken(newAccessToken);
            originalReq.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axios(originalReq);
          } catch {
            await logout();
            return Promise.reject(err);
          }
        }
        return Promise.reject(err);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // ---------------- Login ----------------
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      const { accessToken, refreshToken, session, user: backendUser, roles: backendRoles } = data;

      // Save to localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(backendUser));
      localStorage.setItem('roles', JSON.stringify(backendRoles || []));
      localStorage.setItem('sessionId', session.id);

      // Update state
      setAccessToken(accessToken);
      setUser(backendUser);
      setRoles(backendRoles || []);

      toast.success('Logged in successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Logout ----------------
  const logout = async () => {
    const sessionId = localStorage.getItem('sessionId');
    try {
      if (sessionId) await axios.post('/api/auth/logout', { sessionId });
    } catch (err) {
      console.error(err);
    } finally {
      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('roles');
      localStorage.removeItem('sessionId');

      // Clear state
      setUser(null);
      setRoles([]);
      setAccessToken(null);

      toast.success('Logged out successfully!');
    }
  };


  return (
    <AuthContext.Provider value={{ user, roles, accessToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------------- Hook ----------------
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

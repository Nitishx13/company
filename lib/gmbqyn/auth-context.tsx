'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getGmbqynService } from './index';
import type { AuthCredentials, RegisterPayload, Role, Session, Subscription } from './types';

const ROLE_COOKIE = 'gmbqyn_role';

interface AuthContextValue {
  session: Session | null;
  role: Role | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  serviceMode: 'laravel' | 'mock';
  login: (credentials: AuthCredentials) => Promise<Session>;
  register: (payload: RegisterPayload) => Promise<Session>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  applySubscription: (subscription: Subscription) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const writeRoleCookie = (role: Role | null) => {
  if (typeof document === 'undefined') return;
  try {
    if (role) {
      document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    } else {
      document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0; samesite=lax`;
    }
  } catch {
    /* cookies blocked */
  }
};

export function GmbqynAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const service = useMemo(() => getGmbqynService(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback((next: Session | null) => {
    setSession(next);
    writeRoleCookie(next?.user.role ?? null);
  }, []);

  useEffect(() => {
    let active = true;
    service
      .me()
      .then((next) => {
        if (active) applySession(next);
      })
      .catch(() => {
        if (active) applySession(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [service, applySession]);

  const login = useCallback(
    async (credentials: AuthCredentials) => {
      const next = await service.login(credentials);
      applySession(next);
      return next;
    },
    [service, applySession]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const next = await service.register(payload);
      applySession(next);
      return next;
    },
    [service, applySession]
  );

  const logout = useCallback(async () => {
    await service.logout();
    applySession(null);
    router.push('/gmbqyn/login');
  }, [service, applySession, router]);

  const refresh = useCallback(async () => {
    try {
      const next = await service.me();
      applySession(next);
    } catch {
      applySession(null);
    }
  }, [service, applySession]);

  const applySubscription = useCallback(
    (subscription: Subscription) => {
      setSession((prev) => (prev ? { ...prev, subscription } : prev));
    },
    []
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      role: session?.user.role ?? null,
      isLoading,
      isAuthenticated: Boolean(session),
      isAdmin: session?.user.role === 'admin',
      serviceMode: service.mode,
      login,
      register,
      logout,
      refresh,
      applySubscription,
    }),
    [session, isLoading, login, register, logout, refresh, applySubscription]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useGmbqynAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useGmbqynAuth must be used inside <GmbqynAuthProvider>');
  return context;
}

export function useGmbqynService() {
  return useMemo(() => getGmbqynService(), []);
}

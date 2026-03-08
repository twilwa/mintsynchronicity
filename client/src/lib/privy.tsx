import { createContext, useContext, lazy, Suspense, type ReactNode } from "react";

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID || "";
export const isPrivyConfigured = !!PRIVY_APP_ID;

interface AuthContextType {
  ready: boolean;
  authenticated: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const LazyPrivyInner = lazy(async () => {
  const { PrivyProvider, usePrivy } = await import("@privy-io/react-auth");

  function PrivyAuthBridge({ children }: { children: ReactNode }) {
    const { ready, authenticated, login, logout } = usePrivy();
    return (
      <AuthContext.Provider value={{ ready, authenticated, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }

  function PrivyInner({ children }: { children: ReactNode }) {
    return (
      <PrivyProvider
        appId={PRIVY_APP_ID}
        config={{
          appearance: { theme: "dark", accentColor: "#3b82f6" },
          embeddedWallets: { createOnLogin: "users-without-wallets" },
        }}
      >
        <PrivyAuthBridge>{children}</PrivyAuthBridge>
      </PrivyProvider>
    );
  }

  return { default: PrivyInner };
});

export function AuthProvider({ children }: { children: ReactNode }) {
  if (!isPrivyConfigured) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={<>{children}</>}>
      <LazyPrivyInner>{children}</LazyPrivyInner>
    </Suspense>
  );
}

export function useAuth(): AuthContextType | null {
  return useContext(AuthContext);
}
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext({
  isSignedIn: false,
  isLoading: true,
  roles: [],
  userId: null,
  buyerUserId: null,
  sellerId: null,
  signOut: async () => {},
  setAuthenticating: () => {},
  refreshAuthState: () => {},
  clearAuthenticating: () => {},
});

const parseRoles = (rawRoles) => {
  if (!rawRoles) return [];
  try {
    const parsed = JSON.parse(rawRoles);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === "string") return [parsed];
    if (parsed && typeof parsed === "object") {
      return Object.values(parsed).filter(Boolean);
    }
  } catch {
    if (typeof rawRoles === "string" && rawRoles.length) {
      return rawRoles.split(",").map((role) => role.trim()).filter(Boolean);
    }
  }
  return [];
};

export function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [roles, setRoles] = useState([]);
  const [initializing, setInitializing] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [buyerUserId, setBuyerUserId] = useState(
    localStorage.getItem("buyerUserId") || null
  );
  const [sellerId, setSellerId] = useState(
    localStorage.getItem("sellerId") || null
  );

  const refreshAuthState = useCallback(() => {
    const token = localStorage.getItem("token");
    const savedRoles = localStorage.getItem("roles");
    const storedUserId = localStorage.getItem("userId");
    const storedBuyerUserId = localStorage.getItem("buyerUserId");
    const storedSellerId = localStorage.getItem("sellerId");

    setIsSignedIn(Boolean(token));
    setRoles(parseRoles(savedRoles));
    setUserId(storedUserId || null);
    setBuyerUserId(storedBuyerUserId || null);
    setSellerId(storedSellerId || null);
  }, []);

  useEffect(() => {
    refreshAuthState();
    setInitializing(false);
  }, [refreshAuthState]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (["token", "roles"].includes(event.key)) {
        refreshAuthState();
      }
    };

    const handleAuthEvent = () => {
      refreshAuthState();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth-state-changed", handleAuthEvent);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth-state-changed", handleAuthEvent);
    };
  }, [refreshAuthState]);

  const clearAuthenticating = useCallback(() => {
    setAuthenticating(false);
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("sellerId");
    localStorage.removeItem("buyerUserId");
    localStorage.removeItem("userId");

    setIsSignedIn(false);
    setRoles([]);
    setUserId(null);
    setBuyerUserId(null);
    setSellerId(null);

    window.dispatchEvent(new Event("auth-state-changed"));
  }, []);

  const value = useMemo(
    () => ({
      isSignedIn,
      roles,
      isLoading: initializing || authenticating,
      userId,
      buyerUserId,
      sellerId,
      signOut,
      setAuthenticating,
      refreshAuthState,
      clearAuthenticating,
    }),
    [
      isSignedIn,
      roles,
      initializing,
      authenticating,
      userId,
      buyerUserId,
      sellerId,
      signOut,
      refreshAuthState,
      clearAuthenticating,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

export const broadcastAuthChange = () => {
  window.dispatchEvent(new Event("auth-state-changed"));
};



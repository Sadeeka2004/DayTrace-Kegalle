import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCurrentAdmin,
  loginAdmin,
} from "../services/api";

const AdminAuthContext = createContext(null);

const TOKEN_STORAGE_KEY = "daytrace_admin_token";

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    sessionStorage.getItem(TOKEN_STORAGE_KEY),
  );
  const [admin, setAdmin] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let requestIsActive = true;

    const verifyAdmin = async () => {
      if (!token) {
        setAdmin(null);
        setIsCheckingAuth(false);
        return;
      }

      try {
        setIsCheckingAuth(true);

        const response = await getCurrentAdmin(token);

        if (requestIsActive) {
          setAdmin(response.admin);
        }
      } catch {
        if (requestIsActive) {
          sessionStorage.removeItem(TOKEN_STORAGE_KEY);
          setToken(null);
          setAdmin(null);
        }
      } finally {
        if (requestIsActive) {
          setIsCheckingAuth(false);
        }
      }
    };

    verifyAdmin();

    return () => {
      requestIsActive = false;
    };
  }, [token]);

  const login = async (credentials) => {
    const response = await loginAdmin(credentials);

    sessionStorage.setItem(TOKEN_STORAGE_KEY, response.token);
    setToken(response.token);
    setAdmin(response.admin);

    return response;
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setAdmin(null);
  };

  const contextValue = useMemo(
    () => ({
      token,
      admin,
      isCheckingAuth,
      isAuthenticated: Boolean(token && admin),
      login,
      logout,
    }),
    [token, admin, isCheckingAuth],
  );

  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export default AdminAuthContext;
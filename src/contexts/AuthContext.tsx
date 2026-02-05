"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  User,
  MerchantUser,
  AuthState,
  LoginRequest,
  RegisterRequest,
  MerchantRegisterRequest,
} from "@/src/domains/auth/auth.types";
import {
  login as apiLogin,
  register as apiRegister,
  registerMerchant as apiRegisterMerchant,
  logout as apiLogout,
  getCurrentUser,
  isAuthenticated as checkIsAuthenticated,
} from "@/src/domains/auth/auth.api";
import { tokenStorage } from "@/src/lib/api-client";

// Auth Context Type
interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  registerMerchant: (data: MerchantRegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

// Default context value
const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  registerMerchant: async () => {},
  logout: async () => {},
  clearError: () => {},
  refreshUser: async () => {},
};

// Create context
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (checkIsAuthenticated()) {
          const user = await getCurrentUser();
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        // Token might be expired or invalid
        tokenStorage.clearTokens();
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = useCallback(async (credentials: LoginRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiLogin(credentials);
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Redirect based on user role
      if (response.user.role === "MERCHANT") {
        router.push("/merchant/dashboard");
      } else if (response.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      throw error;
    }
  }, [router]);

  // Register handler (consumer)
  const register = useCallback(async (data: RegisterRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiRegister(data);
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Redirect to dashboard after registration
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      throw error;
    }
  }, [router]);

  // Register merchant handler
  const registerMerchant = useCallback(async (data: MerchantRegisterRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiRegisterMerchant(data);
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Redirect to merchant verification or dashboard
      const merchantUser = response.user as MerchantUser;
      if (merchantUser.verificationStatus === "PENDING") {
        router.push("/merchant/verification");
      } else {
        router.push("/merchant/dashboard");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Merchant registration failed";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      throw error;
    }
  }, [router]);

  // Logout handler
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await apiLogout();
    } finally {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      router.push("/login");
    }
  }, [router]);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!checkIsAuthenticated()) return;

    try {
      const user = await getCurrentUser();
      setState((prev) => ({ ...prev, user }));
    } catch (error) {
      // If refresh fails, user might need to re-login
      console.error("Failed to refresh user:", error);
    }
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    registerMerchant,
    logout,
    clearError,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: { requiredRole?: string }
) {
  return function ProtectedComponent(props: P) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push("/login");
      }

      if (!isLoading && isAuthenticated && options?.requiredRole) {
        if (user?.role !== options.requiredRole) {
          router.push("/unauthorized");
        }
      }
    }, [isLoading, isAuthenticated, user, router]);

    if (isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2C3466]"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    if (options?.requiredRole && user?.role !== options.requiredRole) {
      return null;
    }

    return <Component {...props} />;
  };
}

export default AuthContext;


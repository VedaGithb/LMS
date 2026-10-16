import type { AuthState } from "../types";
import { createContext } from "react";

export type AuthContextValue = AuthState & {
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string) => Promise<boolean>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
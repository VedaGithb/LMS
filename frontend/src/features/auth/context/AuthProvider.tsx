import { useState, type ReactNode } from "react";
import { isAxiosError } from "axios";
import { AuthContext } from "./AuthContext";
import type { AuthState } from "../types";
import { changePassword, loginUser, registerUser } from "../api/auth.api";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<AuthState>(() => {
        const token = localStorage.getItem("auth_token");
        const userData = localStorage.getItem("auth_user");

        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                return {
                    user,
                    token,
                    isAuthenticated: true,
                    error: null
                };
            } catch {
                localStorage.removeItem("auth_token");
                localStorage.removeItem("auth_user");
                return {
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null
                }
            }
        } else {
            return {
                user: null,
                token: null,
                isAuthenticated: false,
                error: null
            }
        }
    });

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login: async (email, password) => {
                    try {
                        const { user, token } = await loginUser(email, password);
                        localStorage.setItem("auth_token", token);
                        localStorage.setItem("auth_user", JSON.stringify(user));

                        setState((prevState) => ({
                            ...prevState,
                            user,
                            token,
                            isAuthenticated: true,
                            error: null
                        }));
                        return true;
                    } catch (e) {
                        let error;
                        if (isAxiosError(e)) {
                            const code = e.response?.data?.code;

                            if (code === "INVALID_CREDENTIALS") {
                                error = "Неверная электронная почта или пароль";
                            } else {
                                error = e.response?.data?.message;
                            }
                        } else if (e instanceof Error) {
                            error = e.message;
                        } else {
                            error = "Произошла ошибка входа";
                        }
                        localStorage.removeItem("auth_token");
                        localStorage.removeItem("auth_user");
                        setState({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                            error: error
                        })
                        return false;
                    }
                },
                register: async (email, password) => {
                    try {
                        await registerUser(email, password);

                        setState((prevState) => ({
                            ...prevState,
                            error: null
                        }));

                        return true;
                    } catch (e) {
                        let error;
                        if (isAxiosError(e)) {
                            const code = e.response?.data?.code;

                            if (code === "PASSWORD_TOO_SHORT") {
                                error = "Пароль должен быть не короче 6 символов";
                            } else if (code === "EMAIL_ALREADY_EXISTS") {
                                error = "Эта электронная почта уже занята";
                            } else {
                                error = e.response?.data?.message;
                            }
                        } else if (e instanceof Error) {
                            error = e.message;
                        } else {
                            error = "Произошла ошибка регистрации";
                        }
                        setState({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                            error: error
                        })
                        return false;
                    }
                },
                changePassword: async (currentPassword, newPassword) => {
                    try {
                        await changePassword(currentPassword, newPassword);

                        setState((prevState) => ({
                            ...prevState,
                            error: null
                        }));

                        return true;
                    } catch (e) {
                        let error;
                        if (isAxiosError(e)) {
                            const code = e.response?.data?.code;

                            if (code === "USER_NOT_FOUND") {
                                error = "Пользователь не найден";
                            } else if (code === "INVALID_CURRENT_PASSWORD") {
                                error = "Неверный текущий пароль";
                            } else {
                                error = e.response?.data?.message;
                            }
                        } else if (e instanceof Error) {
                            error = e.message;
                        } else {
                            error = "Произошла ошибка смены пароля";
                        }
                        setState((prevState) => ({
                            ...prevState,
                            error: error
                        }))
                        return false;
                    }
                },
                logout: () => {
                    localStorage.removeItem("auth_token");
                    localStorage.removeItem("auth_user");
                    setState({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        error: null
                    });
                },
                clearError: () => {
                    setState((prevState) => ({
                        ...prevState,
                        error: null
                    }));
                }
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
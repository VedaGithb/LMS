import { api } from "../../../shared/api/axios";
import type { AuthResponse, User } from "../types";

export const registerUser = async (email: string, password: string): Promise<User> => {
    const response = await api.post<User>("/users/register", {
        email,
        password
    })
    return response.data;
}

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/users/login", {
        email,
        password
    })
    return response.data;
}

export const changePassword = async (currentPassword: string, newPassword: string) => {
    const response = await api.post("/users/change-password", {
        currentPassword,
        newPassword
    });
    return response.data;
} 
import axiosInstance from "../api/axiosConfig";
import type { credentialsType } from "../utils/Credentials";

export class ServiceAuth {
    static async login(credentials: credentialsType) {
        try {
            const response = await axiosInstance.post('/users/login', credentials);
            return response;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }
}
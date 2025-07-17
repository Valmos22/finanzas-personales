import axiosInstance from "../api/axiosConfig";

export class ServiceUser {
    static async getUsers() {
        try {
            const response = await axiosInstance.get('/users');
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    static async getUserById() {
        try {
            const response = await axiosInstance.get(`/users/user`);
            return response;
        } catch (error) {
            console.error(`Error fetching user: `, error);
            throw error;
        }
    }

    static async createUser(userData: any) {
        try {
            const response = await axiosInstance.post('/users', userData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    static async updateUser(id: string, userData: any) {
        try {
            const response = await axiosInstance.put(`/users/${id}`, userData);
            return response.data;
        } catch (error) {
            console.error(`Error updating user with id ${id}:`, error);
            throw error;
        }
    }

    static async deleteUser(id: string) {
        try {
            const response = await axiosInstance.delete(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting user with id ${id}:`, error);
            throw error;
        }
    }
}
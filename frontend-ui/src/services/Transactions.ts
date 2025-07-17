import axiosInstance from "../api/axiosConfig";

export class ServiceTransactions {
  static async getAll(params: any = {}) {
    try {
      const response = await axiosInstance.get('/transactions', { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }

  static async getByUserId(userId: string) {
    try {
      const response = await axiosInstance.get(`/transactions/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching transactions for user ${userId}:`, error);
      throw error;
    }
  }

  static async getSummaryByUserId(userId: string) {
    try {
      const response = await axiosInstance.get(`/transactions/user/${userId}/summary`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching summary for user ${userId}:`, error);
      throw error;
    }
  }

  static async exportCSV(userId: string) {
    try {
      const response = await axiosInstance.get(`/transactions/user/${userId}/export`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error(`Error exporting transactions for user ${userId}:`, error);
      throw error;
    }
  }

  static async create(transactionData: any) {
    try {
      const response = await axiosInstance.post('/transactions', transactionData);
      return response.data;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  }

  static async update(id: string, transactionData: any) {
    try {
      const response = await axiosInstance.put(`/transactions/${id}`, transactionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating transaction with id ${id}:`, error);
      throw error;
    }
  }

  static async delete(id: string) {
    try {
      const response = await axiosInstance.delete(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting transaction with id ${id}:`, error);
      throw error;
    }
  }
}

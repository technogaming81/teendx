/**
 * API client for making requests to the Express backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data.data;
  }

  // Client methods
  static async getClients() {
    return this.request('/api/clients');
  }

  static async getClient(id: string) {
    return this.request(`/api/clients/${id}`);
  }

  static async createClient(data: any) {
    return this.request('/api/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateClient(id: string, data: any) {
    return this.request(`/api/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteClient(id: string) {
    return this.request(`/api/clients/${id}`, {
      method: 'DELETE',
    });
  }
}

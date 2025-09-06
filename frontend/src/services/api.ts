const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      // Handle non-JSON responses (like plain text)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text() as T;
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(credentials: SignupCredentials): Promise<string> {
    return this.request<string>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProducts() {
    const token = localStorage.getItem('token');
    return this.request('/user/getAllProducts', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getCart() {
    const token = localStorage.getItem('token');
    return this.request('/user/getCart', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async addToCart(productId: string) {
    const token = localStorage.getItem('token');
    console.log('Adding to cart:', { productId });
    return this.request('/user/addToCart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromCart(productId: string) {
    const token = localStorage.getItem('token');
    return this.request('/user/removeFromCart', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });
  }

}

export const apiService = new ApiService();
export default apiService;

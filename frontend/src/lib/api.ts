class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL = 'http://localhost:8000/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  setAuthToken(token: string | null) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  getURL(endpoint: string): string {
    return `${this.baseURL}${endpoint}`;
  }

  async handleResponse(response: Response) {
    const contentType = response.headers.get('content-type');
    const isJSON = contentType && contentType.includes('application/json');

    if (!response.ok) {
      const error: any = new Error('API request failed');
      error.status = response.status;
      error.statusText = response.statusText;

      if (isJSON) {
        error.data = await response.json();
      } else {
        error.data = await response.text();
      }

      throw error;
    }

    return isJSON ? await response.json() : await response.text();
  }

  async get<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(this.getURL(endpoint), {
      method: 'GET',
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    });

    return this.handleResponse(response);
  }

  async post<T = any>(endpoint: string, data: any = null, options: RequestInit = {}): Promise<T> {
    const response = await fetch(this.getURL(endpoint), {
      method: 'POST',
      headers: { ...this.defaultHeaders, ...options.headers },
      body: data ? JSON.stringify(data) : null,
      ...options,
    });

    return this.handleResponse(response);
  }

  async put<T = any>(endpoint: string, data: any = null, options: RequestInit = {}): Promise<T> {
    const response = await fetch(this.getURL(endpoint), {
      method: 'PUT',
      headers: { ...this.defaultHeaders, ...options.headers },
      body: data ? JSON.stringify(data) : null,
      ...options,
    });

    return this.handleResponse(response);
  }

  async patch<T = any>(endpoint: string, data: any = null, options: RequestInit = {}): Promise<T> {
    const response = await fetch(this.getURL(endpoint), {
      method: 'PATCH',
      headers: { ...this.defaultHeaders, ...options.headers },
      body: data ? JSON.stringify(data) : null,
      ...options,
    });

    return this.handleResponse(response);
  }

  async delete<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(this.getURL(endpoint), {
      method: 'DELETE',
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    });

    return this.handleResponse(response);
  }

  async upload<T = any>(endpoint: string, formData: FormData, options: RequestInit = {}): Promise<T> {
    const headers = { ...this.defaultHeaders };
    delete headers['Content-Type'];

    const response = await fetch(this.getURL(endpoint), {
      method: 'POST',
      headers: { ...headers, ...options.headers },
      body: formData,
      ...options,
    });

    return this.handleResponse(response);
  }
}

export const api = new ApiClient();

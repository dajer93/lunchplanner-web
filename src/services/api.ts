// API client for the lunch planner application
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Storage key for JWT token
const TOKEN_KEY = 'lunchplanner_token';

// Helper to get stored token
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

// Helper to store token
const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

// Helper to clear token
const clearToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Custom API Response type
interface ApiResponse {
  message?: string;
  token?: string;
  [key: string]: unknown;
}

// Base fetch with authentication and error handling
const apiFetch = async <T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  // Handle unauthorized responses
  if (response.status === 401) {
    clearToken();
    // Force reload to login page if needed
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  const data = await response.json() as ApiResponse;
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data as unknown as T;
};

// Authentication APIs
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const data = await apiFetch<ApiResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    
    if (data.token) {
      setToken(data.token);
    }
    
    return data;
  },
  
  login: async (email: string, password: string) => {
    const data = await apiFetch<ApiResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (data.token) {
      setToken(data.token);
    }
    
    return data;
  },
  
  logout: () => {
    clearToken();
  },
  
  getCurrentUser: async () => {
    return await apiFetch('/auth/me');
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    return await apiFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }
};

// Ingredients APIs
export const ingredientAPI = {
  getAll: async () => {
    return await apiFetch('/ingredients');
  },
  
  getById: async (id: string) => {
    return await apiFetch(`/ingredients/${id}`);
  },
  
  create: async (name: string) => {
    return await apiFetch('/ingredients', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
  },
  
  update: async (id: string, name: string) => {
    return await apiFetch(`/ingredients/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name })
    });
  },
  
  delete: async (id: string) => {
    return await apiFetch(`/ingredients/${id}`, {
      method: 'DELETE'
    });
  }
};

// Meals APIs
export const mealAPI = {
  getAll: async () => {
    return await apiFetch('/meals');
  },
  
  getById: async (id: string) => {
    return await apiFetch(`/meals/${id}`);
  },
  
  create: async (title: string, ingredients: { ingredientId: string, quantity: string }[]) => {
    return await apiFetch('/meals', {
      method: 'POST',
      body: JSON.stringify({ title, ingredients })
    });
  },
  
  update: async (id: string, title: string, ingredients: { ingredientId: string, quantity: string }[]) => {
    return await apiFetch(`/meals/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, ingredients })
    });
  },
  
  delete: async (id: string) => {
    return await apiFetch(`/meals/${id}`, {
      method: 'DELETE'
    });
  }
};

// Meal Plan APIs
export const planAPI = {
  getAll: async () => {
    return await apiFetch('/plans');
  },
  
  updateDay: async (date: string, mealIds: string[]) => {
    return await apiFetch(`/plans/${date}`, {
      method: 'PUT',
      body: JSON.stringify({ mealIds })
    });
  },
  
  reset: async () => {
    return await apiFetch('/plans', {
      method: 'DELETE'
    });
  },
  
  getShoppingList: async () => {
    return await apiFetch('/plans/shopping-list');
  }
}; 
// API client for the lunch planner application
import { 
  Ingredient, 
  Meal, 
  PlanDay, 
  GroceryItem, 
  User, 
  CreateIngredientRequest, 
  CreateMealRequest, 
  UpdatePlanDayRequest, 
  MealIngredient 
} from '@/models/types';

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

  try {
    console.log(`API request to ${endpoint}`);
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
    console.log(`API response status: ${response.status}`);

    // Handle unauthorized responses
    if (response.status === 401) {
      clearToken();
      // Force reload to login page if needed
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    // Handle no-content responses
    if (response.status === 204) {
      // For endpoints that should return arrays, return empty array
      if (
        endpoint === '/ingredients' || 
        endpoint === '/meals' || 
        endpoint === '/plans' ||
        endpoint === '/plans/shopping-list'
      ) {
        return [] as unknown as T;
      }
      return {} as T;
    }

    // Check if there's actual content to parse
    const contentType = response.headers.get('content-type');
    console.log(`Content-Type: ${contentType}`);
    
    // Parse JSON response
    if (contentType && contentType.includes('application/json')) {
      try {
        const data = await response.json();
        console.log(`API response data:`, data);
        
        if (!response.ok) {
          throw new Error((data as ApiResponse).message || `API request failed with status ${response.status}`);
        }
        
        // Special handling for array endpoints
        if (
          (endpoint === '/ingredients' || 
           endpoint === '/meals')
        ) {
          // If we expect an array but got something else
          if (!Array.isArray(data)) {
            console.warn(`Expected array response from ${endpoint} but got:`, typeof data);
            
            // Check if the data is wrapped in a property like 'items' or 'data'
            const possibleArrayProperties = ['ingredients', 'meals'];
            for (const prop of possibleArrayProperties) {
              if (data && typeof data === 'object' && Array.isArray(data[prop])) {
                console.log(`Found array in property '${prop}'`);
                return data[prop] as unknown as T;
              }
            }
            
            return [] as unknown as T;
          }
          
          // If we got a valid array, return it
          return data as unknown as T;
        }
        
        // Special handling for plans endpoint
        if (endpoint === '/plans') {
          console.log('Processing /plans response:', data);
          if (Array.isArray(data)) {
            return data as unknown as T;
          }
          if (data && typeof data === 'object' && Array.isArray(data.planDays)) {
            console.log('Found planDays array in response');
            return data.planDays as unknown as T;
          }
          return [] as unknown as T;
        }
        
        // Special handling for plan day endpoint
        if (endpoint.startsWith('/plans/') && endpoint !== '/plans/shopping-list') {
          console.log('Processing plan day response:', data);
          if (data && typeof data === 'object' && data.planDay) {
            console.log('Found planDay object in response');
            return data.planDay as unknown as T;
          }
        }
        
        // Special handling for shopping list endpoint
        if (endpoint === '/plans/shopping-list') {
          console.log('Processing shopping list response:', data);
          if (Array.isArray(data)) {
            return data as unknown as T;
          }
          if (data && typeof data === 'object' && Array.isArray(data.shoppingList)) {
            return data.shoppingList as unknown as T;
          }
          return [] as unknown as T;
        }
        
        // For non-array endpoints, return the data as is
        return data as unknown as T;
      } catch (e) {
        // JSON parsing failed
        console.error(`JSON parsing failed for ${endpoint}:`, e);
        if (
          endpoint === '/ingredients' || 
          endpoint === '/meals' || 
          endpoint === '/plans' ||
          endpoint === '/plans/shopping-list'
        ) {
          return [] as unknown as T;
        }
        if (response.ok) {
          return {} as T;
        } else {
          throw new Error('Invalid JSON response');
        }
      }
    } else if (response.ok) {
      // Non-JSON successful response
      console.warn(`Non-JSON response for ${endpoint}`);
      // For endpoints that should return arrays, return empty array
      if (
        endpoint === '/ingredients' || 
        endpoint === '/meals' || 
        endpoint === '/plans' ||
        endpoint === '/plans/shopping-list'
      ) {
        return [] as unknown as T;
      }
      return {} as T;
    } else {
      throw new Error(`Unexpected response type: ${contentType}`);
    }
  } catch (error) {
    // Handle network errors and other exceptions
    console.error(`API request to ${endpoint} failed:`, error);
    
    // For collection endpoints, return empty arrays on error
    if (
      endpoint === '/ingredients' || 
      endpoint === '/meals' || 
      endpoint === '/plans' ||
      endpoint === '/plans/shopping-list'
    ) {
      console.warn(`Returning empty array for failed ${endpoint} request`);
      return [] as unknown as T;
    }
    
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  register: async (name: string, email: string, password: string): Promise<User & { token: string }> => {
    const data = await apiFetch<ApiResponse & User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    
    if (data.token) {
      setToken(data.token);
    }
    
    return data as User & { token: string };
  },
  
  login: async (email: string, password: string): Promise<{ token: string }> => {
    const data = await apiFetch<ApiResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (data.token) {
      setToken(data.token);
    }
    
    return data as { token: string };
  },
  
  logout: () => {
    clearToken();
  },
  
  getCurrentUser: async (): Promise<User> => {
    return await apiFetch<User>('/auth/me');
  },
  
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean }> => {
    return await apiFetch<{ success: boolean }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }
};

// Ingredients APIs
export const ingredientAPI = {
  getAll: async (): Promise<Ingredient[]> => {
    return await apiFetch<Ingredient[]>('/ingredients');
  },
  
  getById: async (id: string): Promise<Ingredient> => {
    return await apiFetch<Ingredient>(`/ingredients/${id}`);
  },
  
  create: async (name: string): Promise<Ingredient> => {
    const request: CreateIngredientRequest = { name };
    return await apiFetch<Ingredient>('/ingredients', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  },
  
  update: async (id: string, name: string): Promise<Ingredient> => {
    const request: CreateIngredientRequest = { name };
    return await apiFetch<Ingredient>(`/ingredients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request)
    });
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    return await apiFetch<{ success: boolean }>(`/ingredients/${id}`, {
      method: 'DELETE'
    });
  }
};

// Meals APIs
export const mealAPI = {
  getAll: async (): Promise<Meal[]> => {
    return await apiFetch<Meal[]>('/meals');
  },
  
  getById: async (id: string): Promise<Meal> => {
    return await apiFetch<Meal>(`/meals/${id}`);
  },
  
  create: async (title: string, ingredients: MealIngredient[]): Promise<Meal> => {
    const request: CreateMealRequest = { title, ingredients };
    return await apiFetch<Meal>('/meals', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  },
  
  update: async (id: string, title: string, ingredients: MealIngredient[]): Promise<Meal> => {
    const request: CreateMealRequest = { title, ingredients };
    return await apiFetch<Meal>(`/meals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request)
    });
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    return await apiFetch<{ success: boolean }>(`/meals/${id}`, {
      method: 'DELETE'
    });
  }
};

// Meal Plan APIs
export const planAPI = {
  getAll: async (): Promise<PlanDay[]> => {
    return await apiFetch<PlanDay[]>('/plans');
  },
  
  updateDay: async (date: string, mealIds: string[]): Promise<PlanDay> => {
    return await apiFetch<PlanDay>(`/plans/${date}`, {
      method: 'PUT',
      body: JSON.stringify({ meals: mealIds })
    });
  },
  
  reset: async (): Promise<{ success: boolean }> => {
    return await apiFetch<{ success: boolean }>('/plans', {
      method: 'DELETE'
    });
  },
  
  getShoppingList: async (): Promise<GroceryItem[]> => {
    return await apiFetch<GroceryItem[]>('/plans/shopping-list');
  }
}; 
export interface Ingredient {
  ingredientId: string;
  userId?: string; // Optional on client side
  name: string;
  createdAt?: number; // Timestamp
  updatedAt?: number; // Timestamp
}

export interface MealIngredient {
  ingredientId: string;
  name: string;
  quantity: string; // e.g. "2 cups", "200g", etc.
}

export interface Meal {
  mealId: string;
  userId?: string; // Optional on client side
  title: string;
  ingredients: MealIngredient[];
  createdAt?: number; // Timestamp
  updatedAt?: number; // Timestamp
}

export interface PlanDay {
  userId?: string; // Optional on client side
  date: string; // ISO string format YYYY-MM-DD
  meals: string[]; // Meal IDs
  updatedAt?: number; // Timestamp
}

export interface GroceryItem {
  ingredientId: string;
  name: string;
  quantity: string;
}

export interface User {
  userId: string;
  email: string;
  name: string;
  createdAt?: number; // Timestamp
  updatedAt?: number; // Timestamp
}

// Request/Response types for API operations
export interface CreateIngredientRequest {
  name: string;
}

export interface CreateMealRequest {
  title: string;
  ingredients: MealIngredient[];
}

export interface UpdatePlanDayRequest {
  date?: string; // ISO string format YYYY-MM-DD
  meals: string[];
} 
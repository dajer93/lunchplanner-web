export interface Ingredient {
  id: string;
  name: string;
}

export interface MealIngredient {
  ingredientId: string;
  name: string;
  quantity: string; // e.g. "2 cups", "200g", etc.
}

export interface Meal {
  id: string;
  title: string;
  ingredients: MealIngredient[];
}

export interface PlanDay {
  date: string; // ISO string
  meals: string[]; // meal ids
}

export interface GroceryItem {
  ingredientId: string;
  name: string;
  quantity: string;
} 
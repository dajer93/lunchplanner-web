import { Ingredient, Meal, PlanDay, GroceryItem } from './types';
import { ingredientAPI, mealAPI, planAPI } from '../services/api';

let ingredients: Ingredient[] = [];
let meals: Meal[] = [];
let mealPlan: PlanDay[] = [];

// Initialize with today and next 6 days
const createEmptyPlan = () => {
  const plan: PlanDay[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    plan.push({
      date: date.toISOString().split('T')[0],
      meals: []
    });
  }
  
  return plan;
};

// Ingredient operations
export const getIngredients = async () => {
  try {
    const response = await ingredientAPI.getAll() as Ingredient[];
    ingredients = response;
    return [...ingredients];
  } catch (error) {
    console.error('Failed to fetch ingredients:', error);
    return [];
  }
};

export const addIngredient = async (name: string) => {
  try {
    const newIngredient = await ingredientAPI.create(name) as Ingredient;
    ingredients.push(newIngredient);
    return newIngredient;
  } catch (error) {
    console.error('Failed to add ingredient:', error);
    throw error;
  }
};

export const updateIngredient = async (id: string, name: string) => {
  try {
    const updatedIngredient = await ingredientAPI.update(id, name) as Ingredient;
    ingredients = ingredients.map(ing => ing.id === id ? updatedIngredient : ing);
    
    // Also update in meals
    meals = meals.map(meal => ({
      ...meal,
      ingredients: meal.ingredients.map(ingr => 
        ingr.ingredientId === id ? { ...ingr, name } : ingr
      )
    }));
    
    return updatedIngredient;
  } catch (error) {
    console.error('Failed to update ingredient:', error);
    throw error;
  }
};

export const deleteIngredient = async (id: string) => {
  try {
    await ingredientAPI.delete(id);
    ingredients = ingredients.filter(ing => ing.id !== id);
    
    // Also check if any meal uses this ingredient
    const mealWithIngredient = meals.find(meal => 
      meal.ingredients.some(ing => ing.ingredientId === id)
    );
    
    return { success: !mealWithIngredient, mealWithIngredient };
  } catch (error) {
    console.error('Failed to delete ingredient:', error);
    throw error;
  }
};

// Meal operations
export const getMeals = async () => {
  try {
    const response = await mealAPI.getAll() as Meal[];
    meals = response;
    return [...meals];
  } catch (error) {
    console.error('Failed to fetch meals:', error);
    return [];
  }
};

export const getMeal = async (id: string) => {
  try {
    return await mealAPI.getById(id) as Meal;
  } catch (error) {
    console.error(`Failed to fetch meal ${id}:`, error);
    return meals.find(meal => meal.id === id);
  }
};

export const addMeal = async (title: string, ingredients: { ingredientId: string, quantity: string }[]) => {
  try {
    const newMeal = await mealAPI.create(title, ingredients) as Meal;
    meals.push(newMeal);
    return newMeal;
  } catch (error) {
    console.error('Failed to add meal:', error);
    throw error;
  }
};

export const updateMeal = async (id: string, title: string, ingredients: { ingredientId: string, quantity: string }[]) => {
  try {
    const updatedMeal = await mealAPI.update(id, title, ingredients) as Meal;
    meals = meals.map(meal => meal.id === id ? updatedMeal : meal);
    return updatedMeal;
  } catch (error) {
    console.error(`Failed to update meal ${id}:`, error);
    throw error;
  }
};

export const deleteMeal = async (id: string) => {
  try {
    await mealAPI.delete(id);
    meals = meals.filter(meal => meal.id !== id);
    
    // Also remove from meal plan
    mealPlan = mealPlan.map(day => ({
      ...day,
      meals: day.meals.filter(mealId => mealId !== id)
    }));
    
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete meal ${id}:`, error);
    throw error;
  }
};

// Meal plan operations
export const getMealPlan = async () => {
  try {
    const response = await planAPI.getAll() as PlanDay[];
    mealPlan = response;
    return [...mealPlan];
  } catch (error) {
    console.error('Failed to fetch meal plan:', error);
    
    // If we don't have a plan yet, create an empty one
    if (mealPlan.length === 0) {
      mealPlan = createEmptyPlan();
    }
    
    return [...mealPlan];
  }
};

export const updateDayPlan = async (date: string, mealIds: string[]) => {
  try {
    const updatedDay = await planAPI.updateDay(date, mealIds) as PlanDay;
    mealPlan = mealPlan.map(day => 
      day.date === date ? updatedDay : day
    );
    
    return updatedDay;
  } catch (error) {
    console.error(`Failed to update plan for ${date}:`, error);
    
    // Update locally if API fails
    mealPlan = mealPlan.map(day => 
      day.date === date ? { ...day, meals: mealIds } : day
    );
    
    return mealPlan.find(day => day.date === date);
  }
};

export const resetMealPlan = async () => {
  try {
    await planAPI.reset();
    mealPlan = createEmptyPlan();
    return mealPlan;
  } catch (error) {
    console.error('Failed to reset meal plan:', error);
    mealPlan = createEmptyPlan();
    return mealPlan;
  }
};

// Shopping list operations
export const getShoppingList = async () => {
  try {
    return await planAPI.getShoppingList() as GroceryItem[];
  } catch (error) {
    console.error('Failed to fetch shopping list:', error);
    
    // Fallback to local calculation if API fails
    const shoppingMap = new Map<string, { name: string, quantity: string[] }>();
    
    mealPlan.forEach(day => {
      day.meals.forEach(mealId => {
        const meal = meals.find(m => m.id === mealId);
        if (meal) {
          meal.ingredients.forEach(ingredient => {
            if (shoppingMap.has(ingredient.ingredientId)) {
              shoppingMap.get(ingredient.ingredientId)?.quantity.push(ingredient.quantity);
            } else {
              shoppingMap.set(ingredient.ingredientId, {
                name: ingredient.name,
                quantity: [ingredient.quantity]
              });
            }
          });
        }
      });
    });
    
    return Array.from(shoppingMap.entries()).map(([ingredientId, { name, quantity }]) => ({
      ingredientId,
      name,
      quantity: quantity.join(', ')
    }));
  }
}; 
import { Ingredient, Meal, PlanDay, GroceryItem, MealIngredient } from './types';
import { ingredientAPI, mealAPI, planAPI } from '../services/api';

let ingredients: Ingredient[] = [];
let meals: Meal[] = [];
let mealPlan: PlanDay[] = [];

// Initialize with today and next 6 days
const createEmptyPlan = (): PlanDay[] => {
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
export const getIngredients = async (): Promise<Ingredient[]> => {
  console.log('getIngredients called');
  try {
    console.log('Calling ingredientAPI.getAll()');
    const response = await ingredientAPI.getAll();
    console.log('Response from ingredientAPI.getAll():', response);
    
    // Ensure we have a valid array to work with
    if (Array.isArray(response)) {
      ingredients = response;
      console.log('Ingredients stored in memory:', ingredients);
      return [...ingredients];
    } else {
      console.warn('Expected array response from getAll but got:', typeof response);
      ingredients = [];
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch ingredients:', error);
    return [];
  }
};

export const addIngredient = async (name: string): Promise<Ingredient> => {
  console.log('addIngredient called with name:', name);
  try {
    console.log('Calling ingredientAPI.create()');
    const newIngredient = await ingredientAPI.create(name);
    console.log('Response from ingredientAPI.create():', newIngredient);
    
    if (newIngredient) {
      console.log('Adding new ingredient to memory array');
      ingredients.push(newIngredient);
      console.log('Updated ingredients array:', ingredients);
    }
    return newIngredient;
  } catch (error) {
    console.error('Failed to add ingredient:', error);
    throw error;
  }
};

export const updateIngredient = async (id: string, name: string): Promise<Ingredient> => {
  try {
    const updatedIngredient = await ingredientAPI.update(id, name);
    if (updatedIngredient) {
      ingredients = ingredients.map(ing => ing.ingredientId === id ? updatedIngredient : ing);
      
      // Also update in meals
      meals = meals.map(meal => ({
        ...meal,
        ingredients: (meal.ingredients || []).map(ingr => 
          ingr.ingredientId === id ? { ...ingr, name } : ingr
        )
      }));
    }
    
    return updatedIngredient;
  } catch (error) {
    console.error('Failed to update ingredient:', error);
    throw error;
  }
};

export const deleteIngredient = async (id: string): Promise<{ success: boolean, mealWithIngredient?: Meal }> => {
  try {
    await ingredientAPI.delete(id);
    ingredients = ingredients.filter(ing => ing.ingredientId !== id);
    
    // Also check if any meal uses this ingredient
    const mealWithIngredient = meals.find(meal => 
      (meal.ingredients || []).some(ing => ing.ingredientId === id)
    );
    
    return { success: !mealWithIngredient, mealWithIngredient };
  } catch (error) {
    console.error('Failed to delete ingredient:', error);
    throw error;
  }
};

// Meal operations
export const getMeals = async (): Promise<Meal[]> => {
  try {
    const response = await mealAPI.getAll();
    // Ensure we have a valid array to work with
    if (Array.isArray(response)) {
      meals = response;
      return [...meals];
    } else {
      console.warn('Expected array response from getAll but got:', typeof response);
      meals = [];
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch meals:', error);
    return [];
  }
};

export const getMeal = async (id: string): Promise<Meal | null> => {
  try {
    const response = await mealAPI.getById(id);
    return response || null;
  } catch (error) {
    console.error(`Failed to fetch meal ${id}:`, error);
    return meals.find(meal => meal.mealId === id) || null;
  }
};

export const addMeal = async (title: string, ingredients: MealIngredient[]): Promise<Meal> => {
  try {
    const newMeal = await mealAPI.create(title, ingredients);
    if (newMeal) {
      meals.push(newMeal);
    }
    return newMeal;
  } catch (error) {
    console.error('Failed to add meal:', error);
    throw error;
  }
};

export const updateMeal = async (id: string, title: string, ingredients: MealIngredient[]): Promise<Meal> => {
  try {
    const updatedMeal = await mealAPI.update(id, title, ingredients);
    if (updatedMeal) {
      meals = meals.map(meal => meal.mealId === id ? updatedMeal : meal);
    }
    return updatedMeal;
  } catch (error) {
    console.error(`Failed to update meal ${id}:`, error);
    throw error;
  }
};

export const deleteMeal = async (id: string): Promise<{ success: boolean }> => {
  try {
    await mealAPI.delete(id);
    meals = meals.filter(meal => meal.mealId !== id);
    
    // Also remove from meal plan
    mealPlan = mealPlan.map(day => ({
      ...day,
      meals: (day.meals || []).filter(mealId => mealId !== id)
    }));
    
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete meal ${id}:`, error);
    throw error;
  }
};

// Meal plan operations
export const getMealPlan = async (): Promise<PlanDay[]> => {
  try {
    const response = await planAPI.getAll();
    console.log('API response for getMealPlan:', response);
    
    // Extract plan days array if it's wrapped in an object
    const planDaysResponse = 'planDays' in response ? (response as any).planDays : response;
    console.log('Plan days after extraction:', planDaysResponse);
    
    // Ensure we have a valid array to work with
    if (Array.isArray(planDaysResponse) && planDaysResponse.length > 0) {
      // If we got data from API, ensure it covers the next 7 days from today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const nextDays: Set<string> = new Set();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        nextDays.add(date.toISOString().split('T')[0]);
      }
      
      // Filter out old dates and add missing dates
      const filteredPlan = planDaysResponse.filter(day => nextDays.has(day.date));
      
      // Add missing days
      nextDays.forEach(dateStr => {
        if (!filteredPlan.some(day => day.date === dateStr)) {
          filteredPlan.push({
            date: dateStr,
            meals: []
          });
        }
      });
      
      // Sort by date
      filteredPlan.sort((a, b) => a.date.localeCompare(b.date));
      
      mealPlan = filteredPlan;
      return [...mealPlan];
    } else {
      console.warn('Expected array response from getAll but got:', typeof response);
      // If we don't have a plan yet, create an empty one
      mealPlan = createEmptyPlan();
      return [...mealPlan];
    }
  } catch (error) {
    console.error('Failed to fetch meal plan:', error);
    
    // Always create an empty plan with the next 7 days
    mealPlan = createEmptyPlan();
    return [...mealPlan];
  }
};

export const updateDayPlan = async (date: string, mealIds: string[]): Promise<PlanDay> => {
  try {
    const response = await planAPI.updateDay(date, mealIds);
    console.log('API response for updateDay:', response);
    
    // Extract the plan day from the response if it's wrapped
    // The API might return { planDay: PlanDay } or PlanDay directly
    const updatedDay = 'planDay' in response ? (response as any).planDay : response;
    console.log('Updated day after extraction:', updatedDay);
    
    if (updatedDay) {
      // Find and update the day in our local mealPlan array
      const existingDayIndex = mealPlan.findIndex(day => day.date === date);
      if (existingDayIndex >= 0) {
        mealPlan[existingDayIndex] = updatedDay;
      } else {
        // If the day doesn't exist in our plan, add it
        mealPlan.push(updatedDay);
        // Sort by date to maintain order
        mealPlan.sort((a, b) => a.date.localeCompare(b.date));
      }
    }
    
    return updatedDay;
  } catch (error) {
    console.error(`Failed to update plan for ${date}:`, error);
    
    // Create a new plan day object
    const newPlanDay: PlanDay = {
      date,
      meals: mealIds || []
    };
    
    // Update locally if API fails
    const existingDayIndex = mealPlan.findIndex(day => day.date === date);
    if (existingDayIndex >= 0) {
      mealPlan[existingDayIndex] = newPlanDay;
    } else {
      mealPlan.push(newPlanDay);
      // Sort by date to maintain order
      mealPlan.sort((a, b) => a.date.localeCompare(b.date));
    }
    
    return newPlanDay;
  }
};

export const resetMealPlan = async (): Promise<PlanDay[]> => {
  try {
    await planAPI.reset();
    // Always create a fresh plan with next 7 days
    mealPlan = createEmptyPlan();
    return [...mealPlan];
  } catch (error) {
    console.error('Failed to reset meal plan:', error);
    // If API call fails, still create a fresh plan
    mealPlan = createEmptyPlan();
    return [...mealPlan];
  }
};

// Shopping list operations
export const getShoppingList = async (): Promise<GroceryItem[]> => {
  try {
    const response = await planAPI.getShoppingList();
    return response || [];
  } catch (error) {
    console.error('Failed to fetch shopping list:', error);
    
    // Fallback to local calculation if API fails
    const shoppingMap = new Map<string, { name: string, quantity: string[] }>();
    
    // Make sure we're working with the latest meal plan and meals
    try {
      // Try to refresh the meal plan and meals data for accurate shopping list
      await getMealPlan();
      await getMeals();
    } catch (refreshError) {
      console.error('Error refreshing data for shopping list:', refreshError);
    }
    
    // Process each day in the meal plan
    mealPlan.forEach(day => {
      // Ensure meals property exists and is an array
      const dayMeals = day?.meals || [];
      
      dayMeals.forEach(mealId => {
        const meal = meals.find(m => m.mealId === mealId);
        if (meal) {
          // Ensure ingredients property exists and is an array
          const mealIngredients = meal?.ingredients || [];
          
          mealIngredients.forEach(ingredient => {
            if (!ingredient?.ingredientId || !ingredient?.name) return;
            
            if (shoppingMap.has(ingredient.ingredientId)) {
              const item = shoppingMap.get(ingredient.ingredientId);
              if (item) {
                item.quantity.push(ingredient.quantity || '');
              }
            } else {
              shoppingMap.set(ingredient.ingredientId, {
                name: ingredient.name,
                quantity: [ingredient.quantity || '']
              });
            }
          });
        }
      });
    });
    
    return Array.from(shoppingMap.entries()).map(([ingredientId, { name, quantity }]) => ({
      ingredientId,
      name,
      quantity: quantity.filter(q => q).join(', ') || 'as needed'
    }));
  }
}; 
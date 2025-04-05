'use client';

import { useState, useEffect } from 'react';
import { Meal, Ingredient, MealIngredient } from '@/models/types';
import { getMeals, getIngredients, addMeal, updateMeal, deleteMeal } from '@/models/store';

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [mealTitle, setMealTitle] = useState('');
  const [mealIngredients, setMealIngredients] = useState<MealIngredient[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Load meals and ingredients on component mount
    const loadData = async () => {
      setLoading(true);
      try {
        const mealsData = await getMeals() as Meal[];
        setMeals(mealsData);
        
        const ingredientsData = await getIngredients() as Ingredient[];
        setIngredients(ingredientsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const resetForm = () => {
    setMealTitle('');
    setMealIngredients([]);
    setSelectedMeal(null);
    setIsEditing(false);
    setShowForm(false);
    setError('');
  };
  
  const handleAddNewClick = () => {
    resetForm();
    setShowForm(true);
  };
  
  const handleEditClick = (meal: Meal) => {
    setSelectedMeal(meal);
    setMealTitle(meal.title);
    setMealIngredients([...meal.ingredients]);
    setIsEditing(true);
    setShowForm(true);
  };
  
  const handleAddIngredientToMeal = () => {
    const newIngredient: MealIngredient = {
      ingredientId: '',
      name: '',
      quantity: ''
    };
    setMealIngredients([...mealIngredients, newIngredient]);
  };
  
  const handleIngredientChange = (index: number, field: 'ingredientId' | 'quantity', value: string) => {
    const updatedIngredients = [...mealIngredients];
    
    if (field === 'ingredientId') {
      const selectedIngredient = ingredients.find(ing => ing.id === value);
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        ingredientId: value,
        name: selectedIngredient?.name || ''
      };
    } else {
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        [field]: value
      };
    }
    
    setMealIngredients(updatedIngredients);
  };
  
  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = [...mealIngredients];
    updatedIngredients.splice(index, 1);
    setMealIngredients(updatedIngredients);
  };
  
  const handleSubmit = async () => {
    if (!mealTitle.trim()) {
      setError('Meal title cannot be empty');
      return;
    }
    
    if (mealIngredients.length === 0) {
      setError('Meal must have at least one ingredient');
      return;
    }
    
    // Validate all ingredients have an id and quantity
    const invalidIngredient = mealIngredients.find(
      ing => !ing.ingredientId || !ing.quantity.trim()
    );
    
    if (invalidIngredient) {
      setError('All ingredients must have a selected ingredient and quantity');
      return;
    }
    
    setLoading(true);
    try {
      if (isEditing && selectedMeal) {
        await updateMeal(
          selectedMeal.id,
          mealTitle.trim(),
          mealIngredients.map(ing => ({ ingredientId: ing.ingredientId, quantity: ing.quantity.trim() }))
        );
      } else {
        await addMeal(
          mealTitle.trim(),
          mealIngredients.map(ing => ({ ingredientId: ing.ingredientId, quantity: ing.quantity.trim() }))
        );
      }
      
      const updatedMeals = await getMeals();
      setMeals(updatedMeals);
      resetForm();
    } catch (err) {
      console.error('Error saving meal:', err);
      setError('Failed to save meal. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteMeal = async (id: string) => {
    if (confirm('Are you sure you want to delete this meal?')) {
      setLoading(true);
      try {
        await deleteMeal(id);
        const updatedMeals = await getMeals();
        setMeals(updatedMeals);
      } catch (err) {
        console.error('Error deleting meal:', err);
        setError('Failed to delete meal. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  return (
    <div>
      <h1>Meals</h1>
      <p className="mb-4">Create and manage your meals with ingredients.</p>
      
      {error && (
        <div className="card" style={{ backgroundColor: '#ffebee', marginBottom: '1rem' }}>
          <p style={{ color: 'var(--error-color)' }}>{error}</p>
        </div>
      )}
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2>Meals List</h2>
          <button onClick={handleAddNewClick} disabled={loading}>Add New Meal</button>
        </div>
        
        {showForm && (
          <div className="card" style={{ backgroundColor: '#f5f5f5' }}>
            <h3>{isEditing ? 'Edit Meal' : 'Add New Meal'}</h3>
            <div className="mb-4">
              <label htmlFor="mealTitle">Meal Title</label>
              <input
                id="mealTitle"
                type="text"
                value={mealTitle}
                onChange={(e) => setMealTitle(e.target.value)}
                placeholder="Enter meal title"
                disabled={loading}
              />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <h4>Ingredients</h4>
                <button 
                  className="secondary" 
                  onClick={handleAddIngredientToMeal}
                  disabled={loading}
                >
                  Add Ingredient
                </button>
              </div>
              
              {mealIngredients.length === 0 ? (
                <p>No ingredients added yet.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {mealIngredients.map((ingredient, index) => (
                    <li key={index} className="flex gap-2 mb-2">
                      <select
                        value={ingredient.ingredientId}
                        onChange={(e) => handleIngredientChange(index, 'ingredientId', e.target.value)}
                        style={{ flex: 2 }}
                        disabled={loading}
                      >
                        <option value="">Select an ingredient</option>
                        {ingredients.map((ing) => (
                          <option key={ing.id} value={ing.id}>
                            {ing.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={ingredient.quantity}
                        onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                        placeholder="Quantity (e.g., '2 cups')"
                        style={{ flex: 1, marginBottom: 0 }}
                        disabled={loading}
                      />
                      <button 
                        style={{ backgroundColor: 'var(--error-color)' }}
                        onClick={() => handleRemoveIngredient(index)}
                        disabled={loading}
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="flex gap-2">
              <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Saving...' : isEditing ? 'Update Meal' : 'Create Meal'}
              </button>
              <button className="secondary" onClick={resetForm} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {loading && meals.length === 0 ? (
          <p>Loading meals...</p>
        ) : meals.length === 0 ? (
          <p>No meals created yet.</p>
        ) : (
          <div className="grid">
            {meals.map((meal) => (
              <div key={meal.id} className="card">
                <h3>{meal.title}</h3>
                <h4>Ingredients:</h4>
                <ul style={{ marginBottom: '1rem' }}>
                  {meal.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      {ingredient.name}: {ingredient.quantity}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <button 
                    className="secondary" 
                    onClick={() => handleEditClick(meal)}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button 
                    style={{ backgroundColor: 'var(--error-color)' }}
                    onClick={() => handleDeleteMeal(meal.id)}
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
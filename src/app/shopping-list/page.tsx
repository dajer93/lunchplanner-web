'use client';

import { useState, useEffect } from 'react';
import { GroceryItem, PlanDay, Meal } from '@/models/types';
import { getShoppingList, getMealPlan, getMeals } from '@/models/store';

export default function ShoppingListPage() {
  const [shoppingList, setShoppingList] = useState<GroceryItem[]>([]);
  const [mealPlan, setMealPlan] = useState<PlanDay[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load shopping list, meal plan, and meals on component mount
    const loadData = async () => {
      setLoading(true);
      try {
        const shoppingListData = await getShoppingList() as GroceryItem[];
        setShoppingList(shoppingListData);
        
        const planData = await getMealPlan() as PlanDay[];
        setMealPlan(planData);
        
        const mealsData = await getMeals() as Meal[];
        setMeals(mealsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const toggleItem = (ingredientId: string) => {
    setCheckedItems({
      ...checkedItems,
      [ingredientId]: !checkedItems[ingredientId]
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getMealTitles = (mealIds: string[]) => {
    return mealIds.map(id => meals.find(meal => meal.id === id)?.title || 'Unknown meal');
  };

  const printShoppingList = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shopping List</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { margin-bottom: 20px; }
          ul { padding-left: 20px; }
          li { margin-bottom: 8px; }
        </style>
      </head>
      <body>
        <h1>Shopping List</h1>
        <ul>
          ${shoppingList
            .map(item => `<li>${item.name}: ${item.quantity}</li>`)
            .join('')}
        </ul>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <h1>Shopping List</h1>
      <p className="mb-4">Based on your meal plan, here&apos;s what you need to buy.</p>
      
      {error && (
        <div className="card" style={{ backgroundColor: '#ffebee', marginBottom: '1rem' }}>
          <p style={{ color: 'var(--error-color)' }}>{error}</p>
        </div>
      )}
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2>Your Shopping List</h2>
          <button 
            onClick={printShoppingList}
            disabled={loading || shoppingList.length === 0}
          >
            Print List
          </button>
        </div>
        
        {loading ? (
          <p>Loading shopping list...</p>
        ) : shoppingList.length === 0 ? (
          <div>
            <p>Your shopping list is empty. Add meals to your meal plan first.</p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {shoppingList.map((item) => (
              <li 
                key={item.ingredientId}
                className="flex items-center gap-2 p-4"
                style={{ 
                  borderBottom: '1px solid var(--border-color)',
                  textDecoration: checkedItems[item.ingredientId] ? 'line-through' : 'none',
                  opacity: checkedItems[item.ingredientId] ? 0.5 : 1,
                }}
              >
                <input
                  type="checkbox"
                  checked={!!checkedItems[item.ingredientId]}
                  onChange={() => toggleItem(item.ingredientId)}
                  style={{ width: 'auto', marginBottom: 0 }}
                />
                <div>
                  <strong>{item.name}:</strong> {item.quantity}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="card mt-4">
        <h2>Meal Plan Summary</h2>
        {loading ? (
          <p>Loading meal plan...</p>
        ) : mealPlan.filter(day => day.meals.length > 0).length === 0 ? (
          <p>No meals planned yet.</p>
        ) : (
          <ul>
            {mealPlan.map((day) => (
              day.meals.length > 0 && (
                <li key={day.date} style={{ marginBottom: '10px' }}>
                  <strong>{formatDate(day.date)}:</strong>{' '}
                  {getMealTitles(day.meals).join(', ')}
                </li>
              )
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 
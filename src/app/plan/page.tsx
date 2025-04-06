'use client';

import { useState, useEffect, useCallback } from 'react';
import { Meal, PlanDay } from '@/models/types';
import { getMeals, getMealPlan, updateDayPlan, resetMealPlan } from '@/models/store';
import AuthLayout from '@/components/Layout';

export default function PlanPage() {
  const [mealPlan, setMealPlan] = useState<PlanDay[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Create a reusable load data function with useCallback
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Loading meals and plan data');
      const mealsData = await getMeals();
      console.log('Loaded meals:', mealsData);
      setMeals(mealsData);
      
      const planData = await getMealPlan();
      console.log('Loaded meal plan:', planData);
      setMealPlan(planData);
      setError('');
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDayClick = (day: PlanDay) => {
    setSelectedDay(day.date);
    // Ensure meals is always an array
    setSelectedMeals(Array.isArray(day.meals) ? [...day.meals] : []);
    setShowModal(true);
  };

  const handleSaveDayPlan = async () => {
    if (selectedDay) {
      setLoading(true);
      try {
        console.log('Saving meal plan for day:', selectedDay, 'with meals:', selectedMeals);
        const result = await updateDayPlan(selectedDay, selectedMeals);
        console.log('Saved meal plan result:', result);
        // Use the loadData function to refresh data
        await loadData();
        setShowModal(false);
      } catch (err) {
        console.error('Error updating plan:', err);
        setError('Failed to update meal plan. Please try again.');
        setLoading(false);
      }
    }
  };

  const handleResetPlan = async () => {
    if (confirm('Are you sure you want to reset the entire meal plan?')) {
      setLoading(true);
      try {
        await resetMealPlan();
        // Use the loadData function to refresh data
        await loadData();
      } catch (err) {
        console.error('Error resetting plan:', err);
        setError('Failed to reset meal plan. Please try again.');
        setLoading(false);
      }
    }
  };

  const handleMealSelection = (mealId: string) => {
    if (selectedMeals.includes(mealId)) {
      setSelectedMeals(selectedMeals.filter(id => id !== mealId));
    } else {
      setSelectedMeals([...selectedMeals, mealId]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDayMeals = (dayMealIds: string[]) => {
    console.log('Getting meals for day with IDs:', dayMealIds);
    console.log('Available meals:', meals);
    
    if (!Array.isArray(dayMealIds)) {
      console.error('dayMealIds is not an array:', dayMealIds);
      return 'Invalid meal data';
    }
    
    if (dayMealIds.length === 0) {
      return 'No meals planned';
    }
    
    const mealNames = dayMealIds.map(id => {
      const foundMeal = meals.find(meal => meal.mealId === id);
      if (!foundMeal) {
        console.warn(`Meal not found for ID: ${id}`);
        return 'Unknown meal';
      }
      return foundMeal.title;
    });
    
    return mealNames.join(', ');
  };

  return (
    <AuthLayout>
      <div>
        <h1>Meal Plan</h1>
        <p className="mb-4">Plan your meals for the upcoming days.</p>
        
        {error && (
          <div className="card" style={{ backgroundColor: '#ffebee', marginBottom: '1rem' }}>
            <p style={{ color: 'var(--error-color)' }}>{error}</p>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <h2>Weekly Plan</h2>
          <div className="flex gap-2">
            <button 
              className="secondary"
              onClick={() => loadData()}
              disabled={loading}
              title="Refresh meal plan data"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button 
              onClick={handleResetPlan} 
              style={{ backgroundColor: 'var(--error-color)' }}
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Plan'}
            </button>
          </div>
        </div>
        
        <div className="card">
          {loading && mealPlan.length === 0 ? (
            <p>Loading meal plan...</p>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {mealPlan.length === 0 ? (
                <p>No meal plan available. Click "Edit" to start planning your meals.</p>
              ) : (
                mealPlan.map((day) => (
                  <div 
                    key={day.date} 
                    className="card" 
                    style={{ 
                      cursor: 'pointer',
                      border: '1px solid var(--border-color)',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => handleDayClick(day)}
                  >
                    <h3 style={{ 
                      borderBottom: '1px solid var(--border-color)', 
                      paddingBottom: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      {formatDate(day.date)}
                    </h3>
                    {(!day.meals || day.meals.length === 0) ? (
                      <p style={{ color: '#888' }}>No meals planned</p>
                    ) : (
                      <div>
                        <p className="mb-2">
                          <strong>{day.meals.length}</strong> meal{day.meals.length !== 1 ? 's' : ''} planned
                        </p>
                        <p>{getDayMeals(day.meals)}</p>
                      </div>
                    )}
                    <div className="text-right mt-4">
                      <button className="secondary" disabled={loading}>Edit</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
        {showModal && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}
          >
            <div 
              className="card" 
              style={{ 
                maxWidth: '500px', 
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Select Meals for {selectedDay && formatDate(selectedDay)}</h2>
              
              <div className="mb-4" style={{ marginTop: '1rem' }}>
                {meals.length === 0 ? (
                  <p>No meals available. Create some meals first.</p>
                ) : (
                  <div>
                    {meals.map((meal) => (
                      <div 
                        key={meal.mealId}
                        className="flex items-center gap-2 mb-2"
                      >
                        <input
                          type="checkbox"
                          id={`meal-${meal.mealId}`}
                          checked={selectedMeals.includes(meal.mealId)}
                          onChange={() => handleMealSelection(meal.mealId)}
                          style={{ width: 'auto', marginBottom: 0 }}
                          disabled={loading}
                        />
                        <label htmlFor={`meal-${meal.mealId}`}>{meal.title}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-between mt-4">
                <button 
                  className="secondary" 
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveDayPlan}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { Meal, PlanDay } from '@/models/types';
import { getMeals, getMealPlan, updateDayPlan, resetMealPlan } from '@/models/store';

export default function PlanPage() {
  const [mealPlan, setMealPlan] = useState<PlanDay[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load meals and meal plan on component mount
    const loadData = async () => {
      setLoading(true);
      try {
        const mealsData = await getMeals() as Meal[];
        setMeals(mealsData);
        
        const planData = await getMealPlan() as PlanDay[];
        setMealPlan(planData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleDayClick = (day: PlanDay) => {
    setSelectedDay(day.date);
    setSelectedMeals([...day.meals]);
    setShowModal(true);
  };

  const handleSaveDayPlan = async () => {
    if (selectedDay) {
      setLoading(true);
      try {
        await updateDayPlan(selectedDay, selectedMeals);
        const updatedPlan = await getMealPlan();
        setMealPlan(updatedPlan);
        setShowModal(false);
      } catch (err) {
        console.error('Error updating plan:', err);
        setError('Failed to update meal plan. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResetPlan = async () => {
    if (confirm('Are you sure you want to reset the entire meal plan?')) {
      setLoading(true);
      try {
        await resetMealPlan();
        const updatedPlan = await getMealPlan();
        setMealPlan(updatedPlan);
      } catch (err) {
        console.error('Error resetting plan:', err);
        setError('Failed to reset meal plan. Please try again.');
      } finally {
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
    return dayMealIds.map(id => meals.find(meal => meal.id === id)?.title || 'Unknown meal').join(', ');
  };

  return (
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
        <button 
          onClick={handleResetPlan} 
          style={{ backgroundColor: 'var(--error-color)' }}
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Plan'}
        </button>
      </div>
      
      <div className="card">
        {loading && mealPlan.length === 0 ? (
          <p>Loading meal plan...</p>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {mealPlan.map((day) => (
              <div 
                key={day.date} 
                className="card" 
                style={{ cursor: 'pointer' }}
                onClick={() => handleDayClick(day)}
              >
                <h3>{formatDate(day.date)}</h3>
                {day.meals.length === 0 ? (
                  <p style={{ color: '#888' }}>No meals planned</p>
                ) : (
                  <p>{getDayMeals(day.meals)}</p>
                )}
                <div className="text-right mt-4">
                  <button className="secondary" disabled={loading}>Edit</button>
                </div>
              </div>
            ))}
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
                      key={meal.id}
                      className="flex items-center gap-2 mb-2"
                    >
                      <input
                        type="checkbox"
                        id={`meal-${meal.id}`}
                        checked={selectedMeals.includes(meal.id)}
                        onChange={() => handleMealSelection(meal.id)}
                        style={{ width: 'auto', marginBottom: 0 }}
                        disabled={loading}
                      />
                      <label htmlFor={`meal-${meal.id}`}>{meal.title}</label>
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
  );
} 
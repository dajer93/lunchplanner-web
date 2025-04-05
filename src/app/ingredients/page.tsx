'use client';

import { useState, useEffect } from 'react';
import { Ingredient } from '@/models/types';
import { getIngredients, addIngredient, updateIngredient, deleteIngredient } from '@/models/store';
import AuthLayout from '@/components/Layout';

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load ingredients on component mount
    const fetchIngredients = async () => {
      setLoading(true);
      try {
        const data = await getIngredients();
        setIngredients(data);
      } catch (err) {
        setError('Failed to load ingredients');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  const handleAddIngredient = async () => {
    if (!newIngredientName.trim()) {
      setError('Ingredient name cannot be empty');
      return;
    }
    
    setLoading(true);
    try {
      await addIngredient(newIngredientName.trim());
      const updatedIngredients = await getIngredients();
      setIngredients(updatedIngredients);
      setNewIngredientName('');
      setError('');
    } catch (err) {
      setError('Failed to add ingredient');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (ingredient: Ingredient) => {
    setEditingId(ingredient.id);
    setEditName(ingredient.name);
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setError('');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) {
      setError('Ingredient name cannot be empty');
      return;
    }
    
    setLoading(true);
    try {
      await updateIngredient(id, editName.trim());
      const updatedIngredients = await getIngredients();
      setIngredients(updatedIngredients);
      setEditingId(null);
      setError('');
    } catch (err) {
      setError('Failed to update ingredient');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIngredient = async (id: string) => {
    setLoading(true);
    try {
      const result = await deleteIngredient(id);
      
      if (!result.success) {
        setError(`Cannot delete ingredient that is used in meal: ${result.mealWithIngredient?.title}`);
        return;
      }
      
      const updatedIngredients = await getIngredients();
      setIngredients(updatedIngredients);
      setError('');
    } catch (err) {
      setError('Failed to delete ingredient');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        <h1>Ingredients</h1>
        <p className="mb-4">Manage your ingredients database.</p>

        {error && (
          <div className="card" style={{ backgroundColor: '#ffebee', marginBottom: '1rem' }}>
            <p style={{ color: 'var(--error-color)' }}>{error}</p>
          </div>
        )}
        
        <div className="card">
          <h2>Add New Ingredient</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newIngredientName}
              onChange={(e) => setNewIngredientName(e.target.value)}
              placeholder="Enter ingredient name"
              style={{ marginBottom: 0 }}
              disabled={loading}
            />
            <button onClick={handleAddIngredient} disabled={loading}>
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
        
        <div className="card">
          <h2>Ingredients List</h2>
          {loading && ingredients.length === 0 ? (
            <p>Loading ingredients...</p>
          ) : ingredients.length === 0 ? (
            <p>No ingredients added yet.</p>
          ) : (
            <ul style={{ listStyle: 'none' }}>
              {ingredients.map((ingredient) => (
                <li 
                  key={ingredient.id} 
                  className="flex justify-between items-center"
                  style={{ 
                    padding: '0.75rem 0', 
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  {editingId === ingredient.id ? (
                    <div className="flex gap-2" style={{ width: '100%' }}>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={{ marginBottom: 0 }}
                        disabled={loading}
                      />
                      <button 
                        onClick={() => handleSaveEdit(ingredient.id)}
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        className="secondary"
                        onClick={handleCancelEdit}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>{ingredient.name}</span>
                      <div className="flex gap-2">
                        <button 
                          className="secondary" 
                          onClick={() => handleStartEdit(ingredient)}
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button 
                          style={{ backgroundColor: 'var(--error-color)' }}
                          onClick={() => handleDeleteIngredient(ingredient.id)}
                          disabled={loading}
                        >
                          {loading ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AuthLayout>
  );
} 
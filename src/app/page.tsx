'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/Layout';
import { authAPI } from '@/services/api';
import { User } from '@/models/types';

export default function Home() {
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authAPI.getCurrentUser();
        setUserName(userData.name || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUser();
  }, []);

  return (
    <AuthLayout>
      <div>
        <h1>Welcome, {userName || 'User'}!</h1>
        <p className="mb-4">This is your personal lunch planning application.</p>
        
        <div className="grid" style={{ 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          <div className="card">
            <h2>Ingredients</h2>
            <p>Manage your ingredient database.</p>
            <Link href="/ingredients">
              <button style={{ width: '100%', marginTop: '1rem' }}>Go to Ingredients</button>
            </Link>
          </div>
          
          <div className="card">
            <h2>Meals</h2>
            <p>Create and manage your meal recipes.</p>
            <Link href="/meals">
              <button style={{ width: '100%', marginTop: '1rem' }}>Go to Meals</button>
            </Link>
          </div>
          
          <div className="card">
            <h2>Meal Plan</h2>
            <p>Plan your meals for the week.</p>
            <Link href="/plan">
              <button style={{ width: '100%', marginTop: '1rem' }}>Go to Meal Plan</button>
            </Link>
          </div>
          
          <div className="card">
            <h2>Shopping List</h2>
            <p>Generate a shopping list from your meal plan.</p>
            <Link href="/shopping-list">
              <button style={{ width: '100%', marginTop: '1rem' }}>Go to Shopping List</button>
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

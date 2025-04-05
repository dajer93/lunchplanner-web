'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authAPI } from '@/services/api';

export default function Navigation() {
  const pathname = usePathname();

  const handleLogout = () => {
    authAPI.logout();
    window.location.href = '/login';
  };

  return (
    <header className="p-4" style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container flex justify-between items-center">
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>🍽️ Lunch Planner</h1>
        <nav>
          <ul className="flex gap-4" style={{ listStyle: 'none', margin: 0 }}>
            <li>
              <Link 
                href="/" 
                style={{ 
                  fontWeight: pathname === '/' ? 'bold' : 'normal',
                  textDecoration: pathname === '/' ? 'underline' : 'none'
                }}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/ingredients"
                style={{ 
                  fontWeight: pathname === '/ingredients' ? 'bold' : 'normal',
                  textDecoration: pathname === '/ingredients' ? 'underline' : 'none'
                }}
              >
                Ingredients
              </Link>
            </li>
            <li>
              <Link 
                href="/meals"
                style={{ 
                  fontWeight: pathname === '/meals' ? 'bold' : 'normal',
                  textDecoration: pathname === '/meals' ? 'underline' : 'none'
                }}
              >
                Meals
              </Link>
            </li>
            <li>
              <Link 
                href="/plan"
                style={{ 
                  fontWeight: pathname === '/plan' ? 'bold' : 'normal',
                  textDecoration: pathname === '/plan' ? 'underline' : 'none'
                }}
              >
                Meal Plan
              </Link>
            </li>
            <li>
              <Link 
                href="/shopping-list"
                style={{ 
                  fontWeight: pathname === '/shopping-list' ? 'bold' : 'normal',
                  textDecoration: pathname === '/shopping-list' ? 'underline' : 'none'
                }}
              >
                Shopping List
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="link-button"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 
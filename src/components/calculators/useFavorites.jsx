import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'mep_calculator_favorites';
const HISTORY_KEY = 'mep_calculator_history';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        setFavorites([]);
      }
    }
  }, []);

  const toggleFavorite = (slug) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (slug) => favorites.includes(slug);

  return { favorites, toggleFavorite, isFavorite };
}

export function useHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        setHistory([]);
      }
    }
  }, []);

  const addToHistory = (slug) => {
    setHistory(prev => {
      const newHistory = [slug, ...prev.filter(s => s !== slug)].slice(0, 10);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  return { history, addToHistory };
}
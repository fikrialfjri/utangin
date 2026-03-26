import { useState, useEffect, useCallback } from 'react';

const FILTER_KEY = 'utangin_hide_paid_transactions';

export const useGlobalFilter = () => {
  const [hidePaid, setHidePaid] = useState<boolean>(() => {
    return localStorage.getItem(FILTER_KEY) === 'true';
  });

  const toggleHidePaid = useCallback((value?: boolean) => {
    const newValue = value ?? localStorage.getItem(FILTER_KEY) !== 'true';
    localStorage.setItem(FILTER_KEY, String(newValue));
    setHidePaid(newValue);
    window.dispatchEvent(new Event('utangin_filter_change'));
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setHidePaid(localStorage.getItem(FILTER_KEY) === 'true');
    };
    
    window.addEventListener('utangin_filter_change', handleStorageChange);
    // Also listen to standard storage event for cross-tab sync
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('utangin_filter_change', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { hidePaid, toggleHidePaid };
};

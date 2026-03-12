import { useState, useEffect } from 'react';

export default function useAuth() {
  const [user, setUser] = useState(null);
  
  // Placeholder logic
  useEffect(() => {
    setUser({ name: 'Test User', role: 'patient' });
  }, []);

  return { user };
}
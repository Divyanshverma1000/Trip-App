import { useState, useContext, useCallback } from 'react';
import { AuthContext } from '../navigation/AppNavigator';
import { getMyTrips, Trip } from '../lib/trips';

export const useTrips = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myTrips, setMyTrips] = useState<Trip[]>([]);
  const { user } = useContext(AuthContext);

  const fetchMyTrips = useCallback(async () => {
    console.log('useTrips hook: Starting fetch with user:', user);
    if (!user?.id) {
      console.error('useTrips hook: No user ID found');
      setError('User not authenticated');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      console.log('useTrips hook: Calling getMyTrips with userId:', user.id);
      const trips = await getMyTrips(user.id);
      console.log('useTrips hook: Received trips:', trips);
      setMyTrips(trips);
    } catch (err: any) {
      console.error('useTrips hook error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    myTrips,
    loading,
    error,
    fetchMyTrips
  };
}; 
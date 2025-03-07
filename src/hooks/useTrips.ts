import { useState, useContext } from 'react';
import { AuthContext } from '../navigation/AppNavigator';
import { getMyTrips, Trip } from '../lib/trips';

export const useTrips = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myTrips, setMyTrips] = useState<Trip[]>([]);
  const { user } = useContext(AuthContext);

  const fetchMyTrips = async () => {
    if (!user?._id) return;
    
    setLoading(true);
    setError(null);
    try {
      const trips = await getMyTrips();
      setMyTrips(trips);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    myTrips,
    loading,
    error,
    fetchMyTrips
  };
}; 
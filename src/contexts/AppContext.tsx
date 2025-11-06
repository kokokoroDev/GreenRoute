import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

// Types for the app
export interface User {
  id: string;
  username: string;
  email: string;
  walletId: string;
  ecoMiles: number;
  totalCO2Saved: number;
  streak: number;
  badges: string[];
  isDemo: boolean;
}

export interface Trip {
  id: string;
  userId: string;
  mode: 'walking' | 'cycling' | 'e-scooter';
  distance: number; // in meters
  duration: number; // in minutes
  averageSpeed: number; // km/h
  maxSpeed: number;
  co2Saved: number;
  ecoMilesEarned: number;
  multiplier: number;
  status: 'active' | 'completed' | 'rejected';
  startTime: Date;
  endTime?: Date;
  gpsRoute: Array<{ lat: number; lng: number; timestamp: Date }>;
  hcsHash?: string;
  rejectionReason?: string;
}

export interface LeaderboardEntry {
  user: User;
  rank: number;
  co2Saved: number;
}

interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  currentTrip: Trip | null;
  trips: Trip[];
  leaderboard: LeaderboardEntry[];
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, username: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  startDemo: () => void;
  startTrip: (mode: Trip['mode']) => void;
  stopTrip: () => void;
  fetchTrips: () => Promise<void>;
  fetchLeaderboard: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Demo data
const demoUser: User = {
  id: 'demo-user',
  username: 'EcoWarrior',
  email: 'demo@greenroutes.com',
  walletId: '0x1234...demo',
  ecoMiles: 2847,
  totalCO2Saved: 15.6,
  streak: 7,
  badges: ['first-km', 'eco-champion', 'weekly-warrior'],
  isDemo: true,
};

const demoTrips: Trip[] = [
  {
    id: 'demo-trip-1',
    userId: 'demo-user',
    mode: 'walking',
    distance: 1200,
    duration: 15,
    averageSpeed: 4.8,
    maxSpeed: 6.2,
    co2Saved: 0.24,
    ecoMilesEarned: 120,
    multiplier: 1.5,
    status: 'completed',
    startTime: new Date(Date.now() - 86400000),
    endTime: new Date(Date.now() - 86400000 + 900000),
    gpsRoute: [],
    hcsHash: 'hcs_demo_hash_1'
  },
  {
    id: 'demo-trip-2',
    userId: 'demo-user',
    mode: 'cycling',
    distance: 3500,
    duration: 12,
    averageSpeed: 17.5,
    maxSpeed: 25.0,
    co2Saved: 0.87,
    ecoMilesEarned: 350,
    multiplier: 1.2,
    status: 'completed',
    startTime: new Date(Date.now() - 172800000),
    endTime: new Date(Date.now() - 172800000 + 720000),
    gpsRoute: [],
    hcsHash: 'hcs_demo_hash_2'
  },
  {
    id: 'demo-trip-3',
    userId: 'demo-user',
    mode: 'cycling',
    distance: 500,
    duration: 8,
    averageSpeed: 45.0,
    maxSpeed: 60.0,
    co2Saved: 0,
    ecoMilesEarned: 0,
    multiplier: 0,
    status: 'rejected',
    startTime: new Date(Date.now() - 259200000),
    endTime: new Date(Date.now() - 259200000 + 480000),
    gpsRoute: [],
    rejectionReason: 'Speed profile inconsistent with cycling mode'
  }
];

const demoLeaderboard: LeaderboardEntry[] = [
  { user: { ...demoUser, username: 'GreenMachine', totalCO2Saved: 28.4 }, rank: 1, co2Saved: 28.4 },
  { user: { ...demoUser, username: 'EcoWarrior', totalCO2Saved: 15.6 }, rank: 2, co2Saved: 15.6 },
  { user: { ...demoUser, username: 'CyclingSara', totalCO2Saved: 12.8 }, rank: 3, co2Saved: 12.8 },
  { user: { ...demoUser, username: 'WalkingTom', totalCO2Saved: 9.2 }, rank: 4, co2Saved: 9.2 },
  { user: { ...demoUser, username: 'EcoFriend', totalCO2Saved: 7.1 }, rank: 5, co2Saved: 7.1 },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  // Trip validation logic
  const validateTrip = (trip: Trip): { valid: boolean; reason?: string } => {
    // Minimum duration check
    if (trip.duration < 2) {
      return { valid: false, reason: 'Trip too short (minimum 2 minutes)' };
    }

    // Minimum distance check
    if (trip.distance < 100) {
      return { valid: false, reason: 'Trip too short (minimum 100 meters)' };
    }

    // Speed validation by mode
    const speedLimits = {
      walking: { max: 7, maxInstant: 15 },
      cycling: { max: 35, maxInstant: 50 },
      'e-scooter': { max: 35, maxInstant: 50 }
    };

    const limits = speedLimits[trip.mode];
    if (trip.averageSpeed > limits.max || trip.maxSpeed > limits.maxInstant) {
      return { valid: false, reason: `Speed profile inconsistent with ${trip.mode} mode` };
    }

    return { valid: true };
  };

  const calculateRewards = (trip: Trip): { co2Saved: number; ecoMiles: number; multiplier: number } => {
    // Base CO2 calculation (kg saved per km)
    const baseCO2PerKm = 0.2; // 200g CO2 per km saved vs car
    const co2Saved = (trip.distance / 1000) * baseCO2PerKm;

    // Mode multipliers
    const multipliers = {
      walking: 1.5,
      cycling: 1.2,
      'e-scooter': 1.0
    };

    const multiplier = multipliers[trip.mode];
    const adjustedCO2 = co2Saved * multiplier;
    const ecoMiles = Math.round(adjustedCO2 * 1000); // 1000 EcoMiles per kg CO2

    return { co2Saved: adjustedCO2, ecoMiles, multiplier };
  };

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setIsAuthenticated(!!session);

        if (session?.user) {
          // Clear demo mode when real user logs in
          setTrips([]);
          setLeaderboard([]);
          setCurrentTrip(null);
          // Defer any Supabase calls to avoid deadlocks
          setTimeout(() => {
            fetchUserProfile(session.user);
          }, 0);
        } else {
          setUser(null);
        }
        // Do not block UI on profile fetch
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthenticated(!!session);
      if (session?.user) {
        // Clear demo mode when restoring real user session
        setTrips([]);
        setLeaderboard([]);
        setCurrentTrip(null);
        // Defer profile fetch to avoid blocking
        setTimeout(() => {
          fetchUserProfile(session.user);
        }, 0);
      }
      // Always resolve loading after session check
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (error) throw error;

      if (profile) {
        setUser({
          id: profile.user_id,
          username: profile.username,
          email: authUser.email || '',
          walletId: profile.wallet_id || '',
          ecoMiles: profile.eco_miles,
          totalCO2Saved: parseFloat(profile.total_co2_saved.toString()) || 0,
          streak: profile.streak,
          badges: [], // Will be populated separately
          isDemo: false,
        });
        
        // Fetch user badges
        await fetchUserBadges(authUser.id);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const checkAndAwardBadges = async (userId: string, trip: Trip) => {
    if (!user) return;

    const badges: string[] = [];

    // First trip badge
    if (trips.length === 0) {
      badges.push('first-trip');
    }

    // Distance milestones
    const totalDistance = trips.reduce((sum, t) => sum + t.distance, 0) + trip.distance;
    const distanceMilestones = [10000, 50000, 100000]; // 10km, 50km, 100km
    distanceMilestones.forEach(milestone => {
      if (totalDistance >= milestone) {
        badges.push(`distance-${milestone}m`);
      }
    });

    // Streak milestones
    const streakMilestones = [7, 30, 100]; // 7 days, 30 days, 100 days
    streakMilestones.forEach(milestone => {
      if (user.streak + 1 === milestone) {
        badges.push(`streak-${milestone}`);
      }
    });

    // CO2 saved milestones
    const co2Milestones = [10, 50, 100]; // 10kg, 50kg, 100kg
    co2Milestones.forEach(milestone => {
      if (user.totalCO2Saved + trip.co2Saved >= milestone) {
        badges.push(`co2-saved-${milestone}kg`);
      }
    });

    // Award new badges
    for (const badgeId of badges) {
      try {
        const { error } = await supabase
          .from('user_badges')
          .insert({
            user_id: userId,
            badge_id: badgeId
          });

        if (!error) {
          toast({
            title: "New Badge Earned! 🏆",
            description: `You've earned the ${badgeId.replace(/-/g, ' ')} badge!`,
            variant: "default"
          });

          // Update local badges state
          setUser(prev => prev ? {
            ...prev,
            badges: [...prev.badges, badgeId]
          } : null);
        }
      } catch (error) {
        console.error(`Error awarding badge ${badgeId}:`, error);
      }
    }
  };

  const fetchUserBadges = async (userId: string) => {
    try {
      const { data: badges, error } = await supabase
        .from('user_badges')
        .select('badge_id, earned_at')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) throw error;

      if (badges) {
        const badgeIds = badges.map(b => b.badge_id);
        setUser(prev => prev ? {
          ...prev,
          badges: badgeIds
        } : null);
        return badgeIds;
      }
      return [];
    } catch (error) {
      console.error('Error fetching badges:', error);
      return [];
    }
  };

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error: any) {
      return { error: error.message || 'Login failed' };
    }
  };

  const signup = async (email: string, username: string, password: string): Promise<{ error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: username,
          }
        }
      });

      if (error) {
        return { error: error.message };
      }

      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
        variant: "default"
      });

      return {};
    } catch (error: any) {
      return { error: error.message || 'Signup failed' };
    }
  };

  const logout = async () => {
    try {
      // Check if we're in demo mode (user exists but no session)
      const isInDemoMode = user?.isDemo === true;
      
      if (!isInDemoMode) {
        await supabase.auth.signOut();
      }
      
      // Reset all state regardless of demo or real user
      setUser(null);
      setIsAuthenticated(false);
      setCurrentTrip(null);
      setTrips([]);
      setLeaderboard([]);
      setSession(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const startDemo = () => {
    // Clear any existing auth state first
    setSession(null);
    setUser(demoUser);
    setTrips(demoTrips);
    setLeaderboard(demoLeaderboard);
    setIsAuthenticated(true);
  };

  const startTrip = (mode: Trip['mode']) => {
    if (!user) return;

    const newTrip: Trip = {
      id: 'trip-' + Date.now(),
      userId: user.id,
      mode,
      distance: 0,
      duration: 0,
      averageSpeed: 0,
      maxSpeed: 0,
      co2Saved: 0,
      ecoMilesEarned: 0,
      multiplier: 0,
      status: 'active',
      startTime: new Date(),
      gpsRoute: [],
    };

    setCurrentTrip(newTrip);
  };

  const stopTrip = async () => {
    if (!currentTrip || !user || user.isDemo) return;

    // Mock trip completion with simulated data
    const mockDistance = 800 + Math.random() * 2000; // 0.8-2.8 km
    const mockDuration = 8 + Math.random() * 20; // 8-28 minutes
    const mockMaxSpeed = currentTrip.mode === 'walking' ? 4 + Math.random() * 2 : 15 + Math.random() * 15;
    const mockAvgSpeed = (mockDistance / 1000) / (mockDuration / 60);

    const completedTrip: Trip = {
      ...currentTrip,
      distance: mockDistance,
      duration: mockDuration,
      averageSpeed: mockAvgSpeed,
      maxSpeed: mockMaxSpeed,
      endTime: new Date(),
    };

    // Validate trip
    const validation = validateTrip(completedTrip);
    
    if (validation.valid) {
      const rewards = calculateRewards(completedTrip);
      completedTrip.co2Saved = rewards.co2Saved;
      completedTrip.ecoMilesEarned = rewards.ecoMiles;
      completedTrip.multiplier = rewards.multiplier;
      completedTrip.status = 'completed';
      
      try {
        // Format dates and data for database insertion
        const tripData = {
          user_id: user.id,
          mode: completedTrip.mode,
          distance: Number(completedTrip.distance.toFixed(2)),
          duration: Math.round(completedTrip.duration),
          average_speed: Number(completedTrip.averageSpeed.toFixed(2)),
          max_speed: Number(completedTrip.maxSpeed.toFixed(2)),
          co2_saved: Number(completedTrip.co2Saved.toFixed(4)),
          eco_miles_earned: Math.round(completedTrip.ecoMilesEarned),
          multiplier: Number(completedTrip.multiplier.toFixed(2)),
          status: completedTrip.status,
          start_time: completedTrip.startTime.toISOString(),
          end_time: completedTrip.endTime?.toISOString(),
          gps_route: JSON.stringify(completedTrip.gpsRoute.map(point => ({
            lat: point.lat,
            lng: point.lng,
            timestamp: point.timestamp.toISOString()
          }))),
          created_at: new Date().toISOString()
        };

        // Store trip in database with error handling
        const { data: savedTripData, error: tripError } = await supabase
          .from('trips')
          .insert(tripData)
          .select()
          .single();

        if (tripError) throw tripError;

        // Update user stats in database
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            eco_miles: user.ecoMiles + rewards.ecoMiles,
            total_co2_saved: user.totalCO2Saved + rewards.co2Saved,
            streak: user.streak + 1,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (profileError) throw profileError;

        // Check and award badges
        await checkAndAwardBadges(user.id, completedTrip);

        // Update local state
        setUser(prev => prev ? {
          ...prev,
          ecoMiles: prev.ecoMiles + rewards.ecoMiles,
          totalCO2Saved: prev.totalCO2Saved + rewards.co2Saved,
          streak: prev.streak + 1,
        } : null);

        // Add trip to local state
        if (savedTripData) {
          setTrips(prev => [{ ...completedTrip, id: savedTripData.id }, ...prev]);
        }

        toast({
          title: "Trip completed! 🎉",
          description: `You earned ${rewards.ecoMiles} EcoMiles!`,
          variant: "default"
        });

      } catch (error: any) {
        console.error('Error saving trip:', error);
        let errorMessage = "Your trip was completed but there was an error saving it.";
        
        if (error?.message) {
          errorMessage += ` Error: ${error.message}`;
        }
        
        if (error?.details) {
          console.error('Detailed error:', error.details);
        }
        
        toast({
          title: "Error saving trip",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } else {
      completedTrip.status = 'rejected';
      completedTrip.rejectionReason = validation.reason;
      
      // Store rejected trip
      if (!user.isDemo) {
        try {
          const rejectedTripData = {
            user_id: user.id,
            mode: completedTrip.mode,
            distance: Number(completedTrip.distance.toFixed(2)),
            duration: Math.round(completedTrip.duration),
            average_speed: Number(completedTrip.averageSpeed.toFixed(2)),
            max_speed: Number(completedTrip.maxSpeed.toFixed(2)),
            status: 'rejected',
            rejection_reason: completedTrip.rejectionReason,
            start_time: completedTrip.startTime.toISOString(),
            end_time: completedTrip.endTime?.toISOString(),
            gps_route: JSON.stringify(completedTrip.gpsRoute.map(point => ({
              lat: point.lat,
              lng: point.lng,
              timestamp: point.timestamp.toISOString()
            }))),
            co2_saved: 0,
            eco_miles_earned: 0,
            multiplier: 0,
            created_at: new Date().toISOString()
          };

          const { error } = await supabase
            .from('trips')
            .insert(rejectedTripData);
        } catch (error) {
          console.error('Error saving rejected trip:', error);
        }
      }

      toast({
        title: "Trip rejected",
        description: completedTrip.rejectionReason,
        variant: "destructive"
      });
    }

    setCurrentTrip(null);
  };

  const fetchTrips = async () => {
    if (!user || user.isDemo) {
      if (user?.isDemo) setTrips(demoTrips);
      return;
    }

    try {
      const { data: tripsData, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTrips: Trip[] = tripsData?.map(trip => ({
        id: trip.id,
        userId: trip.user_id,
        mode: trip.mode as Trip['mode'],
        distance: parseFloat(trip.distance.toString()),
        duration: trip.duration,
        averageSpeed: parseFloat(trip.average_speed.toString()),
        maxSpeed: parseFloat(trip.max_speed.toString()),
        co2Saved: parseFloat(trip.co2_saved.toString()),
        ecoMilesEarned: trip.eco_miles_earned,
        multiplier: parseFloat(trip.multiplier.toString()),
        status: trip.status as Trip['status'],
        startTime: new Date(trip.start_time),
        endTime: trip.end_time ? new Date(trip.end_time) : undefined,
        gpsRoute: Array.isArray(trip.gps_route) ? trip.gps_route as any[] : [],
        hcsHash: trip.hcs_hash || undefined,
        rejectionReason: trip.rejection_reason || undefined,
      })) || [];

      setTrips(formattedTrips);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  const fetchLeaderboard = async () => {
    if (user?.isDemo) {
      setLeaderboard(demoLeaderboard);
      return;
    }

    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('total_co2_saved', { ascending: false })
        .limit(10);

      if (profilesError) throw profilesError;

      // Fetch badges for all users in the leaderboard
      const userBadges: { [key: string]: string[] } = {};
      for (const profile of profiles || []) {
        const { data: badges } = await supabase
          .from('user_badges')
          .select('badge_id')
          .eq('user_id', profile.user_id);
        userBadges[profile.user_id] = badges?.map(b => b.badge_id) || [];
      }

      const leaderboardData: LeaderboardEntry[] = profiles?.map((profile, index) => ({
        user: {
          id: profile.user_id,
          username: profile.username,
          email: '', // Don't expose emails in leaderboard
          walletId: profile.wallet_id || '',
          ecoMiles: profile.eco_miles,
          totalCO2Saved: parseFloat(profile.total_co2_saved.toString()) || 0,
          streak: profile.streak,
          badges: userBadges[profile.user_id] || [],
          isDemo: false,
        },
        rank: index + 1,
        co2Saved: parseFloat(profile.total_co2_saved.toString()) || 0,
      })) || [];

      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      currentTrip,
      trips,
      leaderboard,
      isAuthenticated,
      loading,
      login,
      signup,
      logout,
      startDemo,
      startTrip,
      stopTrip,
      fetchTrips,
      fetchLeaderboard,
    }}>
      {children}
    </AppContext.Provider>
  );
};
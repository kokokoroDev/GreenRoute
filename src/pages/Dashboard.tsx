import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import Navigation from "@/components/Navigation";
import { 
  Play, 
  Leaf, 
  Coins, 
  Trophy, 
  Target, 
  TrendingUp,
  Calendar,
  Award
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, currentTrip, trips, fetchTrips, loading, isAuthenticated } = useApp();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/');
      return;
    }
    if (user) {
      fetchTrips();
    }
  }, [isAuthenticated, user, navigate, fetchTrips, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // If authenticated but profile not loaded yet, show a quick placeholder
    if (isAuthenticated) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      );
    }
    return null;
  }

  const recentTrips = trips.slice(0, 3);
  const streakProgress = (user.streak % 7) * (100 / 7);
  const nextBadgeProgress = 65; // Mock progress to next badge

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, {user.username}! 👋
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Ready to make a positive impact today?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-stat p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total CO₂ Saved</p>
                <p className="text-3xl font-bold text-success">
                  {user.totalCO2Saved.toFixed(1)} kg
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-success/20 to-primary/20 rounded-xl">
                <Leaf className="h-8 w-8 text-success" />
              </div>
            </div>
          </Card>

          <Card className="card-stat p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">EcoMiles Balance</p>
                <p className="text-3xl font-bold text-primary">
                  {user.ecoMiles.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl">
                <Coins className="h-8 w-8 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="card-stat p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-3xl font-bold text-accent">
                  {user.streak} days
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-accent/20 to-warning/20 rounded-xl">
                <Target className="h-8 w-8 text-accent" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trip Actions */}
          <Card className="card-eco p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Play className="mr-3 h-6 w-6" />
              Start Your Journey
            </h2>
            
            {currentTrip ? (
              <div className="space-y-4">
                <div className="text-center">
                  <Badge className="trip-active text-lg px-4 py-2 mb-4">
                    Trip in Progress - {currentTrip.mode}
                  </Badge>
                  <p className="text-muted-foreground mb-6">
                    GPS tracking active. End your trip when you reach your destination.
                  </p>
                </div>
                <Button 
                  className="w-full btn-reward text-lg py-6"
                  onClick={() => navigate('/trip')}
                >
                  View Active Trip
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground mb-6">
                  Choose your sustainable transport mode and start earning EcoMiles!
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    className="btn-eco py-4 text-left justify-start"
                    onClick={() => navigate('/trip')}
                  >
                    <div className="flex items-center w-full">
                      <div className="mr-4">🚶‍♂️</div>
                      <div>
                        <div className="font-semibold">Walking</div>
                        <div className="text-sm opacity-90">1.5x multiplier</div>
                      </div>
                    </div>
                  </Button>
                  <Button 
                    className="btn-eco py-4 text-left justify-start"
                    onClick={() => navigate('/trip')}
                  >
                    <div className="flex items-center w-full">
                      <div className="mr-4">🚴‍♂️</div>
                      <div>
                        <div className="font-semibold">Cycling</div>
                        <div className="text-sm opacity-90">1.2x multiplier</div>
                      </div>
                    </div>
                  </Button>
                  <Button 
                    className="btn-eco py-4 text-left justify-start"
                    onClick={() => navigate('/trip')}
                  >
                    <div className="flex items-center w-full">
                      <div className="mr-4">🛴</div>
                      <div>
                        <div className="font-semibold">E-Scooter</div>
                        <div className="text-sm opacity-90">1.0x multiplier</div>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Progress & Achievements */}
          <div className="space-y-6">
            {/* Streak Progress */}
            <Card className="card-eco p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Weekly Streak
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Days completed this week</span>
                  <span>{user.streak % 7}/7</span>
                </div>
                <Progress 
                  value={streakProgress} 
                  className="h-3"
                />
                <p className="text-xs text-muted-foreground">
                  Complete 7 days for a streak bonus multiplier!
                </p>
              </div>
            </Card>

            {/* Next Badge Progress */}
            <Card className="card-eco p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Next Achievement
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>CO₂ Champion (25kg saved)</span>
                  <span>{nextBadgeProgress}%</span>
                </div>
                <Progress 
                  value={nextBadgeProgress} 
                  className="h-3"
                />
                <p className="text-xs text-muted-foreground">
                  {(25 - user.totalCO2Saved).toFixed(1)}kg more to unlock this badge
                </p>
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="py-6 flex-col h-auto"
                onClick={() => navigate('/leaderboard')}
              >
                <Trophy className="h-6 w-6 mb-2" />
                <span>Leaderboard</span>
              </Button>
              <Button 
                variant="outline" 
                className="py-6 flex-col h-auto"
                onClick={() => navigate('/badges')}
              >
                <Award className="h-6 w-6 mb-2" />
                <span>Badges</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Trips */}
        {recentTrips.length > 0 && (
          <Card className="card-eco p-6 mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <TrendingUp className="mr-3 h-6 w-6" />
                Recent Activity
              </h2>
              <Button variant="ghost" onClick={() => navigate('/profile')}>
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentTrips.map((trip) => (
                <div 
                  key={trip.id} 
                  className={`p-4 rounded-lg border-2 ${
                    trip.status === 'completed' ? 'trip-completed' : 
                    trip.status === 'rejected' ? 'trip-rejected' : 'trip-active'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {trip.mode === 'walking' ? '🚶‍♂️' : 
                           trip.mode === 'cycling' ? '🚴‍♂️' : '🛴'}
                        </span>
                        <span className="font-semibold capitalize">{trip.mode}</span>
                        <Badge 
                          variant={trip.status === 'completed' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {trip.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {trip.distance > 0 ? `${(trip.distance / 1000).toFixed(1)}km` : '0km'} • 
                        {trip.duration > 0 ? ` ${trip.duration}min` : ' 0min'}
                        {trip.status === 'completed' && (
                          <> • +{trip.ecoMilesEarned} EcoMiles</>
                        )}
                      </p>
                      {trip.status === 'rejected' && trip.rejectionReason && (
                        <p className="text-xs text-destructive">
                          {trip.rejectionReason}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      {new Date(trip.startTime).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
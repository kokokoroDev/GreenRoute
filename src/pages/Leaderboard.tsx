import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import Navigation from "@/components/Navigation";
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  Users,
  Crown,
  ChevronLeft,
  Leaf,
  Coins
} from "lucide-react";

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user, leaderboard, fetchLeaderboard } = useApp();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchLeaderboard();
  }, [user, navigate, fetchLeaderboard]);

  if (!user) return null;

  const userRank = leaderboard.findIndex(entry => entry.user.id === user.id) + 1;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />;
      default:
        return <div className="h-6 w-6 flex items-center justify-center text-sm font-bold">{rank}</div>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "rank-gold";
      case 2:
        return "rank-silver";
      case 3:
        return "rank-bronze";
      default:
        return "bg-card";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-eco rounded-2xl shadow-eco">
                <Trophy className="h-12 w-12 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Global Leaderboard</h1>
              <p className="text-muted-foreground">
                See how you rank among eco-warriors worldwide
              </p>
            </div>
          </div>
        </div>

        {/* User's Rank Card */}
        {userRank > 0 && (
          <Card className="card-eco p-6 mb-8 border-2 border-primary/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${getRankStyle(userRank)}`}>
                  {getRankIcon(userRank)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">Your Rank</h3>
                  <p className="text-muted-foreground">
                    #{userRank} out of {leaderboard.length} eco-warriors
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-success">
                  {user.totalCO2Saved.toFixed(1)} kg CO₂
                </div>
                <div className="text-sm text-muted-foreground">
                  {user.ecoMiles.toLocaleString()} EcoMiles
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Leaderboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-stat p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold text-primary">
                  {leaderboard.length}
                </p>
              </div>
              <div className="p-3 bg-primary/20 rounded-xl">
                <Users className="h-8 w-8 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="card-stat p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Community CO₂ Saved</p>
                <p className="text-3xl font-bold text-success">
                  {leaderboard.reduce((sum, entry) => sum + entry.co2Saved, 0).toFixed(1)} kg
                </p>
              </div>
              <div className="p-3 bg-success/20 rounded-xl">
                <Leaf className="h-8 w-8 text-success" />
              </div>
            </div>
          </Card>

          <Card className="card-stat p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total EcoMiles</p>
                <p className="text-3xl font-bold text-accent">
                  {leaderboard.reduce((sum, entry) => sum + entry.user.ecoMiles, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-accent/20 rounded-xl">
                <Coins className="h-8 w-8 text-accent" />
              </div>
            </div>
          </Card>
        </div>

        {/* Top 3 Podium */}
        <Card className="card-eco p-8 mb-8">
          <h2 className="text-2xl font-bold text-center mb-8">🏆 Top Eco-Warriors 🏆</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaderboard.slice(0, 3).map((entry, index) => (
              <div key={entry.user.id} className="text-center space-y-4">
                <div className={`p-6 rounded-2xl ${getRankStyle(entry.rank)} mx-auto max-w-xs`}>
                  <div className="space-y-3">
                    <Avatar className="h-16 w-16 mx-auto">
                      <AvatarFallback className="text-2xl">
                        {entry.user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg">{entry.user.username}</h3>
                      <div className="flex justify-center mt-2">
                        {getRankIcon(entry.rank)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-success">
                    {entry.co2Saved.toFixed(1)} kg
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {entry.user.ecoMiles.toLocaleString()} EcoMiles
                  </div>
                  <div className="flex justify-center space-x-1">
                    {entry.user.badges.slice(0, 3).map((badge, badgeIndex) => (
                      <Badge key={badgeIndex} variant="secondary" className="text-xs px-2 py-1">
                        🏅
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Full Leaderboard */}
        <Card className="card-eco p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <TrendingUp className="mr-3 h-6 w-6" />
              Full Rankings
            </h2>
            <Badge variant="secondary" className="text-sm">
              Updated in real-time
            </Badge>
          </div>

          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div 
                key={entry.user.id}
                className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
                  entry.user.id === user.id 
                    ? 'border-primary bg-primary/5 shadow-eco' 
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      entry.rank <= 3 ? getRankStyle(entry.rank) : 'bg-muted'
                    } min-w-[3rem] flex justify-center`}>
                      {getRankIcon(entry.rank)}
                    </div>

                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {entry.user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="font-semibold text-lg flex items-center">
                        {entry.user.username}
                        {entry.user.id === user.id && (
                          <Badge variant="secondary" className="ml-2 text-xs">You</Badge>
                        )}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Streak: {entry.user.streak} days</span>
                        <span>•</span>
                        <span>{entry.user.badges.length} badges</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-xl font-bold text-success">
                      {entry.co2Saved.toFixed(1)} kg
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {entry.user.ecoMiles.toLocaleString()} EcoMiles
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Multiplier Info */}
        <Card className="card-eco p-6 mt-8">
          <h3 className="text-xl font-bold mb-4">🎯 Ranking Multipliers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
              <div className="text-2xl mb-2">🚶‍♂️</div>
              <div className="font-semibold">Walking</div>
              <div className="text-success font-bold">1.5x multiplier</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
              <div className="text-2xl mb-2">🚴‍♂️</div>
              <div className="font-semibold">Cycling</div>
              <div className="text-success font-bold">1.2x multiplier</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
              <div className="text-2xl mb-2">🛴</div>
              <div className="font-semibold">E-Scooter</div>
              <div className="text-success font-bold">1.0x multiplier</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
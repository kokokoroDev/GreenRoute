import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { 
  Award, 
  Star, 
  Target, 
  Zap,
  ChevronLeft,
  Lock,
  CheckCircle,
  TrendingUp
} from "lucide-react";

interface BadgeData {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'distance' | 'streak' | 'special' | 'environmental';
  requirement: string;
  progress?: number;
  unlocked: boolean;
  multiplierBonus?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const Badges = () => {
  const navigate = useNavigate();
  const { user, setUser } = useApp();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Fetch user badges when the component mounts
    const fetchBadges = async () => {
      try {
        const { data: badges, error } = await supabase
          .from('user_badges')
          .select('badge_id, earned_at')
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false });

        if (error) throw error;

        // Update user badges in context
        setUser(prev => prev ? {
          ...prev,
          badges: badges.map(b => b.badge_id)
        } : null);
      } catch (error) {
        console.error('Error fetching badges:', error);
      }
    };

    fetchBadges();
  }, [user, navigate]);

  if (!user) return null;

  // Define all available badges
  const badges: BadgeData[] = [
    // Distance Badges
    {
      id: 'first-km',
      name: 'First Steps',
      description: 'Complete your first 1km of sustainable transport',
      emoji: '👣',
      category: 'distance',
      requirement: '1km total',
      progress: 100,
      unlocked: user.badges.includes('first-km'),
      rarity: 'common'
    },
    {
      id: 'distance-5km',
      name: '5K Champion',
      description: 'Travel 5km using sustainable transport',
      emoji: '🏃‍♂️',
      category: 'distance',
      requirement: '5km total',
      progress: Math.min(100, (user.totalCO2Saved * 5) * 100 / 5), // Rough calculation
      unlocked: user.badges.includes('distance-5km'),
      rarity: 'common'
    },
    {
      id: 'distance-marathon',
      name: 'Marathon Walker',
      description: 'Walk the equivalent of a marathon (42km)',
      emoji: '🏃',
      category: 'distance',
      requirement: '42km walking',
      progress: Math.min(100, (user.totalCO2Saved * 3) * 100 / 42),
      unlocked: user.badges.includes('distance-marathon'),
      rarity: 'rare'
    },
    
    // Streak Badges
    {
      id: 'weekly-warrior',
      name: 'Weekly Warrior',
      description: 'Maintain a 7-day sustainable transport streak',
      emoji: '🔥',
      category: 'streak',
      requirement: '7 day streak',
      progress: Math.min(100, (user.streak / 7) * 100),
      unlocked: user.badges.includes('weekly-warrior'),
      multiplierBonus: 0.1,
      rarity: 'common'
    },
    {
      id: 'streak-master',
      name: 'Streak Master',
      description: 'Achieve a 30-day sustainable transport streak',
      emoji: '🔥🔥',
      category: 'streak',
      requirement: '30 day streak',
      progress: Math.min(100, (user.streak / 30) * 100),
      unlocked: user.badges.includes('streak-master'),
      multiplierBonus: 0.2,
      rarity: 'epic'
    },
    
    // Environmental Badges
    {
      id: 'eco-champion',
      name: 'Eco Champion',
      description: 'Save 10kg of CO₂ emissions',
      emoji: '🌱',
      category: 'environmental',
      requirement: '10kg CO₂ saved',
      progress: Math.min(100, (user.totalCO2Saved / 10) * 100),
      unlocked: user.badges.includes('eco-champion'),
      multiplierBonus: 0.15,
      rarity: 'rare'
    },
    {
      id: 'carbon-crusher',
      name: 'Carbon Crusher',
      description: 'Save 25kg of CO₂ emissions',
      emoji: '💪',
      category: 'environmental',
      requirement: '25kg CO₂ saved',
      progress: Math.min(100, (user.totalCO2Saved / 25) * 100),
      unlocked: user.badges.includes('carbon-crusher'),
      multiplierBonus: 0.25,
      rarity: 'epic'
    },
    {
      id: 'planet-protector',
      name: 'Planet Protector',
      description: 'Save 100kg of CO₂ emissions',
      emoji: '🌍',
      category: 'environmental',
      requirement: '100kg CO₂ saved',
      progress: Math.min(100, (user.totalCO2Saved / 100) * 100),
      unlocked: user.badges.includes('planet-protector'),
      multiplierBonus: 0.5,
      rarity: 'legendary'
    },
    
    // Special Badges
    {
      id: 'early-adopter',
      name: 'Early Adopter',
      description: 'One of the first 1000 users of GreenRoutes',
      emoji: '🚀',
      category: 'special',
      requirement: 'Top 1000 users',
      progress: user.isDemo ? 100 : 0,
      unlocked: user.badges.includes('early-adopter'),
      rarity: 'legendary'
    },
    {
      id: 'validator',
      name: 'Validation Master',
      description: 'Complete 50 verified trips without rejection',
      emoji: '✅',
      category: 'special',
      requirement: '50 verified trips',
      progress: Math.min(100, (user.totalCO2Saved * 10) * 100 / 50), // Rough estimate
      unlocked: user.badges.includes('validator'),
      rarity: 'rare'
    }
  ];

  const categories = [
    { id: 'distance', name: 'Distance', icon: Target, color: 'text-blue-500' },
    { id: 'streak', name: 'Consistency', icon: Zap, color: 'text-yellow-500' },
    { id: 'environmental', name: 'Environmental', icon: Star, color: 'text-green-500' },
    { id: 'special', name: 'Special', icon: Award, color: 'text-purple-500' }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);
  const totalMultiplierBonus = unlockedBadges.reduce((sum, badge) => sum + (badge.multiplierBonus || 0), 0);

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
                <Award className="h-12 w-12 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Achievement Badges</h1>
              <p className="text-muted-foreground">
                Unlock rewards and multipliers for your eco-friendly journeys
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-stat p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
                <p className="text-3xl font-bold text-success">
                  {unlockedBadges.length}
                </p>
              </div>
              <div className="p-3 bg-success/20 rounded-xl">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </div>
          </Card>

          <Card className="card-stat p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Badges</p>
                <p className="text-3xl font-bold text-primary">
                  {badges.length}
                </p>
              </div>
              <div className="p-3 bg-primary/20 rounded-xl">
                <Award className="h-8 w-8 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="card-stat p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="text-3xl font-bold text-accent">
                  {Math.round((unlockedBadges.length / badges.length) * 100)}%
                </p>
              </div>
              <div className="p-3 bg-accent/20 rounded-xl">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="card-stat p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bonus Multiplier</p>
                <p className="text-3xl font-bold text-warning">
                  +{(totalMultiplierBonus * 100).toFixed(0)}%
                </p>
              </div>
              <div className="p-3 bg-warning/20 rounded-xl">
                <Zap className="h-8 w-8 text-warning" />
              </div>
            </div>
          </Card>
        </div>

        {/* Unlocked Badges */}
        {unlockedBadges.length > 0 && (
          <Card className="card-eco p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <CheckCircle className="mr-3 h-6 w-6 text-success" />
              Unlocked Achievements ({unlockedBadges.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unlockedBadges.map((badge) => (
                <div 
                  key={badge.id}
                  className={`badge-unlocked p-6 rounded-lg border-2 ${getRarityColor(badge.rarity)}`}
                >
                  <div className="text-center space-y-4">
                    <div className="text-4xl">{badge.emoji}</div>
                    <div>
                      <h3 className="font-bold text-lg">{badge.name}</h3>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs mt-1 ${
                          badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                          badge.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                          badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {badge.rarity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {badge.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      {badge.requirement}
                    </div>
                    {badge.multiplierBonus && (
                      <Badge variant="default" className="text-xs">
                        +{(badge.multiplierBonus * 100).toFixed(0)}% Bonus
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Locked Badges by Category */}
        {categories.map((category) => {
          const categoryBadges = lockedBadges.filter(b => b.category === category.id);
          if (categoryBadges.length === 0) return null;

          const CategoryIcon = category.icon;

          return (
            <Card key={category.id} className="card-eco p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <CategoryIcon className={`mr-3 h-6 w-6 ${category.color}`} />
                {category.name} Goals ({categoryBadges.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryBadges.map((badge) => (
                  <div 
                    key={badge.id}
                    className={`badge-locked p-6 rounded-lg border-2 ${getRarityColor(badge.rarity)}`}
                  >
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <div className="text-4xl opacity-30">{badge.emoji}</div>
                        <Lock className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-muted-foreground">{badge.name}</h3>
                        <Badge 
                          variant="outline" 
                          className={`text-xs mt-1 ${
                            badge.rarity === 'legendary' ? 'border-yellow-300 text-yellow-600' :
                            badge.rarity === 'epic' ? 'border-purple-300 text-purple-600' :
                            badge.rarity === 'rare' ? 'border-blue-300 text-blue-600' :
                            'border-gray-300 text-gray-600'
                          }`}
                        >
                          {badge.rarity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {badge.description}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {badge.requirement}
                      </div>
                      {badge.progress !== undefined && (
                        <div className="space-y-2">
                          <Progress value={badge.progress} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            {badge.progress.toFixed(0)}% complete
                          </div>
                        </div>
                      )}
                      {badge.multiplierBonus && (
                        <Badge variant="outline" className="text-xs">
                          +{(badge.multiplierBonus * 100).toFixed(0)}% Bonus
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}

        {/* Badge System Info */}
        <Card className="card-eco p-6">
          <h3 className="text-xl font-bold mb-4">🎯 How Badges Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Rarity Levels</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span>Common - Basic achievements</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-300 rounded"></div>
                  <span>Rare - Significant milestones</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-300 rounded"></div>
                  <span>Epic - Major accomplishments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-300 rounded"></div>
                  <span>Legendary - Ultimate goals</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Multiplier Bonuses</h4>
              <div className="space-y-2 text-sm">
                <p>• Badges provide permanent EcoMiles multipliers</p>
                <p>• Stack multiple badges for bigger bonuses</p>
                <p>• Higher rarity = higher multiplier bonus</p>
                <p>• Current total bonus: <strong>+{(totalMultiplierBonus * 100).toFixed(0)}%</strong></p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Badges;
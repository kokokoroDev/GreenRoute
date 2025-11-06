import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import Navigation from "@/components/Navigation";
import { 
  User, 
  Wallet, 
  History, 
  Shield,
  ExternalLink,
  ChevronLeft,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Copy,
  LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { user, trips, logout, fetchTrips } = useApp();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchTrips();
  }, [user, navigate, fetchTrips]);

  if (!user) return null;

  const completedTrips = trips.filter(trip => trip.status === 'completed');
  const rejectedTrips = trips.filter(trip => trip.status === 'rejected');

  const copyWalletId = () => {
    navigator.clipboard.writeText(user.walletId);
    toast({
      title: "Copied!",
      description: "Wallet ID copied to clipboard",
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
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
            <Avatar className="h-24 w-24 mx-auto">
              <AvatarFallback className="text-3xl">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold mb-2">{user.username}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              {user.isDemo && (
                <Badge variant="secondary" className="mt-2">
                  Demo Account
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-stat p-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-success">
                {user.totalCO2Saved.toFixed(1)} kg
              </div>
              <div className="text-sm text-muted-foreground">Total CO₂ Saved</div>
            </div>
          </Card>

          <Card className="card-stat p-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">
                {user.ecoMiles.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">EcoMiles Balance</div>
            </div>
          </Card>

          <Card className="card-stat p-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-accent">
                {completedTrips.length}
              </div>
              <div className="text-sm text-muted-foreground">Completed Trips</div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card className="card-eco p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <User className="mr-3 h-6 w-6" />
              Profile Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                <span className="text-sm font-medium">Username</span>
                <span>{user.username}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                <span className="text-sm font-medium">Email</span>
                <span>{user.email}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                <span className="text-sm font-medium">Current Streak</span>
                <Badge variant="secondary">{user.streak} days</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                <span className="text-sm font-medium">Badges Earned</span>
                <Badge variant="secondary">{user.badges.length} badges</Badge>
              </div>

              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full mt-6"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </Card>

          {/* Wallet Information */}
          <Card className="card-eco p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Wallet className="mr-3 h-6 w-6" />
              Hedera Wallet
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Wallet Address</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyWalletId}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="font-mono text-sm break-all">
                  {user.walletId}
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                <span className="text-sm font-medium">Network</span>
                <Badge variant="secondary">Hedera Testnet</Badge>
              </div>

              <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                <span className="text-sm font-medium">Token Standard</span>
                <Badge variant="secondary">HTS (EcoMiles)</Badge>
              </div>

              <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                <span className="text-sm font-medium">Balance</span>
                <span className="font-bold">{user.ecoMiles.toLocaleString()} ECM</span>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open('https://hashscan.io', '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on HashScan Explorer
              </Button>
            </div>
          </Card>
        </div>

        {/* Trip History */}
        <Card className="card-eco p-6 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <History className="mr-3 h-6 w-6" />
              Trip History ({trips.length})
            </h2>
            <div className="flex space-x-2">
              <Badge variant="secondary">
                {completedTrips.length} completed
              </Badge>
              <Badge variant="destructive">
                {rejectedTrips.length} rejected
              </Badge>
            </div>
          </div>

          {trips.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No trips yet</h3>
              <p className="text-muted-foreground mb-4">
                Start your first eco-friendly journey to see your trip history here.
              </p>
              <Button onClick={() => navigate('/trip')}>
                Start First Trip
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {trips.map((trip) => (
                <div 
                  key={trip.id}
                  className={`p-6 rounded-lg border-2 ${
                    trip.status === 'completed' ? 'trip-completed' : 
                    trip.status === 'rejected' ? 'trip-rejected' : 'trip-active'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {trip.mode === 'walking' ? '🚶‍♂️' : 
                         trip.mode === 'cycling' ? '🚴‍♂️' : '🛴'}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg capitalize">
                          {trip.mode} Trip
                        </h3>
                        <div className="flex items-center space-x-2">
                          {trip.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive" />
                          )}
                          <Badge 
                            variant={trip.status === 'completed' ? 'default' : 'destructive'}
                          >
                            {trip.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(trip.startTime).toLocaleDateString()}
                      </div>
                      <div>{new Date(trip.startTime).toLocaleTimeString()}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Distance</div>
                      <div className="font-semibold">
                        {trip.distance > 0 ? `${(trip.distance / 1000).toFixed(2)} km` : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                      <div className="font-semibold">
                        {trip.duration > 0 ? `${trip.duration} min` : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Avg Speed</div>
                      <div className="font-semibold">
                        {trip.averageSpeed > 0 ? `${trip.averageSpeed.toFixed(1)} km/h` : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">CO₂ Saved</div>
                      <div className="font-semibold text-success">
                        {trip.co2Saved > 0 ? `${trip.co2Saved.toFixed(3)} kg` : '0 kg'}
                      </div>
                    </div>
                  </div>

                  {trip.status === 'completed' && (
                    <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <span className="text-sm font-medium">EcoMiles Earned:</span>
                          <span className="font-bold text-primary ml-2">
                            +{trip.ecoMilesEarned}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Multiplier:</span>
                          <span className="font-bold text-accent ml-2">
                            {trip.multiplier}x
                          </span>
                        </div>
                      </div>
                      {trip.hcsHash && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`https://hashscan.io/testnet/transaction/${trip.hcsHash}`, '_blank')}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          View Proof
                        </Button>
                      )}
                    </div>
                  )}

                  {trip.status === 'rejected' && trip.rejectionReason && (
                    <div className="p-3 bg-destructive/10 rounded-lg">
                      <div className="text-sm">
                        <span className="font-medium text-destructive">
                          Rejection Reason:
                        </span>
                        <span className="ml-2">{trip.rejectionReason}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Profile;
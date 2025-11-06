import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Square, 
  MapPin, 
  Clock, 
  Gauge, 
  Route,
  CheckCircle,
  XCircle,
  ChevronLeft
} from "lucide-react";

const Trip = () => {
  const navigate = useNavigate();
  const { user, currentTrip, startTrip, stopTrip } = useApp();
  const { toast } = useToast();
  const [selectedMode, setSelectedMode] = useState<'walking' | 'cycling' | 'e-scooter'>('walking');
  const [tripDuration, setTripDuration] = useState(0);
  const [simulatedDistance, setSimulatedDistance] = useState(0);
  const [simulatedSpeed, setSimulatedSpeed] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Simulate live trip data when trip is active
  useEffect(() => {
    if (!currentTrip) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - currentTrip.startTime.getTime()) / 1000 / 60; // minutes
      setTripDuration(elapsed);

      // Simulate realistic movement based on mode
      let baseSpeed = 0;
      switch (currentTrip.mode) {
        case 'walking':
          baseSpeed = 4 + Math.random() * 2; // 4-6 km/h
          break;
        case 'cycling':
          baseSpeed = 15 + Math.random() * 10; // 15-25 km/h
          break;
        case 'e-scooter':
          baseSpeed = 20 + Math.random() * 10; // 20-30 km/h
          break;
      }

      setSimulatedSpeed(baseSpeed);
      setSimulatedDistance((baseSpeed * elapsed) / 60 * 1000); // Convert to meters
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTrip]);

  const handleStartTrip = () => {
    startTrip(selectedMode);
    toast({
      title: "Trip Started!",
      description: `GPS tracking activated for ${selectedMode}`,
    });
  };

  const handleStopTrip = () => {
    stopTrip();
    toast({
      title: "Trip Completed!",
      description: "Processing your trip and calculating rewards...",
    });
  };

  if (!user) return null;

  const modes = [
    { 
      id: 'walking' as const, 
      name: 'Walking', 
      emoji: '🚶‍♂️', 
      multiplier: '1.5x',
      description: 'Perfect for short distances and maximum multiplier'
    },
    { 
      id: 'cycling' as const, 
      name: 'Cycling', 
      emoji: '🚴‍♂️', 
      multiplier: '1.2x',
      description: 'Great for medium distances with good rewards'
    },
    { 
      id: 'e-scooter' as const, 
      name: 'E-Scooter', 
      emoji: '🛴', 
      multiplier: '1.0x',
      description: 'Quick urban transport with base rewards'
    }
  ];

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
          
          <h1 className="text-3xl font-bold mb-2">
            {currentTrip ? 'Trip in Progress' : 'Start New Trip'}
          </h1>
          <p className="text-muted-foreground">
            {currentTrip 
              ? 'Your GPS location is being tracked. End your trip when you reach your destination.'
              : 'Choose your transport mode and start earning EcoMiles for sustainable travel.'
            }
          </p>
        </div>

        {currentTrip ? (
          /* Active Trip View */
          <div className="space-y-6">
            {/* Trip Status Card */}
            <Card className="trip-active p-8 text-center">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-gradient-eco rounded-full">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {modes.find(m => m.id === currentTrip.mode)?.emoji} {currentTrip.mode.charAt(0).toUpperCase() + currentTrip.mode.slice(1)} Trip
                  </h2>
                  <Badge className="bg-gradient-eco text-white text-lg px-4 py-2">
                    GPS Tracking Active
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Live Trip Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="card-stat p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="text-3xl font-bold text-primary">
                      {Math.floor(tripDuration)}m {Math.floor((tripDuration % 1) * 60)}s
                    </p>
                  </div>
                  <div className="p-3 bg-primary/20 rounded-xl">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="card-stat p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Distance</p>
                    <p className="text-3xl font-bold text-accent">
                      {(simulatedDistance / 1000).toFixed(2)} km
                    </p>
                  </div>
                  <div className="p-3 bg-accent/20 rounded-xl">
                    <Route className="h-8 w-8 text-accent" />
                  </div>
                </div>
              </Card>

              <Card className="card-stat p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Speed</p>
                    <p className="text-3xl font-bold text-success">
                      {simulatedSpeed.toFixed(1)} km/h
                    </p>
                  </div>
                  <div className="p-3 bg-success/20 rounded-xl">
                    <Gauge className="h-8 w-8 text-success" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Projected Rewards */}
            <Card className="card-eco p-6">
              <h3 className="text-xl font-bold mb-4">Projected Rewards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base CO₂ Saved:</span>
                    <span>{((simulatedDistance / 1000) * 0.2).toFixed(3)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mode Multiplier:</span>
                    <span>{modes.find(m => m.id === currentTrip.mode)?.multiplier}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total CO₂ Saved:</span>
                    <span className="text-success">
                      {((simulatedDistance / 1000) * 0.2 * (currentTrip.mode === 'walking' ? 1.5 : currentTrip.mode === 'cycling' ? 1.2 : 1.0)).toFixed(3)} kg
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between font-bold">
                    <span>EcoMiles Earned:</span>
                    <span className="text-primary">
                      {Math.round((simulatedDistance / 1000) * 0.2 * (currentTrip.mode === 'walking' ? 1.5 : currentTrip.mode === 'cycling' ? 1.2 : 1.0) * 1000)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Map Placeholder */}
            <Card className="card-eco p-6">
              <h3 className="text-xl font-bold mb-4">Live Route Tracking</h3>
              <div className="bg-gradient-to-br from-secondary/50 to-accent/20 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                <div className="text-center space-y-4">
                  <div className="gps-tracking"></div>
                  <div className="text-2xl">📍</div>
                  <p className="text-muted-foreground">GPS Route Tracking Active</p>
                  <p className="text-sm text-muted-foreground">
                    In production, this would show a live map with your route
                  </p>
                </div>
              </div>
            </Card>

            {/* Stop Trip Button */}
            <Card className="card-eco p-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold">Ready to finish your trip?</h3>
                <p className="text-muted-foreground">
                  Make sure you've reached your destination before ending the trip.
                </p>
                <Button 
                  className="btn-reward text-lg px-8 py-6 h-auto"
                  onClick={handleStopTrip}
                >
                  <Square className="mr-3 h-6 w-6" />
                  Stop Trip & Calculate Rewards
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          /* Trip Setup View */
          <div className="space-y-6">
            {/* Mode Selection */}
            <Card className="card-eco p-6">
              <h2 className="text-2xl font-bold mb-6">Choose Transport Mode</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {modes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`p-6 rounded-lg border-2 transition-all duration-300 text-left ${
                      selectedMode === mode.id
                        ? 'border-primary bg-primary/10 shadow-eco'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{mode.emoji}</div>
                        <div>
                          <h3 className="font-bold text-lg">{mode.name}</h3>
                          <Badge variant="secondary">{mode.multiplier}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {mode.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Validation Info */}
            <Card className="card-eco p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-success" />
                Trip Validation System
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-success flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Valid Trip Requirements
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Minimum duration: 2 minutes</li>
                    <li>• Minimum distance: 100 meters</li>
                    <li>• Speed within mode limits</li>
                    <li>• Consistent movement pattern</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-destructive flex items-center">
                    <XCircle className="mr-2 h-4 w-4" />
                    Auto-Rejection Triggers
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Walking: Average speed &gt; 7 km/h</li>
                    <li>• Cycling: Average speed &gt; 35 km/h</li>
                    <li>• Any mode: Max speed &gt; 50 km/h</li>
                    <li>• Suspicious GPS patterns</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Start Trip Button */}
            <Card className="card-eco p-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold">Ready to start your eco journey?</h3>
                <p className="text-muted-foreground">
                  Selected mode: <strong>{modes.find(m => m.id === selectedMode)?.emoji} {selectedMode}</strong> with {modes.find(m => m.id === selectedMode)?.multiplier} reward multiplier
                </p>
                <Button 
                  className="btn-eco text-lg px-8 py-6 h-auto"
                  onClick={handleStartTrip}
                >
                  <Play className="mr-3 h-6 w-6" />
                  Start {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)} Trip
                </Button>
                <p className="text-xs text-muted-foreground">
                  GPS tracking will begin immediately and validate your movement
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trip;
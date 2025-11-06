import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Leaf, MapPin, Award, Coins, TrendingUp, Users, UserPlus, Play, Trophy } from "lucide-react";
import heroImage from "@/assets/hero-sustainable-transport.jpg";

const Landing = () => {
  const navigate = useNavigate();
  const { startDemo } = useApp();

  const handleDemo = () => {
    startDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-hero text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8" />
            <span className="text-xl md:text-2xl font-bold">GreenRoutes</span>
          </div>
          <div className="flex gap-2 md:gap-4">
            <Link to="/auth">
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-sm md:text-base px-3 md:px-4">
                Sign In
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Walk, Cycle, Save CO₂,<br />
            <span className="text-green-300">Earn EcoMiles!</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 text-white/90 leading-relaxed px-4">
            Turn your sustainable transport choices into rewards.<br className="hidden md:block" />
            Every step counts towards a greener future.
          </p>

          {/* Hero Image */}
          <div className="mb-8 md:mb-12">
            <img 
              src={heroImage} 
              alt="Sustainable transportation - walking, cycling, and eco-friendly commuting" 
              className="mx-auto rounded-2xl shadow-eco max-w-full h-auto"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-4">
            <Link to="/auth" className="w-full sm:w-auto">
              <Button size="lg" className="bg-white text-green-700 hover:bg-white/90 font-semibold px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full sm:w-auto">
                <UserPlus className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                Get Started
              </Button>
            </Link>
            
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleDemo}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-semibold px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full sm:w-auto"
            >
              <Play className="w-4 md:w-5 h-4 md:h-5 mr-2" />
              Try Demo
            </Button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white/10 backdrop-blur-sm py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-16">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-12 md:w-16 h-12 md:h-16 flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <MapPin className="w-6 md:w-8 h-6 md:h-8" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Track Your Journey</h3>
                <p className="text-white/80 text-sm md:text-base">
                  Use GPS to track your walking, cycling, or e-scooter trips with fraud-proof validation.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-12 md:w-16 h-12 md:h-16 flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Coins className="w-6 md:w-8 h-6 md:h-8" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Earn EcoMiles</h3>
                <p className="text-white/80 text-sm md:text-base">
                  Get rewarded with blockchain-based EcoMiles for every kilometer of sustainable transport.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-12 md:w-16 h-12 md:h-16 flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Trophy className="w-6 md:w-8 h-6 md:h-8" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Compete & Win</h3>
                <p className="text-white/80 text-sm md:text-base">
                  Climb the leaderboards, earn badges, and compete with friends in saving CO₂.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8">
              Real Impact, Real Rewards
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-12">
              See what our community has achieved
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white text-center p-6 md:p-8">
              <div className="text-3xl md:text-4xl font-bold mb-2">2,847</div>
              <div className="text-white/80 text-sm md:text-base">EcoMiles Earned</div>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white text-center p-6 md:p-8">
              <div className="text-3xl md:text-4xl font-bold mb-2">15.6 kg</div>
              <div className="text-white/80 text-sm md:text-base">CO₂ Saved</div>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white text-center p-6 md:p-8">
              <div className="text-3xl md:text-4xl font-bold mb-2">7 days</div>
              <div className="text-white/80 text-sm md:text-base">Current Streak</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Hedera Integration Section */}
      <section className="py-12 md:py-20 bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
            <Badge variant="outline" className="mb-6 border-white/20 text-white px-4 py-1">
              Powered by Hedera
            </Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8">
              Blockchain-Powered Eco Rewards
            </h2>
            <p className="text-lg md:text-xl text-white/90">
              Built on Hedera's sustainable blockchain for transparency and trust
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Badge variant="outline" className="bg-white/10">HCS</Badge>
                Hedera Consensus Service
              </h3>
              <p className="text-white/80 mb-4">
                Every validated trip is logged as an immutable event, providing transparent proof of your eco-actions without storing personal data.
              </p>
              <ul className="text-sm space-y-2 text-white/90">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-white/20 p-1 mt-0.5">
                    <TrendingUp className="w-3 h-3" />
                  </div>
                  <span>Immutable trip records</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-white/20 p-1 mt-0.5">
                    <TrendingUp className="w-3 h-3" />
                  </div>
                  <span>Transparent carbon savings</span>
                </li>
              </ul>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Badge variant="outline" className="bg-white/10">HTS</Badge>
                Hedera Token Service
              </h3>
              <p className="text-white/80 mb-4">
                EcoMiles are minted as real tokens you can earn, transfer, and redeem. Achievement badges are unique NFTs proving your milestones.
              </p>
              <ul className="text-sm space-y-2 text-white/90">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-white/20 p-1 mt-0.5">
                    <Coins className="w-3 h-3" />
                  </div>
                  <span>Transferable EcoMiles tokens</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-white/20 p-1 mt-0.5">
                    <Award className="w-3 h-3" />
                  </div>
                  <span>Achievement badges as NFTs</span>
                </li>
              </ul>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Badge variant="outline" className="bg-white/10">Smart Contracts</Badge>
                Future Expansion
              </h3>
              <p className="text-white/80 mb-4">
                Ready for growth with smart contracts that can automate rewards, handle partner integrations, and scale the ecosystem.
              </p>
              <ul className="text-sm space-y-2 text-white/90">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-white/20 p-1 mt-0.5">
                    <Users className="w-3 h-3" />
                  </div>
                  <span>Partner integrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-white/20 p-1 mt-0.5">
                    <TrendingUp className="w-3 h-3" />
                  </div>
                  <span>Automated reward multipliers</span>
                </li>
              </ul>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Badge variant="outline" className="bg-white/10">HTS NFTs</Badge>
                Achievement Collection
              </h3>
              <p className="text-white/80 mb-4">
                Collect unique NFT badges for your achievements. Each badge is a permanent record of your contribution to sustainability.
              </p>
              <ul className="text-sm space-y-2 text-white/90">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-white/20 p-1 mt-0.5">
                    <Award className="w-3 h-3" />
                  </div>
                  <span>Milestone achievements</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-white/20 p-1 mt-0.5">
                    <Trophy className="w-3 h-3" />
                  </div>
                  <span>Special event badges</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8">
              Ready to Start Your Eco Journey?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-12">
              Join the sustainable transport revolution and earn real rewards for your positive impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center px-4">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button size="lg" className="bg-white text-green-700 hover:bg-white/90 font-semibold px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full sm:w-auto">
                  <UserPlus className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                  Create Account
                </Button>
              </Link>
              
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleDemo}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-semibold px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full sm:w-auto"
              >
                <Play className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                Explore Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
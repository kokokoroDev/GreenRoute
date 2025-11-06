import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Home, 
  Play, 
  Trophy, 
  Award, 
  User, 
  Leaf,
  Coins,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, currentTrip, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const navItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: Home,
      active: location.pathname === '/dashboard'
    },
    { 
      path: '/trip', 
      label: 'Trip', 
      icon: Play,
      active: location.pathname === '/trip',
      badge: currentTrip ? 'Active' : null
    },
    { 
      path: '/leaderboard', 
      label: 'Leaderboard', 
      icon: Trophy,
      active: location.pathname === '/leaderboard'
    },
    { 
      path: '/badges', 
      label: 'Badges', 
      icon: Award,
      active: location.pathname === '/badges',
      badge: user.badges.length > 0 ? (user.badges.length - 1).toString() : null
    }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-eco rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div className="font-bold text-xl">GreenRoutes</div>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant={item.active ? "default" : "ghost"}
                    onClick={() => navigate(item.path)}
                    className="relative"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className="ml-2 px-2 py-0 text-xs h-5"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden lg:block">
                <div className="text-sm font-semibold">{user.username}</div>
                <div className="text-xs text-muted-foreground flex items-center">
                  <Coins className="h-3 w-3 mr-1" />
                  {user.ecoMiles.toLocaleString()} ECM
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar 
                    className="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                  >
                    <AvatarFallback>
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-eco rounded-lg">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div className="font-bold text-lg">GreenRoutes</div>
            </div>

            {/* User Info & Menu Toggle */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-semibold">{user.username}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-end">
                  <Coins className="h-3 w-3 mr-1" />
                  {user.ecoMiles > 1000 ? `${(user.ecoMiles / 1000).toFixed(1)}k` : user.ecoMiles} ECM
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="pb-4 border-t border-border mt-2">
              <div className="grid grid-cols-2 gap-3 pt-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.path}
                      variant={item.active ? "default" : "outline"}
                      onClick={() => {
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className="relative justify-start h-12"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <span className="text-sm">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className="ml-auto px-2 py-0 text-xs h-5"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Active Trip Indicator */}
      {currentTrip && (
        <div className="bg-gradient-to-r from-accent to-success text-white text-center py-2 px-4">
          <div className="flex items-center justify-center space-x-2 text-sm font-medium">
            <div className="animate-pulse">🟢</div>
            <span>Trip in progress - {currentTrip.mode}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 ml-4"
              onClick={() => navigate('/trip')}
            >
              View Trip
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
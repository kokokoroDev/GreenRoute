import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Trip from "./pages/Trip";
import Leaderboard from "./pages/Leaderboard";
import Badges from "./pages/Badges";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Protected from "./components/Protected";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
              <Route path="/trip" element={<Protected><Trip /></Protected>} />
              <Route path="/leaderboard" element={<Protected><Leaderboard /></Protected>} />
              <Route path="/badges" element={<Protected><Badges /></Protected>} />
              <Route path="/profile" element={<Protected><Profile /></Protected>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;

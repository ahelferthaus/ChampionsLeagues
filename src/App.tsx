import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { TeamProvider } from "@/contexts/TeamContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateClub from "./pages/CreateClub";
import CreateTeam from "./pages/CreateTeam";
import Payments from "./pages/Payments";
import Trips from "./pages/Trips";
import Schedule from "./pages/Schedule";
import Roster from "./pages/Roster";
import Stats from "./pages/Stats";
import Resources from "./pages/Resources";
import Attendance from "./pages/Attendance";
import Recruiting from "./pages/Recruiting";
import Expenses from "./pages/Expenses";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Docs from "./pages/Docs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <TeamProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clubs/create" element={<CreateClub />} />
          <Route path="/teams/create" element={<CreateTeam />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/roster" element={<Roster />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/recruiting" element={<Recruiting />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TeamProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

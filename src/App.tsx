import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Awareness from "./pages/Awareness";
import Camps from "./pages/Camps";
import Booking from "./pages/Booking";
import DataAnalytics from "./pages/DataAnalytics";
import Prediction from "./pages/Prediction";
import Staff from "./pages/Staff";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import PredictionImages from "./pages/PredictionImages";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/awareness" element={<Awareness />} />
            <Route path="/camps" element={<Camps />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/analytics" element={<DataAnalytics />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/auth" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

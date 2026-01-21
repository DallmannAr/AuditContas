// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Components Screens
import Home from "./pages/home";
import SignUp from "./pages/signUp";
import TableUpload from "./pages/tableUpload";
import NotFound from "./pages/notFound";
import Login from "./pages/login";
import SettingsScreen from "./pages/settings";
import { AppProvider } from "./contexts/AppContext";
import Search from "./pages/search";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <AppProvider >
        <AuthProvider>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<SignUp />} />

            {/* Rotas Protegidas */}
            <Route path="/search" element={<Search />} /> 
            <Route path="/home" element={<Home />} />
            <Route path="/table-upload" element={<TableUpload />} />
            <Route path="/settings" element={<SettingsScreen/>} />

            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} /> 
          </Routes>
        </AuthProvider>
      </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

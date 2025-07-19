import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import GraphEditor from "./pages/GraphEditor";
import Metrics from "./pages/Metrics";
import DataSources from "./pages/DataSources";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="editor" element={<GraphEditor />} />
        <Route path="metrics" element={<Metrics />} />
        <Route path="datasources" element={<DataSources />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster
          position="top-right"
          theme="light"
          duration={3500}
          closeButton
          toastOptions={{
            style: {
              background: '#fff',
              color: '#222',
              borderRadius: '10px',
              boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
              fontSize: '1rem',
              fontWeight: 500,
              border: '1px solid #e5e7eb',
            },
          }}
        />
        <BrowserRouter basename="/krok-mvp">
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

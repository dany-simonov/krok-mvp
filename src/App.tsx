/**
 * @fileoverview Main application component for Krok MVP
 *
 * This file contains the root application component that sets up the application
 * with all necessary providers and routing configuration. It serves as the entry
 * point for the React application and configures:
 * - React Query for data fetching and caching
 * - Authentication context
 * - Routing with React Router
 * - Toast notifications
 * - Tooltip provider
 *
 * @author Krok Development Team
 * @version 1.0.0
 */

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
import Registration from "./pages/Registration";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * QueryClient instance for managing server state
 * Handles caching, background updates, and data synchronization
 */
const queryClient = new QueryClient();

/**
 * AppRoutes component
 *
 * Defines the routing structure for the application using React Router.
 * All routes are nested under the Layout component which provides
 * consistent navigation and sidebar.
 *
 * @returns JSX.Element - The routing configuration
 */
const AppRoutes = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Проверяем, есть ли пользователь в localStorage
    const userData = localStorage.getItem("user_data");
    if (!userData && window.location.pathname !== "/register") {
      navigate("/register", { replace: true });
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/register" element={<Registration />} />
      {/* Main layout wrapper for all authenticated pages */}
      <Route path="/" element={<Layout />}>
        {/* Dashboard - Main overview page */}
        <Route index element={<Dashboard />} />

        {/* Graph Editor - Interactive graph visualization and editing */}
        <Route path="editor" element={<GraphEditor />} />

        {/* Metrics - Detailed metrics and analytics */}
        <Route path="metrics" element={<Metrics />} />

        {/* Data Sources - Connection management for monitoring systems */}
        <Route path="datasources" element={<DataSources />} />

        {/* Settings - Application configuration and preferences */}
        <Route path="settings" element={<Settings />} />

        {/* Help - Documentation and support */}
        <Route path="help" element={<Help />} />
      </Route>

      {/* 404 page for unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

/**
 * Main App component
 *
 * Root component that wraps the entire application with necessary providers:
 * - QueryClientProvider: For data fetching and caching
 * - AuthProvider: For authentication state management
 * - TooltipProvider: For tooltip functionality
 * - Toaster: For toast notifications
 * - BrowserRouter: For client-side routing
 *
 * @returns JSX.Element - The complete application structure
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        {/* Toast notification system configuration */}
        <Toaster
          position="top-right"
          theme="light"
          duration={3500}
          closeButton
          toastOptions={{
            style: {
              background: "#fff",
              color: "#222",
              borderRadius: "10px",
              boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
              fontSize: "1rem",
              fontWeight: 500,
              border: "1px solid #e5e7eb",
            },
          }}
        />
        {/* Router with basename for deployment path */}
        <BrowserRouter basename="/krok-mvp">
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

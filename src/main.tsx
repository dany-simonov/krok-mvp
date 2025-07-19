/**
 * @fileoverview Main entry point for Krok MVP application
 *
 * This file serves as the application entry point, initializing the React
 * application and mounting it to the DOM. It imports the main App component
 * and global styles.
 *
 * The application is rendered into the DOM element with id "root" and
 * provides the foundation for the entire Krok MVP application.
 *
 * @author Krok Development Team
 * @version 1.0.0
 */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ensureDefaultUsers } from "@/contexts/AuthContext";
ensureDefaultUsers();

/**
 * Initialize and render the React application
 *
 * Creates a React root and renders the main App component into the DOM.
 * The application is mounted to the element with id "root".
 */
createRoot(document.getElementById("root")!).render(<App />);

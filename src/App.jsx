import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./router/protectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Advertiser from "./pages/Advertiser/Advertiser";
import Adds from "./pages/Adds/Adds";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext";
import Users from "./pages/Users/Users";
import Recipes from "./pages/Recipes/Recipes";
import Questions from "./pages/Questions/Questions";
import Answers from "./pages/Answers/Answers";
import Privacy from "./pages/Privacy/Privacy";
import Terms from "./pages/Terms/Terms";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/questions" element={<Questions />} />
                <Route path="/answers" element={<Answers />} />

                <Route path="/adds" element={<Adds />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;

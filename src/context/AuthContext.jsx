import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [user, setUser] = useState(() => {
    const storedUser = Cookies.get("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login API call using React Query mutation
  const loginMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);
      return response.data;
    },
    onSuccess: (data) => {
      if (!data?.data?.user || !data?.data?.token) {
        toast.error("Invalid login response.");
        return;
      }

      const { user, token } = data?.data;

      // Store user & token in cookies
      Cookies.set("user", JSON.stringify(user), { expires: 7 });
      Cookies.set("token", token, { expires: 7 });

      setUser(user);
      toast.success("Login successful!");

      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });

  // Logout function
  const logout = () => {
    Cookies.remove("user");
    Cookies.remove("token");
    setUser(null);
    queryClient.clear(); // Clear React Query cache
    toast.info("Logged out successfully.");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: loginMutation.mutate,
        isLoading: loginMutation.isPending,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

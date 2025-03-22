import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define the AuthContext with a more specific type
interface AuthContextType {
  token: string | null;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
      fullName: string,
      email: string,
      phoneNumber: string,
      userRole: string,
      password: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null); // To store user details
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if token is stored in localStorage (for auto-login)
  useEffect(() => {
    const checkToken = () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  // Login function using Axios
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `api/users/login`,
        {
          email,
          password,
        }
      );

      const data = response.data as { token: string; user: any };
      const token = data.result.token;
      const user = data.result.user;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setToken(token);
        setUser(user);
        navigate("/doctordashboard"); // Redirect to the home page
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed");
    }
  };

  // Signup function using Axios
  const signup = async (
      fullName: string,
      email: string,
      phoneNumber: string,
      userRole: string,
      password: string
  ) => {
    try {
      const response = await axios.post(
        `api/users/register`,
        {
          fullName,
          email,
          phoneNumber,
          userRole,
          password
        }
      );

      const data = response.data as { token: string; user: any };
      const token = data.token;
      const user = data.user;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setToken(token);
        setUser(user);
        navigate("/doctordashboard"); // Redirect to the home page
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw new Error("Signup failed");
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/login"); // Redirect to login after logging out
  };

  return (
    <AuthContext.Provider
      value={{ token, user, login, signup, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
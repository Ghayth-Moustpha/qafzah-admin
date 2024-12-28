import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axiosInstance from 'src/hooks/axios'; // Import the configured Axios instance
import IUser from 'src/interfaces/user.interface';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  signin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  API : string ,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize user state from localStorage
  const storedUser = localStorage.getItem('user');
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  const [user, setUser] = useState<IUser | null>(initialUser);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const API = "https://api.qafzatech.com"; 
  // Effect to update state if localStorage changes
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) {
      setToken(storedToken);
    } else {
      setToken(null);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse user data from localStorage
    } else {
      setUser(null);
    }
  }, []);

  const signin = async (email: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    const { user } = response.data; 
    const newToken = response.data.token;

    if (user.role !== "Admin") {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token'); // Remove token if user is not admin
      localStorage.removeItem('user'); // Remove user data if not admin
    } else {
      setUser(user); 
      setToken(newToken); 
      localStorage.setItem('token', newToken); // Store the token
      localStorage.setItem('user', JSON.stringify(user)); // Store user data
    }
  };

  const logout = () => {
    setUser(null); // Clear user on logout
    setToken(null);
    localStorage.removeItem('token'); // Remove the token
    localStorage.removeItem('user'); // Remove user data
  };

  return (
    <AuthContext.Provider value={{ API , user, token, signin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

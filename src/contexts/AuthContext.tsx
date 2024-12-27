import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axiosInstance from 'src/hooks/axios'; // Import the configured Axios instance
import IUser from 'src/interfaces/user.interface';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  sginin: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser ]= useState<IUser  | null>(null);
  const [token, setToken] = useState<string | null>( localStorage.getItem('token'));



  const sginin = async (email: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    const { user } = response.data; 
    console.log(user) ; 
    setUser(user) ; 
    console.log(response.data.token) ; 
    if (user.role != "Admin" ) 
      setToken(null)
    else 
    setToken(response.data.token) ; 
    localStorage.setItem('token', token); // Store the token

  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token'); // Remove the token
  };

  return (
    <AuthContext.Provider value={{  user, token, sginin, logout }}>
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

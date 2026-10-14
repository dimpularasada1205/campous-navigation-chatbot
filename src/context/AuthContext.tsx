import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: { name: string; email: string; password: string; role: 'student' | 'faculty' | 'visitor'; department?: string; studentId?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickDemoLogin: (role: 'student' | 'faculty' | 'visitor') => void;
}

const DEFAULT_USERS: Array<User & { password: string }> = [
  {
    id: "usr-1",
    name: "Aditya Varma",
    email: "student@kiet.edu.in",
    password: "password123",
    role: "student",
    department: "Computer Science & Artificial Intelligence (CAI)",
    studentId: "22B91A4201"
  },
  {
    id: "usr-2",
    name: "Dr. K. Srinivas Rao",
    email: "faculty@kiet.edu.in",
    password: "password123",
    role: "faculty",
    department: "Computer Science & Engineering (CSE)"
  },
  {
    id: "usr-3",
    name: "Campus Guest / Visitor",
    email: "visitor@kiet.edu.in",
    password: "password123",
    role: "visitor"
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kiet_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default to student preloaded for convenience if desired, or null so login page shows first
    return null;
  });

  const [users, setUsers] = useState<Array<User & { password: string }>>(() => {
    const saved = localStorage.getItem('kiet_users_table');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_USERS;
      }
    }
    return DEFAULT_USERS;
  });

  useEffect(() => {
    localStorage.setItem('kiet_users_table', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kiet_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('kiet_current_user');
    }
  }, [currentUser]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Artificial small delay for realistic college portal feel
    await new Promise(r => setTimeout(r, 300));
    
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail || u.studentId?.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, error: "No account found with this email or roll number." };
    }

    if (user.password !== password) {
      return { success: false, error: "Incorrect password. Please verify your credentials." };
    }

    const { password: _, ...safeUser } = user;
    setCurrentUser(safeUser);
    return { success: true };
  };

  const signup = async (data: { name: string; email: string; password: string; role: 'student' | 'faculty' | 'visitor'; department?: string; studentId?: string }): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 300));
    const cleanEmail = data.email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: "An account with this email address already exists." };
    }

    const newUser: User & { password: string } = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password,
      role: data.role,
      department: data.department?.trim() || "General Engineering",
      studentId: data.studentId?.trim()
    };

    setUsers(prev => [...prev, newUser]);
    const { password: _, ...safeUser } = newUser;
    setCurrentUser(safeUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const quickDemoLogin = (role: 'student' | 'faculty' | 'visitor') => {
    const demo = users.find(u => u.role === role) || users[0];
    const { password: _, ...safeUser } = demo;
    setCurrentUser(safeUser);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: !!currentUser,
      login,
      signup,
      logout,
      quickDemoLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

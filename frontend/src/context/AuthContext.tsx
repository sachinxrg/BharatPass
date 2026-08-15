'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthResponse } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  quickDemoLogin: (role?: 'ROLE_CITIZEN' | 'ROLE_PSK_OFFICER' | 'ROLE_POLICE_OFFICER' | 'ROLE_RPO_ADMIN') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bp_user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default seamless demo citizen
        const defaultCitizen: User = {
          citizenId: 'cit-9921',
          name: 'Aarav Rajesh Sharma',
          maskedAadhaar: 'XXXXXXXX9012',
          ekycVerified: true,
          role: 'ROLE_CITIZEN',
        };
        setUser(defaultCitizen);
        localStorage.setItem('bp_user', JSON.stringify(defaultCitizen));
      }
    } catch {
      // ignore storage error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (authData: AuthResponse) => {
    const u: User = {
      citizenId: authData.citizenId,
      name: authData.name,
      maskedAadhaar: authData.maskedAadhaar,
      ekycVerified: authData.ekycVerified,
      role: authData.role,
    };
    setUser(u);
    localStorage.setItem('bp_access_token', authData.accessToken);
    localStorage.setItem('bp_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bp_access_token');
    localStorage.removeItem('bp_user');
  };

  const quickDemoLogin = (role: 'ROLE_CITIZEN' | 'ROLE_PSK_OFFICER' | 'ROLE_POLICE_OFFICER' | 'ROLE_RPO_ADMIN' = 'ROLE_CITIZEN') => {
    let mockUser: User;
    if (role === 'ROLE_POLICE_OFFICER') {
      mockUser = {
        citizenId: 'off-pol-104',
        name: 'SI Rajesh Kumar (Indiranagar PS)',
        maskedAadhaar: 'XXXXXXXX4589',
        ekycVerified: true,
        role: 'ROLE_POLICE_OFFICER',
      };
    } else if (role === 'ROLE_PSK_OFFICER') {
      mockUser = {
        citizenId: 'off-psk-201',
        name: 'Priya Sharma (Counter A Granting Officer)',
        maskedAadhaar: 'XXXXXXXX7712',
        ekycVerified: true,
        role: 'ROLE_PSK_OFFICER',
      };
    } else if (role === 'ROLE_RPO_ADMIN') {
      mockUser = {
        citizenId: 'adm-rpo-001',
        name: 'Dr. G. K. Rao (Regional Passport Officer, Bengaluru)',
        maskedAadhaar: 'XXXXXXXX0001',
        ekycVerified: true,
        role: 'ROLE_RPO_ADMIN',
      };
    } else {
      mockUser = {
        citizenId: 'cit-9921',
        name: 'Aarav Rajesh Sharma',
        maskedAadhaar: 'XXXXXXXX9012',
        ekycVerified: true,
        role: 'ROLE_CITIZEN',
      };
    }

    setUser(mockUser);
    localStorage.setItem('bp_access_token', `demo-token-${role}`);
    localStorage.setItem('bp_user', JSON.stringify(mockUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

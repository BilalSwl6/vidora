import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import axios from 'axios';
import { API_ENDPOINTS } from '@/utils/api';
import { showToast } from '@/utils/toster';

interface User {
  id: number;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  is_active: boolean;
  is_verified: boolean;
  provider: string;
  created_at: string;
  last_login?: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          // Try to fetch user info with access token
          const res = await axios.get(API_ENDPOINTS.me, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          setUser(res.data);
          router.replace('/');
          const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(null);
        } catch (error: any) {
          // If token expired, try to refresh
          if (error?.response?.status === 401) {
            try {
              await refreshToken();
              // After refresh, try again to fetch user info
              const newToken = await AsyncStorage.getItem('token');
              const res = await axios.get(API_ENDPOINTS.me, {
                headers: { Authorization: `Bearer ${newToken}` }
              });
              setUser(res.data);
              router.replace('/');
            } catch (refreshError: any) {
              // If refresh fails, logout and go to login
              let message = 'Session expired. Please login again.';
              if (refreshError?.response?.data?.detail) {
                message = refreshError.response.data.detail;
              }
              showToast(message);
              await logout();
            }
          } else {
            showToast('Authentication error. Please login again.');
            await logout();
          }
        }
      } else {
        showToast('Please login to continue.');
        router.replace('/login');
      }
    } catch (error) {
      // console.error('Auth check error:', error);
      showToast('Authentication error. Please login again.');
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await axios.post(API_ENDPOINTS.login, {
        email,
        password
      });
      const { access_token, refresh_token } = res.data;
      await AsyncStorage.setItem('token', access_token);
      await AsyncStorage.setItem('refresh_token', refresh_token);
      setToken(access_token);
      // Fetch user info
      const userRes = await axios.get(API_ENDPOINTS.me, {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      setUser(userRes.data);
      await AsyncStorage.setItem('user', JSON.stringify(userRes.data));
      // console.log('Login saved:', {
      //   access_token,
      //   refresh_token,
      //   user: userRes.data
      // });
      router.replace('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const signup = useCallback(async (username: string, full_name: string, email: string, password: string) => {
    try {
      const res = await axios.post(API_ENDPOINTS.signup, {
        username,
        full_name,
        email,
        password
      });
      // Auto-login after signup
      await login(email, password);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }, [login]);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setUser(null);
    setToken(null);
    router.replace('/login');
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const storedRefreshToken = await AsyncStorage.getItem('refresh_token');
      if (!storedRefreshToken) throw new Error('No refresh token found');
      const storedUser = await AsyncStorage.getItem('user');
      const res = await axios.post(API_ENDPOINTS.refresh, {
        refresh_token: storedRefreshToken
      });
      const { access_token, refresh_token } = res.data;
      await AsyncStorage.setItem('token', access_token);
      await AsyncStorage.setItem('refresh_token', refresh_token);
      setToken(access_token);
      // Optionally fetch user info again
      if (storedUser) {
        const userRes = await axios.get(API_ENDPOINTS.me, {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        setUser(userRes.data);
        await AsyncStorage.setItem('user', JSON.stringify(userRes.data));
      }
      return access_token;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }, []);

  return useMemo(() => ({
    user,
    isLoading,
    token,
    login,
    signup,
    logout,
    refreshToken
  }), [user, isLoading, token, login, signup, logout, refreshToken]);
});
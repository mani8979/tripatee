import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Run on mount to check if token exists and fetch profile
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/users/profile');
        setUser(res.data);
      } catch (err) {
        console.error('Session verification failed, logging out:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, ...userData } = res.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setAuthError(errMsg);
      
      // If user is registered but not verified
      if (err.response?.data?.notVerified) {
        return { success: false, notVerified: true, email: err.response.data.email };
      }
      return { success: false, message: errMsg };
    }
  };

  // Signup handler
  const signup = async (name, email, password) => {
    setAuthError(null);
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      if (res.data.isVerified) {
        // First admin account is auto-verified
        const { token, ...userData } = res.data;
        localStorage.setItem('token', token);
        setUser(userData);
        return { success: true, isVerified: true };
      }
      return { success: true, isVerified: false, email: res.data.email };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Signup failed. Please try again.';
      setAuthError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  // OTP Verification handler
  const verifyOtp = async (email, otp) => {
    setAuthError(null);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      const { token, ...userData } = res.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Invalid or expired OTP.';
      setAuthError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  // Resend OTP handler
  const resendOtp = async (email) => {
    try {
      await api.post('/auth/resend-otp', { email });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to resend code' };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAuthError(null);
  };

  // Update profile
  const updateProfile = async (data) => {
    try {
      const res = await api.put('/users/profile', data);
      setUser((prev) => ({ ...prev, ...res.data }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Profile update failed' };
    }
  };

  // Bookmark a package
  const toggleSaveTrip = async (packageId) => {
    if (!user) return { success: false, message: 'Please log in to save trips' };

    const isAlreadySaved = user.savedTrips?.some((t) => (t._id || t) === packageId);

    try {
      if (isAlreadySaved) {
        const res = await api.delete(`/users/saved/${packageId}`);
        setUser((prev) => ({
          ...prev,
          savedTrips: prev.savedTrips.filter((t) => (t._id || t) !== packageId),
        }));
        return { success: true, saved: false, message: res.data.message };
      } else {
        const res = await api.post(`/users/saved/${packageId}`);
        // Fetch full package details to append to savedTrips array in local context
        const pkgRes = await api.get(`/packages/${packageId}`);
        setUser((prev) => ({
          ...prev,
          savedTrips: [...(prev.savedTrips || []), pkgRes.data.package],
        }));
        return { success: true, saved: true, message: res.data.message };
      }
    } catch (err) {
      return { success: false, message: 'Failed to bookmark tour package' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        signup,
        verifyOtp,
        resendOtp,
        logout,
        updateProfile,
        toggleSaveTrip,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;

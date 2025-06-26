// src/store/auth.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  role: null,
  user: null,
  token: null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Login success
    loginSuccess: (state, action) => {
      const { user, token, role } = action.payload;
      state.isLoggedIn = true;
      state.user = user;
      state.token = token;
      state.role = role;
      state.loading = false;
      state.error = null;
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('id', user.id);
      localStorage.setItem("user", JSON.stringify(user)); // ✅ Save full user

    },
    
    // Login (simple toggle - for backward compatibility)
    login: (state) => {
      state.isLoggedIn = true;
      state.loading = false;
    },
    
    // Logout
    logout: (state) => {
      state.isLoggedIn = false;
      state.role = null;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('id');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
    
    // Change role
    changeRole: (state, action) => {
      state.role = action.payload;
      localStorage.setItem('role', action.payload);
    },
    
    // Set user
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload?.id) {
        localStorage.setItem('id', action.payload.id);
      }
    },
    
    // Set token
    setToken: (state, action) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem('token', action.payload);
      }
    },
    
    // Initialize auth state from localStorage on app start
    initializeAuth: (state) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user && !isTokenExpired(token)) {
    state.isLoggedIn = true;
    state.token = token;
    state.user = JSON.parse(user); // ✅ full user object
    state.role = JSON.parse(user).role || null; // optional
  } else {
    // Token invalid or missing, clear everything
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    localStorage.removeItem('authToken');
    state.token = null;
    state.user = null;
    state.isLoggedIn = false;
    state.role = null;
  }

  state.loading = false;
}

  }
});

// Export actions
export const authActions = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Helper functions
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  
  if (!token || isTokenExpired(token)) {
    // Redirect to login if token is expired
    window.location.href = '/login';
    return;
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
};
export const { loginSuccess } = authSlice.actions;

// Thunk actions for async operations (if using Redux Toolkit)
export const loginUser = (credentials) => async (dispatch) => {
  try {
    const res = await fetch('${process.env.REACT_APP_API_URL}/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.message || "Invalid credentials" };
    }

    // Save to localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Dispatch login success
    dispatch({
      type: "auth/loginSuccess",
      payload: { token: data.token, user: data.user },
    });

    return { success: true };
  } catch (err) {
    return { success: false, error: "Network error" };
  }
};


export const logoutUser = () => async (dispatch) => {
  dispatch(authActions.setLoading(true));
  
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    if (token) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error('Logout API call failed:', error);
  } finally {
    dispatch(authActions.logout());
  }
};
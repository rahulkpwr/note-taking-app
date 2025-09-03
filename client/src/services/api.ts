import axios from 'axios';
import { 
  AuthResponse, 
  NotesResponse, 
  NoteResponse, 
  ApiResponse,
  LoginCredentials,
  SignupData,
  GoogleAuthData,
  Note
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  sendOTP: async (email: string, name: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/send-otp', { email, name });
    return response.data;
  },

  verifyOTPAndSignup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  googleAuth: async (data: GoogleAuthData): Promise<AuthResponse> => {
    const response = await api.post('/auth/google', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: any }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Notes API
export const notesAPI = {
  getNotes: async (): Promise<NotesResponse> => {
    const response = await api.get('/notes');
    return response.data;
  },

  getNote: async (id: string): Promise<NoteResponse> => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  createNote: async (note: { title: string; content: string }): Promise<NoteResponse> => {
    const response = await api.post('/notes', note);
    return response.data;
  },

  updateNote: async (id: string, note: { title: string; content: string }): Promise<NoteResponse> => {
    const response = await api.put(`/notes/${id}`, note);
    return response.data;
  },

  deleteNote: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
};

export default api; 
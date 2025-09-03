export interface User {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  avatar?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface NotesResponse {
  notes: Note[];
}

export interface NoteResponse {
  note: Note;
}

export interface ApiResponse {
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  name: string;
  password: string;
  otp: string;
}

export interface GoogleAuthData {
  credential: string;
} 
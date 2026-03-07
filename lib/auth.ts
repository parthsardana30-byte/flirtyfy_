import { supabase } from './supabase';

export interface User {
  id: string;
  name: string;
  email: string;
}

const isSupabaseConfigured = () => {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder'
  );
};

export const auth = {
  signup: async (name: string, email: string, pass: string) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { name }
        }
      });
      if (error) return { error: error.message };
      if (data.user) {
        return { user: { id: data.user.id, name: data.user.user_metadata.name || name, email: data.user.email! } };
      }
      return { error: 'Signup failed' };
    }

    // Fallback to localStorage
    if (typeof window === 'undefined') return { error: 'Server error' };
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find((u: any) => u.email === email)) {
      return { error: 'User already exists with this email' };
    }
    const newUser = { id: Date.now().toString(), name, email, pass };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const currentUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return { user: currentUser };
  },
  
  login: async (email: string, pass: string) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) return { error: error.message };
      if (data.user) {
        return { user: { id: data.user.id, name: data.user.user_metadata.name || email.split('@')[0], email: data.user.email! } };
      }
      return { error: 'Login failed' };
    }

    // Fallback to localStorage
    if (typeof window === 'undefined') return { error: 'Server error' };
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.pass === pass);
    if (!user) {
      return { error: 'Invalid email or password' };
    }
    const currentUser = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return { user: currentUser };
  },
  
  logout: async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
      return;
    }

    // Fallback to localStorage
    if (typeof window === 'undefined') return;
    localStorage.removeItem('currentUser');
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    if (isSupabaseConfigured()) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        return {
          id: session.user.id,
          name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email!
        };
      }
      return null;
    }

    // Fallback to localStorage
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
};

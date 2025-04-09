import supabase from './supabaseClient';
import { User } from './types';

export const authService = {
  async signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      console.error('Error signing up:', error);
      throw error;
    }

    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error);
      throw error;
    }

    return data;
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    
    return user as User;
  },

  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting current session:', error);
      return null;
    }
    
    return session;
  },

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },

  async updateUserProfile(profile: Record<string, any>): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      data: profile,
    });

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
}; 
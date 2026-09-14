import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/database';

async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function signUpWithPassword(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) throw error;
  return data;
}

async function sendPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

async function deleteAccount() {
  // Actual account deletion must run server-side (service role) via an Edge
  // Function — the anon key can never be trusted to delete auth users.
  const { error } = await supabase.functions.invoke('delete-account');
  if (error) throw error;
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

export const authService = {
  signInWithPassword,
  signUpWithPassword,
  sendPasswordReset,
  updatePassword,
  deleteAccount,
  fetchProfile,
};

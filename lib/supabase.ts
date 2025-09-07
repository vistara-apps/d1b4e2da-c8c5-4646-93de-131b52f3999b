import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helper functions
export async function getOpportunities(filters?: {
  type?: string;
  tags?: string[];
  featured?: boolean;
}) {
  let query = supabase
    .from('opportunities')
    .select('*')
    .order('createdAt', { ascending: false });

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  if (filters?.featured) {
    query = query.eq('featured', true);
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.contains('tags', filters.tags);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching opportunities:', error);
    return [];
  }

  return data || [];
}

export async function getMasterclasses(isPremium?: boolean) {
  let query = supabase
    .from('masterclasses')
    .select('*')
    .order('createdAt', { ascending: false });

  if (typeof isPremium === 'boolean') {
    query = query.eq('isPremium', isPremium);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching masterclasses:', error);
    return [];
  }

  return data || [];
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('userId', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

export async function updateUserProfile(userId: string, updates: Partial<any>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('userId', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }

  return data;
}

export async function getFeedbackSessions(userId?: string) {
  let query = supabase
    .from('feedback_sessions')
    .select('*')
    .order('createdAt', { ascending: false });

  if (userId) {
    query = query.or(`creatorId.eq.${userId},participants.cs.{${userId}}`);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching feedback sessions:', error);
    return [];
  }

  return data || [];
}

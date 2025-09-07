export interface User {
  userId: string;
  username: string;
  email: string;
  walletAddress?: string;
  profile: {
    bio: string;
    university?: string;
    year?: string;
    avatar?: string;
  };
  skills: string[];
  interests: string[];
  subscriptionTier: 'free' | 'pro' | 'founders-circle';
  createdAt: string;
  updatedAt: string;
}

export interface Opportunity {
  opportunityId: string;
  title: string;
  description: string;
  type: 'grant' | 'competition' | 'investor' | 'accelerator';
  deadline: string;
  eligibility: string[];
  url: string;
  tags: string[];
  amount?: string;
  location?: string;
  createdAt: string;
  featured?: boolean;
}

export interface Masterclass {
  masterclassId: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  duration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructor?: string;
  thumbnail?: string;
  isPremium: boolean;
  createdAt: string;
}

export interface Connection {
  connectionId: string;
  user1Id: string;
  user2Id: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackSession {
  sessionId: string;
  creatorId: string;
  participants: string[];
  topic: string;
  description: string;
  feedback: {
    userId: string;
    content: string;
    timestamp: string;
  }[];
  status: 'open' | 'in-progress' | 'completed';
  maxParticipants: number;
  scheduledFor?: string;
  createdAt: string;
}

export interface SubscriptionTier {
  id: 'free' | 'pro' | 'founders-circle';
  name: string;
  price: number;
  features: string[];
  limits: {
    opportunities: number | 'unlimited';
    masterclasses: number | 'unlimited';
    connections: number | 'unlimited';
    feedbackSessions: number | 'unlimited';
  };
}

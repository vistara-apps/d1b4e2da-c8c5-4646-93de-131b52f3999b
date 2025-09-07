import { SubscriptionTier } from './types';

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Limited access to funding opportunities',
      'Basic masterclass content',
      'Community access',
      '5 connections per month'
    ],
    limits: {
      opportunities: 10,
      masterclasses: 3,
      connections: 5,
      feedbackSessions: 2
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 10,
    features: [
      'Full access to curated funding listings',
      'All masterclass content',
      'Priority community support',
      'Unlimited connections',
      'Weekly webinars'
    ],
    limits: {
      opportunities: 'unlimited',
      masterclasses: 'unlimited',
      connections: 'unlimited',
      feedbackSessions: 10
    }
  },
  {
    id: 'founders-circle',
    name: "Founder's Circle",
    price: 25,
    features: [
      'Everything in Pro',
      'Exclusive networking events',
      'Direct feedback sessions',
      'Mentor matching',
      'Early access to new features'
    ],
    limits: {
      opportunities: 'unlimited',
      masterclasses: 'unlimited',
      connections: 'unlimited',
      feedbackSessions: 'unlimited'
    }
  }
];

export const OPPORTUNITY_TYPES = [
  { value: 'grant', label: 'Grants' },
  { value: 'competition', label: 'Competitions' },
  { value: 'investor', label: 'Investors' },
  { value: 'accelerator', label: 'Accelerators' }
];

export const SKILL_CATEGORIES = [
  'Product Development',
  'Marketing',
  'Sales',
  'Finance',
  'Technology',
  'Design',
  'Operations',
  'Legal',
  'Strategy',
  'Leadership'
];

export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'E-commerce',
  'Sustainability',
  'Social Impact',
  'Entertainment',
  'Food & Beverage',
  'Transportation'
];

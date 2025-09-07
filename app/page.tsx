'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { OpportunityCard } from '@/components/OpportunityCard';
import { MasterclassCard } from '@/components/MasterclassCard';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  MessageCircle,
  ArrowRight,
  Star,
  Target,
  Zap
} from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const mockOpportunities = [
  {
    opportunityId: '1',
    title: 'Student Startup Grant 2024',
    description: 'Up to $50,000 in funding for innovative student-led startups focusing on sustainability and social impact.',
    type: 'grant' as const,
    deadline: '2024-03-15',
    eligibility: ['Currently enrolled student', 'Team of 2-4 members'],
    url: 'https://example.com/grant',
    tags: ['Sustainability', 'Social Impact', 'Early Stage'],
    amount: '$50,000',
    location: 'Global',
    createdAt: '2024-01-15',
    featured: true
  },
  {
    opportunityId: '2',
    title: 'TechCrunch Startup Battlefield',
    description: 'Compete for $100,000 and the chance to present at TechCrunch Disrupt.',
    type: 'competition' as const,
    deadline: '2024-02-28',
    eligibility: ['Early-stage startup', 'Less than $2M raised'],
    url: 'https://example.com/competition',
    tags: ['Technology', 'Competition', 'Pitch'],
    amount: '$100,000',
    location: 'San Francisco',
    createdAt: '2024-01-10',
    featured: false
  }
];

const mockMasterclasses = [
  {
    masterclassId: '1',
    title: 'Lean Canvas Fundamentals',
    description: 'Learn to create and validate your business model using the Lean Canvas methodology.',
    url: 'https://example.com/masterclass1',
    tags: ['Business Model', 'Validation', 'Strategy'],
    duration: '45 min',
    difficulty: 'beginner' as const,
    instructor: 'Sarah Chen',
    isPremium: false,
    createdAt: '2024-01-01'
  },
  {
    masterclassId: '2',
    title: 'Advanced Fundraising Strategies',
    description: 'Master the art of raising capital from angels, VCs, and strategic investors.',
    url: 'https://example.com/masterclass2',
    tags: ['Fundraising', 'Investors', 'Pitch Deck'],
    duration: '90 min',
    difficulty: 'advanced' as const,
    instructor: 'Michael Rodriguez',
    isPremium: true,
    createdAt: '2024-01-05'
  }
];

const stats = [
  { label: 'Active Opportunities', value: '127', icon: Target, color: 'text-blue-600' },
  { label: 'Student Founders', value: '2,341', icon: Users, color: 'text-green-600' },
  { label: 'Masterclasses', value: '89', icon: BookOpen, color: 'text-purple-600' },
  { label: 'Success Stories', value: '156', icon: Star, color: 'text-yellow-600' }
];

export default function Dashboard() {
  const [userTier] = useState<'free' | 'pro' | 'founders-circle'>('free');

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-text-primary">
            Welcome to <span className="text-primary">NicheConnect</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Your curated launchpad for student entrepreneur success. Discover funding, enhance skills, and connect with peers.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <div className="space-y-2">
                <stat.icon className={`h-8 w-8 mx-auto ${stat.color}`} />
                <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center">
              <Zap className="h-6 w-6 mr-2 text-accent" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/opportunities">
                <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                  <Target className="h-6 w-6" />
                  <span>Find Funding</span>
                </Button>
              </Link>
              <Link href="/masterclasses">
                <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                  <BookOpen className="h-6 w-6" />
                  <span>Learn Skills</span>
                </Button>
              </Link>
              <Link href="/connections">
                <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                  <Users className="h-6 w-6" />
                  <span>Find Co-founders</span>
                </Button>
              </Link>
              <Link href="/feedback">
                <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                  <MessageCircle className="h-6 w-6" />
                  <span>Get Feedback</span>
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Featured Opportunities */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-primary" />
              Featured Opportunities
            </h2>
            <Link href="/opportunities">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.opportunityId}
                opportunity={opportunity}
                onSave={(id) => console.log('Saved opportunity:', id)}
              />
            ))}
          </div>
        </div>

        {/* Popular Masterclasses */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center">
              <BookOpen className="h-6 w-6 mr-2 text-accent" />
              Popular Masterclasses
            </h2>
            <Link href="/masterclasses">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockMasterclasses.map((masterclass) => (
              <MasterclassCard
                key={masterclass.masterclassId}
                masterclass={masterclass}
                userTier={userTier}
                onStart={(id) => console.log('Started masterclass:', id)}
              />
            ))}
          </div>
        </div>

        {/* Upgrade CTA */}
        {userTier === 'free' && (
          <Card variant="featured">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-text-primary">
                Ready to unlock your full potential?
              </h3>
              <p className="text-text-secondary">
                Upgrade to Pro for unlimited access to funding opportunities, masterclasses, and exclusive networking events.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="primary" size="lg">
                  Upgrade to Pro - $10/month
                </Button>
                <Link href="/payment-test">
                  <Button variant="outline" size="lg">
                    Test x402 Payments
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

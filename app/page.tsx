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
        <div className="text-center space-y-6 py-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-text-primary leading-tight">
              Welcome to{' '}
              <span className="text-gradient-primary">NicheConnect</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Your curated launchpad for student entrepreneur success. Discover funding, enhance skills, and connect with peers.
            </p>
          </div>
          
          {/* Quick CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="primary" 
              size="lg"
              className="gradient-primary shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="text-center hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-3">
                <div className="relative">
                  <div className={`h-12 w-12 mx-auto rounded-full bg-gradient-to-br ${
                    stat.color.includes('blue') ? 'from-primary/20 to-primary/10' :
                    stat.color.includes('green') ? 'from-green-500/20 to-green-500/10' :
                    stat.color.includes('purple') ? 'from-accent/20 to-accent/10' :
                    'from-yellow-500/20 to-yellow-500/10'
                  } flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-text-primary">{stat.value}</div>
                <div className="text-sm font-medium text-text-secondary">{stat.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-surface to-muted/30">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-600 flex items-center justify-center mr-3">
                <Zap className="h-5 w-5 text-white" />
              </div>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/opportunities" className="group">
                <div className="h-24 p-4 rounded-lg border border-border bg-surface hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 flex flex-col items-center justify-center space-y-2 group-hover:scale-105">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors duration-300">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-text-primary">Find Funding</span>
                </div>
              </Link>
              <Link href="/masterclasses" className="group">
                <div className="h-24 p-4 rounded-lg border border-border bg-surface hover:bg-accent/5 hover:border-accent/30 transition-all duration-300 flex flex-col items-center justify-center space-y-2 group-hover:scale-105">
                  <div className="h-8 w-8 rounded-lg bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center transition-colors duration-300">
                    <BookOpen className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-text-primary">Learn Skills</span>
                </div>
              </Link>
              <Link href="/connections" className="group">
                <div className="h-24 p-4 rounded-lg border border-border bg-surface hover:bg-secondary/5 hover:border-secondary/30 transition-all duration-300 flex flex-col items-center justify-center space-y-2 group-hover:scale-105">
                  <div className="h-8 w-8 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 flex items-center justify-center transition-colors duration-300">
                    <Users className="h-5 w-5 text-secondary" />
                  </div>
                  <span className="text-sm font-medium text-text-primary">Find Co-founders</span>
                </div>
              </Link>
              <Link href="/feedback" className="group">
                <div className="h-24 p-4 rounded-lg border border-border bg-surface hover:bg-green-500/5 hover:border-green-500/30 transition-all duration-300 flex flex-col items-center justify-center space-y-2 group-hover:scale-105">
                  <div className="h-8 w-8 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 flex items-center justify-center transition-colors duration-300">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-text-primary">Get Feedback</span>
                </div>
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
          <Card variant="featured" className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10" />
            <div className="relative text-center space-y-6 py-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-text-primary">
                  Ready to unlock your full potential?
                </h3>
                <p className="text-text-secondary max-w-2xl mx-auto">
                  Upgrade to Pro for unlimited access to funding opportunities, masterclasses, and exclusive networking events.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="gradient-primary shadow-lg hover:shadow-xl"
                >
                  Upgrade to Pro - $10/month
                  <Star className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
              
              <div className="flex justify-center items-center space-x-6 text-sm text-text-muted">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

'use client';

import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Dropdown } from '@/components/Dropdown';
import { MasterclassCard } from '@/components/MasterclassCard';
import { Search, Filter, BookOpen, Lock } from 'lucide-react';

// Extended mock data
const mockMasterclasses = [
  {
    masterclassId: '1',
    title: 'Lean Canvas Fundamentals',
    description: 'Learn to create and validate your business model using the Lean Canvas methodology. Perfect for beginners looking to structure their startup ideas.',
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
    description: 'Master the art of raising capital from angels, VCs, and strategic investors. Learn pitch deck creation, valuation, and negotiation tactics.',
    url: 'https://example.com/masterclass2',
    tags: ['Fundraising', 'Investors', 'Pitch Deck'],
    duration: '90 min',
    difficulty: 'advanced' as const,
    instructor: 'Michael Rodriguez',
    isPremium: true,
    createdAt: '2024-01-05'
  },
  {
    masterclassId: '3',
    title: 'Customer Discovery & Validation',
    description: 'Learn how to talk to customers, validate your assumptions, and build products people actually want.',
    url: 'https://example.com/masterclass3',
    tags: ['Customer Development', 'Validation', 'Research'],
    duration: '60 min',
    difficulty: 'intermediate' as const,
    instructor: 'Emily Johnson',
    isPremium: false,
    createdAt: '2024-01-08'
  },
  {
    masterclassId: '4',
    title: 'Legal Essentials for Founders',
    description: 'Navigate the legal landscape of starting a company. Cover incorporation, equity, contracts, and intellectual property.',
    url: 'https://example.com/masterclass4',
    tags: ['Legal', 'Incorporation', 'IP'],
    duration: '75 min',
    difficulty: 'intermediate' as const,
    instructor: 'David Park',
    isPremium: true,
    createdAt: '2024-01-12'
  },
  {
    masterclassId: '5',
    title: 'Digital Marketing for Startups',
    description: 'Build your brand and acquire customers through digital marketing channels. Learn SEO, social media, and content marketing.',
    url: 'https://example.com/masterclass5',
    tags: ['Marketing', 'Digital', 'Growth'],
    duration: '55 min',
    difficulty: 'beginner' as const,
    instructor: 'Lisa Wang',
    isPremium: false,
    createdAt: '2024-01-15'
  },
  {
    masterclassId: '6',
    title: 'Financial Modeling & Projections',
    description: 'Create compelling financial models and projections for your startup. Essential for fundraising and strategic planning.',
    url: 'https://example.com/masterclass6',
    tags: ['Finance', 'Modeling', 'Projections'],
    duration: '80 min',
    difficulty: 'advanced' as const,
    instructor: 'Robert Kim',
    isPremium: true,
    createdAt: '2024-01-18'
  }
];

const difficultyOptions = [
  { value: '', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

const sortOptions = [
  { value: 'created', label: 'Recently Added' },
  { value: 'title', label: 'Title (A-Z)' },
  { value: 'difficulty', label: 'Difficulty' },
  { value: 'duration', label: 'Duration' }
];

export default function MasterclassesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [sortBy, setSortBy] = useState('created');
  const [userTier] = useState<'free' | 'pro' | 'founders-circle'>('free');

  // Filter and sort masterclasses
  const filteredMasterclasses = mockMasterclasses
    .filter(masterclass => {
      const matchesSearch = masterclass.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           masterclass.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           masterclass.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDifficulty = !selectedDifficulty || masterclass.difficulty === selectedDifficulty;
      const matchesPremium = !showPremiumOnly || masterclass.isPremium;
      return matchesSearch && matchesDifficulty && matchesPremium;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'duration':
          const aDuration = parseInt(a.duration?.replace(/[^0-9]/g, '') || '0');
          const bDuration = parseInt(b.duration?.replace(/[^0-9]/g, '') || '0');
          return aDuration - bDuration;
        case 'created':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const freeCount = filteredMasterclasses.filter(m => !m.isPremium).length;
  const premiumCount = filteredMasterclasses.filter(m => m.isPremium).length;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-text-primary">
            Skill Masterclasses
          </h1>
          <p className="text-text-secondary">
            Learn essential startup skills through our curated library of masterclasses and workshops.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <BookOpen className="h-8 w-8 mx-auto text-primary mb-2" />
            <div className="text-2xl font-bold text-text-primary">{freeCount}</div>
            <div className="text-sm text-text-secondary">Free Classes</div>
          </Card>
          <Card className="text-center">
            <Lock className="h-8 w-8 mx-auto text-purple-600 mb-2" />
            <div className="text-2xl font-bold text-text-primary">{premiumCount}</div>
            <div className="text-sm text-text-secondary">Premium Classes</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-text-primary">12</div>
            <div className="text-sm text-text-secondary">Expert Instructors</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-text-primary">850+</div>
            <div className="text-sm text-text-secondary">Students Enrolled</div>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters & Search
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input
                  placeholder="Search masterclasses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Dropdown
                options={difficultyOptions}
                value={selectedDifficulty}
                onChange={setSelectedDifficulty}
                placeholder="Filter by difficulty"
              />
              
              <Dropdown
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                placeholder="Sort by"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPremiumOnly}
                  onChange={(e) => setShowPremiumOnly(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-text-secondary">Premium only</span>
              </label>
            </div>
          </div>
        </Card>

        {/* Upgrade CTA for Free Users */}
        {userTier === 'free' && (
          <Card variant="featured">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-text-primary">
                  Unlock Premium Masterclasses
                </h3>
                <p className="text-text-secondary">
                  Get unlimited access to advanced courses and exclusive content.
                </p>
              </div>
              <Button variant="primary">
                Upgrade to Pro
              </Button>
            </div>
          </Card>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-text-secondary">
            Showing {filteredMasterclasses.length} masterclasses
          </p>
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <span>Your tier: </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              userTier === 'free' ? 'bg-gray-100 text-gray-800' :
              userTier === 'pro' ? 'bg-blue-100 text-blue-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {userTier.charAt(0).toUpperCase() + userTier.slice(1)}
            </span>
          </div>
        </div>

        {/* Masterclasses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMasterclasses.map((masterclass) => (
            <MasterclassCard
              key={masterclass.masterclassId}
              masterclass={masterclass}
              userTier={userTier}
              onStart={(id) => console.log('Started masterclass:', id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredMasterclasses.length === 0 && (
          <Card>
            <div className="text-center py-12 space-y-4">
              <BookOpen className="h-12 w-12 text-text-secondary mx-auto" />
              <h3 className="text-lg font-semibold text-text-primary">
                No masterclasses found
              </h3>
              <p className="text-text-secondary">
                Try adjusting your search terms or filters to find more content.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDifficulty('');
                  setShowPremiumOnly(false);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </Card>
        )}

        {/* Load More */}
        {filteredMasterclasses.length > 0 && (
          <div className="text-center">
            <Button variant="outline">
              Load More Masterclasses
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

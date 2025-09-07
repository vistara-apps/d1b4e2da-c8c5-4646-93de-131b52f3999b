'use client';

import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Dropdown } from '@/components/Dropdown';
import { OpportunityCard } from '@/components/OpportunityCard';
import { Search, Filter, SortAsc } from 'lucide-react';
import { OPPORTUNITY_TYPES } from '@/lib/constants';

// Extended mock data
const mockOpportunities = [
  {
    opportunityId: '1',
    title: 'Student Startup Grant 2024',
    description: 'Up to $50,000 in funding for innovative student-led startups focusing on sustainability and social impact. This comprehensive grant program supports early-stage ventures with both financial resources and mentorship.',
    type: 'grant' as const,
    deadline: '2024-03-15',
    eligibility: ['Currently enrolled student', 'Team of 2-4 members', 'Sustainability focus'],
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
    description: 'Compete for $100,000 and the chance to present at TechCrunch Disrupt. This prestigious competition brings together the most innovative startups from around the world.',
    type: 'competition' as const,
    deadline: '2024-02-28',
    eligibility: ['Early-stage startup', 'Less than $2M raised', 'Technology focus'],
    url: 'https://example.com/competition',
    tags: ['Technology', 'Competition', 'Pitch'],
    amount: '$100,000',
    location: 'San Francisco',
    createdAt: '2024-01-10',
    featured: false
  },
  {
    opportunityId: '3',
    title: 'University Innovation Challenge',
    description: 'A campus-wide competition for student entrepreneurs to showcase their innovative solutions to real-world problems.',
    type: 'competition' as const,
    deadline: '2024-04-01',
    eligibility: ['University student', 'Original idea', 'Team presentation'],
    url: 'https://example.com/uni-challenge',
    tags: ['Innovation', 'University', 'Problem Solving'],
    amount: '$25,000',
    location: 'Various Universities',
    createdAt: '2024-01-20',
    featured: false
  },
  {
    opportunityId: '4',
    title: 'Angel Investor Network',
    description: 'Connect with a network of angel investors specifically interested in student-founded companies.',
    type: 'investor' as const,
    deadline: '2024-12-31',
    eligibility: ['Student founder', 'MVP ready', 'Scalable business model'],
    url: 'https://example.com/angels',
    tags: ['Angel Investment', 'Networking', 'Mentorship'],
    amount: '$10K - $100K',
    location: 'Online',
    createdAt: '2024-01-05',
    featured: true
  },
  {
    opportunityId: '5',
    title: 'Climate Tech Accelerator',
    description: 'A 12-week accelerator program for climate technology startups with funding and mentorship.',
    type: 'accelerator' as const,
    deadline: '2024-03-30',
    eligibility: ['Climate tech focus', 'Early stage', 'Committed team'],
    url: 'https://example.com/climate-accelerator',
    tags: ['Climate Tech', 'Accelerator', 'Sustainability'],
    amount: '$75,000',
    location: 'Boston',
    createdAt: '2024-01-12',
    featured: false
  }
];

const sortOptions = [
  { value: 'deadline', label: 'Deadline (Soonest)' },
  { value: 'amount', label: 'Amount (Highest)' },
  { value: 'created', label: 'Recently Added' },
  { value: 'featured', label: 'Featured First' }
];

export default function OpportunitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const [savedOpportunities, setSavedOpportunities] = useState<string[]>([]);

  const handleSaveOpportunity = (id: string) => {
    setSavedOpportunities(prev => 
      prev.includes(id) 
        ? prev.filter(savedId => savedId !== id)
        : [...prev, id]
    );
  };

  // Filter and sort opportunities
  const filteredOpportunities = mockOpportunities
    .filter(opp => {
      const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           opp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = !selectedType || opp.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'amount':
          const aAmount = parseInt(a.amount?.replace(/[^0-9]/g, '') || '0');
          const bAmount = parseInt(b.amount?.replace(/[^0-9]/g, '') || '0');
          return bAmount - aAmount;
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:
          return 0;
      }
    });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-text-primary">
            Funding Opportunities
          </h1>
          <p className="text-text-secondary">
            Discover grants, competitions, investors, and accelerators tailored for student entrepreneurs.
          </p>
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
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Dropdown
                options={[
                  { value: '', label: 'All Types' },
                  ...OPPORTUNITY_TYPES
                ]}
                value={selectedType}
                onChange={setSelectedType}
                placeholder="Filter by type"
              />
              
              <Dropdown
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                placeholder="Sort by"
              />
            </div>
          </div>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-text-secondary">
            Showing {filteredOpportunities.length} opportunities
          </p>
          <Button variant="outline" size="sm">
            <SortAsc className="h-4 w-4 mr-2" />
            Sort
          </Button>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOpportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.opportunityId}
              opportunity={opportunity}
              onSave={handleSaveOpportunity}
              isSaved={savedOpportunities.includes(opportunity.opportunityId)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredOpportunities.length === 0 && (
          <Card>
            <div className="text-center py-12 space-y-4">
              <Search className="h-12 w-12 text-text-secondary mx-auto" />
              <h3 className="text-lg font-semibold text-text-primary">
                No opportunities found
              </h3>
              <p className="text-text-secondary">
                Try adjusting your search terms or filters to find more opportunities.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </Card>
        )}

        {/* Load More */}
        {filteredOpportunities.length > 0 && (
          <div className="text-center">
            <Button variant="outline">
              Load More Opportunities
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

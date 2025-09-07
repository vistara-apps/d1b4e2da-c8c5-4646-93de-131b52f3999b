'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Dropdown } from '@/components/Dropdown';
import { 
  Users, 
  Search, 
  Filter,
  MessageCircle,
  UserPlus,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { User, Connection } from '@/lib/types';
import { findPotentialMatches } from '@/lib/ai-matching';

// Mock data for demonstration
const mockUsers: User[] = [
  {
    userId: '1',
    username: 'sarah_chen',
    email: 'sarah@example.com',
    walletAddress: '0x1234...5678',
    profile: {
      bio: 'Building sustainable fashion marketplace. Looking for technical co-founder with React/Node.js experience.',
      university: 'Stanford University',
      year: 'Senior',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    skills: ['Product Management', 'UI/UX Design', 'Market Research', 'Sustainability'],
    interests: ['Fashion Tech', 'Sustainability', 'E-commerce', 'Social Impact'],
    subscriptionTier: 'pro',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    userId: '2',
    username: 'mike_rodriguez',
    email: 'mike@example.com',
    profile: {
      bio: 'Full-stack developer passionate about fintech. Seeking business-minded co-founder for crypto payment solution.',
      university: 'MIT',
      year: 'Graduate',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    skills: ['React', 'Node.js', 'Blockchain', 'Smart Contracts', 'Python'],
    interests: ['Fintech', 'Cryptocurrency', 'DeFi', 'Web3'],
    subscriptionTier: 'founders-circle',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z'
  },
  {
    userId: '3',
    username: 'alex_kim',
    email: 'alex@example.com',
    profile: {
      bio: 'AI/ML researcher working on healthcare applications. Looking for domain expert in medical field.',
      university: 'UC Berkeley',
      year: 'PhD Candidate',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    skills: ['Machine Learning', 'Python', 'TensorFlow', 'Data Science', 'Research'],
    interests: ['Healthcare', 'AI/ML', 'Medical Technology', 'Research'],
    subscriptionTier: 'pro',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-19T00:00:00Z'
  }
];

const mockConnections: Connection[] = [
  {
    connectionId: '1',
    user1Id: 'current-user',
    user2Id: '1',
    status: 'pending',
    message: 'Hi Sarah! I\'m a full-stack developer interested in sustainable tech. Would love to discuss your fashion marketplace idea!',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    connectionId: '2',
    user1Id: '2',
    user2Id: 'current-user',
    status: 'accepted',
    message: 'Hey! I saw your profile and think we could be a great match for a fintech startup. Let\'s chat!',
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-19T00:00:00Z'
  }
];

const skillOptions = [
  'React', 'Node.js', 'Python', 'Machine Learning', 'UI/UX Design', 
  'Product Management', 'Marketing', 'Sales', 'Business Development',
  'Blockchain', 'Data Science', 'Mobile Development', 'DevOps'
];

const interestOptions = [
  'Fintech', 'Healthcare', 'E-commerce', 'AI/ML', 'Sustainability',
  'Social Impact', 'Education', 'Gaming', 'Fashion Tech', 'Food Tech'
];

interface UserCardProps {
  user: User;
  onConnect: (userId: string) => void;
  onMessage: (userId: string) => void;
  connectionStatus?: 'none' | 'pending' | 'connected';
  matchScore?: number;
}

function UserCard({ user, onConnect, onMessage, connectionStatus = 'none', matchScore }: UserCardProps) {
  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'founders-circle': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pro': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'founders-circle': return 'Founder\'s Circle';
      case 'pro': return 'Pro';
      default: return 'Free';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={user.profile.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover"
              />
              {matchScore && (
                <div className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                  {Math.round(matchScore)}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">@{user.username}</h3>
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <GraduationCap className="h-4 w-4" />
                <span>{user.profile.university}</span>
                {user.profile.year && <span>• {user.profile.year}</span>}
              </div>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getTierBadgeColor(user.subscriptionTier)}`}>
            {getTierLabel(user.subscriptionTier)}
          </div>
        </div>

        {/* Bio */}
        <p className="text-text-secondary text-sm leading-relaxed">
          {user.profile.bio}
        </p>

        {/* Skills */}
        <div>
          <div className="flex items-center space-x-1 mb-2">
            <Briefcase className="h-4 w-4 text-text-secondary" />
            <span className="text-sm font-medium text-text-secondary">Skills</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {user.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
            {user.skills.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{user.skills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Interests */}
        <div>
          <div className="flex items-center space-x-1 mb-2">
            <Star className="h-4 w-4 text-text-secondary" />
            <span className="text-sm font-medium text-text-secondary">Interests</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {user.interests.slice(0, 3).map((interest) => (
              <span
                key={interest}
                className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
              >
                {interest}
              </span>
            ))}
            {user.interests.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{user.interests.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          {connectionStatus === 'none' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onConnect(user.userId)}
              className="flex-1"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Connect
            </Button>
          )}
          {connectionStatus === 'pending' && (
            <Button variant="outline" size="sm" disabled className="flex-1">
              <Clock className="h-4 w-4 mr-1" />
              Pending
            </Button>
          )}
          {connectionStatus === 'connected' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMessage(user.userId)}
              className="flex-1"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Message
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

interface ConnectionRequestCardProps {
  connection: Connection;
  user: User;
  onAccept: (connectionId: string) => void;
  onDecline: (connectionId: string) => void;
}

function ConnectionRequestCard({ connection, user, onAccept, onDecline }: ConnectionRequestCardProps) {
  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <img
            src={user.profile.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
            alt={user.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-medium text-text-primary">@{user.username}</h4>
            <p className="text-sm text-text-secondary">{user.profile.university}</p>
          </div>
        </div>
        
        {connection.message && (
          <p className="text-sm text-text-secondary bg-gray-50 p-3 rounded-lg">
            "{connection.message}"
          </p>
        )}
        
        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAccept(connection.connectionId)}
            className="flex-1"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Accept
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDecline(connection.connectionId)}
            className="flex-1"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Decline
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function ConnectionsPage() {
  const [activeTab, setActiveTab] = useState<'discover' | 'requests' | 'connections'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [connections, setConnections] = useState<Connection[]>(mockConnections);
  const [isLoading, setIsLoading] = useState(false);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery || 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.profile.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.profile.university?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSkills = selectedSkills.length === 0 || 
      selectedSkills.some(skill => user.skills.includes(skill));

    const matchesInterests = selectedInterests.length === 0 || 
      selectedInterests.some(interest => user.interests.includes(interest));

    return matchesSearch && matchesSkills && matchesInterests;
  });

  // Get AI-powered matches
  const getAIMatches = async () => {
    setIsLoading(true);
    try {
      // Mock current user profile
      const currentUser = {
        skills: ['React', 'Node.js', 'Product Management'],
        interests: ['Fintech', 'E-commerce', 'AI/ML'],
        bio: 'Full-stack developer looking for business co-founder'
      };
      
      const matches = await findPotentialMatches(currentUser, users);
      setUsers(matches);
    } catch (error) {
      console.error('Error getting AI matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = (userId: string) => {
    // In a real app, this would make an API call
    console.log('Connecting to user:', userId);
    // Show success message or modal for connection request
  };

  const handleMessage = (userId: string) => {
    // In a real app, this would open a chat interface
    console.log('Messaging user:', userId);
  };

  const handleAcceptConnection = (connectionId: string) => {
    setConnections(prev => 
      prev.map(conn => 
        conn.connectionId === connectionId 
          ? { ...conn, status: 'accepted' as const }
          : conn
      )
    );
  };

  const handleDeclineConnection = (connectionId: string) => {
    setConnections(prev => 
      prev.filter(conn => conn.connectionId !== connectionId)
    );
  };

  const pendingRequests = connections.filter(conn => conn.status === 'pending');
  const acceptedConnections = connections.filter(conn => conn.status === 'accepted');

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-text-primary flex items-center justify-center">
            <Users className="h-8 w-8 mr-3 text-primary" />
            Founder Matching
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Connect with like-minded student entrepreneurs. Find co-founders, collaborators, and build your network.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'discover'
                ? 'bg-white text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Discover ({filteredUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'requests'
                ? 'bg-white text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Requests ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'connections'
                ? 'bg-white text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Connections ({acceptedConnections.length})
          </button>
        </div>

        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by name, bio, or university..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      icon={Search}
                    />
                  </div>
                  <Button
                    variant="primary"
                    onClick={getAIMatches}
                    disabled={isLoading}
                    className="flex items-center space-x-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{isLoading ? 'Finding...' : 'AI Match'}</span>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Dropdown
                    label="Skills"
                    options={skillOptions}
                    value={selectedSkills}
                    onChange={setSelectedSkills}
                    multiple
                    placeholder="Filter by skills..."
                  />
                  <Dropdown
                    label="Interests"
                    options={interestOptions}
                    value={selectedInterests}
                    onChange={setSelectedInterests}
                    multiple
                    placeholder="Filter by interests..."
                  />
                </div>
              </div>
            </Card>

            {/* Users Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.userId}
                  user={user}
                  onConnect={handleConnect}
                  onMessage={handleMessage}
                  matchScore={user.matchScore}
                />
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <Card>
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No matches found</h3>
                  <p className="text-text-secondary">
                    Try adjusting your search criteria or use AI matching to find potential co-founders.
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {pendingRequests.length > 0 ? (
              pendingRequests.map((connection) => {
                const user = users.find(u => u.userId === connection.user1Id);
                if (!user) return null;
                
                return (
                  <ConnectionRequestCard
                    key={connection.connectionId}
                    connection={connection}
                    user={user}
                    onAccept={handleAcceptConnection}
                    onDecline={handleDeclineConnection}
                  />
                );
              })
            ) : (
              <Card>
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No pending requests</h3>
                  <p className="text-text-secondary">
                    Connection requests from other founders will appear here.
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Connections Tab */}
        {activeTab === 'connections' && (
          <div className="space-y-4">
            {acceptedConnections.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {acceptedConnections.map((connection) => {
                  const user = users.find(u => u.userId === connection.user2Id);
                  if (!user) return null;
                  
                  return (
                    <UserCard
                      key={connection.connectionId}
                      user={user}
                      onConnect={handleConnect}
                      onMessage={handleMessage}
                      connectionStatus="connected"
                    />
                  );
                })}
              </div>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No connections yet</h3>
                  <p className="text-text-secondary">
                    Start connecting with other founders to build your network.
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

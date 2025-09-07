'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { 
  MessageCircle, 
  Plus, 
  Users, 
  Clock,
  CheckCircle,
  Star,
  Calendar,
  User,
  ArrowRight,
  MessageSquare,
  Target,
  Lightbulb
} from 'lucide-react';
import { FeedbackSession } from '@/lib/types';

// Mock data for demonstration
const mockFeedbackSessions: FeedbackSession[] = [
  {
    sessionId: '1',
    creatorId: 'user-1',
    participants: ['user-2', 'user-3', 'user-4'],
    topic: 'SaaS Pricing Strategy Review',
    description: 'Looking for feedback on our B2B SaaS pricing model. We\'re considering freemium vs. tiered pricing and need insights on market positioning.',
    feedback: [
      {
        userId: 'user-2',
        content: 'Your freemium model looks solid, but consider limiting core features more aggressively to drive conversions. The $49/month tier seems well-positioned for SMBs.',
        timestamp: '2024-01-20T10:30:00Z'
      },
      {
        userId: 'user-3',
        content: 'Have you considered usage-based pricing? For SaaS tools like yours, customers often prefer paying for what they use rather than fixed tiers.',
        timestamp: '2024-01-20T11:15:00Z'
      }
    ],
    status: 'in-progress',
    maxParticipants: 5,
    scheduledFor: '2024-01-25T15:00:00Z',
    createdAt: '2024-01-18T00:00:00Z'
  },
  {
    sessionId: '2',
    creatorId: 'user-5',
    participants: ['user-1', 'user-6'],
    topic: 'Mobile App UX Feedback',
    description: 'Seeking feedback on our fitness app\'s onboarding flow. Users are dropping off at the goal-setting step and we need fresh perspectives.',
    feedback: [
      {
        userId: 'user-1',
        content: 'The goal-setting step feels overwhelming with too many options. Consider progressive disclosure - start with 2-3 basic goals and let users add more later.',
        timestamp: '2024-01-19T14:20:00Z'
      }
    ],
    status: 'completed',
    maxParticipants: 4,
    createdAt: '2024-01-17T00:00:00Z'
  },
  {
    sessionId: '3',
    creatorId: 'current-user',
    participants: ['user-7', 'user-8'],
    topic: 'Go-to-Market Strategy for EdTech Platform',
    description: 'Need feedback on our B2B EdTech go-to-market strategy. Targeting K-12 schools but unsure about sales approach and pricing.',
    feedback: [],
    status: 'open',
    maxParticipants: 6,
    scheduledFor: '2024-01-28T16:00:00Z',
    createdAt: '2024-01-19T00:00:00Z'
  }
];

const mockUsers = {
  'user-1': { username: 'sarah_chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face' },
  'user-2': { username: 'mike_rodriguez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
  'user-3': { username: 'alex_kim', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
  'user-4': { username: 'emma_davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
  'user-5': { username: 'david_wilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face' },
  'user-6': { username: 'lisa_zhang', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face' },
  'user-7': { username: 'james_brown', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face' },
  'user-8': { username: 'maria_garcia', avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=40&h=40&fit=crop&crop=face' }
};

interface FeedbackSessionCardProps {
  session: FeedbackSession;
  onJoin: (sessionId: string) => void;
  onViewDetails: (sessionId: string) => void;
  isOwner?: boolean;
}

function FeedbackSessionCard({ session, onJoin, onViewDetails, isOwner = false }: FeedbackSessionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Target className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canJoin = session.status === 'open' && 
                  session.participants.length < session.maxParticipants && 
                  !isOwner;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-text-primary mb-1">{session.topic}</h3>
            <p className="text-sm text-text-secondary line-clamp-2">
              {session.description}
            </p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(session.status)}`}>
            {getStatusIcon(session.status)}
            <span className="capitalize">{session.status.replace('-', ' ')}</span>
          </div>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-text-secondary" />
            <span className="text-sm text-text-secondary">
              {session.participants.length}/{session.maxParticipants} participants
            </span>
            <div className="flex -space-x-1">
              {session.participants.slice(0, 3).map((participantId) => {
                const user = mockUsers[participantId as keyof typeof mockUsers];
                return user ? (
                  <img
                    key={participantId}
                    src={user.avatar}
                    alt={user.username}
                    className="w-6 h-6 rounded-full border-2 border-white"
                  />
                ) : null;
              })}
              {session.participants.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{session.participants.length - 3}</span>
                </div>
              )}
            </div>
          </div>
          
          {session.feedback.length > 0 && (
            <div className="flex items-center space-x-1 text-sm text-text-secondary">
              <MessageSquare className="h-4 w-4" />
              <span>{session.feedback.length} feedback</span>
            </div>
          )}
        </div>

        {/* Scheduled time */}
        {session.scheduledFor && (
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Calendar className="h-4 w-4" />
            <span>Scheduled for {formatDate(session.scheduledFor)}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          {canJoin && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onJoin(session.sessionId)}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-1" />
              Join Circle
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(session.sessionId)}
            className={canJoin ? 'flex-1' : 'flex-1'}
          >
            View Details
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sessionData: Partial<FeedbackSession>) => void;
}

function CreateSessionModal({ isOpen, onClose, onSubmit }: CreateSessionModalProps) {
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    maxParticipants: 5,
    scheduledFor: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      sessionId: Date.now().toString(),
      creatorId: 'current-user',
      participants: [],
      feedback: [],
      status: 'open' as const,
      createdAt: new Date().toISOString()
    });
    setFormData({ topic: '', description: '', maxParticipants: 5, scheduledFor: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Create Feedback Circle</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Topic *
            </label>
            <Input
              placeholder="e.g., Product pricing strategy review"
              value={formData.topic}
              onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Description *
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={3}
              placeholder="Describe what kind of feedback you're looking for..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Max Participants
            </label>
            <select
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={formData.maxParticipants}
              onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
            >
              <option value={3}>3 participants</option>
              <option value={4}>4 participants</option>
              <option value={5}>5 participants</option>
              <option value={6}>6 participants</option>
              <option value={8}>8 participants</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Schedule For (Optional)
            </label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={formData.scheduledFor}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledFor: e.target.value }))}
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Create Circle
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'my-sessions' | 'joined'>('all');
  const [sessions, setSessions] = useState<FeedbackSession[]>(mockFeedbackSessions);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter sessions based on active tab
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = !searchQuery || 
      session.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description.toLowerCase().includes(searchQuery.toLowerCase());

    switch (activeTab) {
      case 'my-sessions':
        return session.creatorId === 'current-user' && matchesSearch;
      case 'joined':
        return session.participants.includes('current-user') && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const handleJoinSession = (sessionId: string) => {
    setSessions(prev => 
      prev.map(session => 
        session.sessionId === sessionId
          ? { ...session, participants: [...session.participants, 'current-user'] }
          : session
      )
    );
  };

  const handleViewDetails = (sessionId: string) => {
    // In a real app, this would navigate to a detailed session view
    console.log('Viewing session details:', sessionId);
  };

  const handleCreateSession = (sessionData: Partial<FeedbackSession>) => {
    setSessions(prev => [sessionData as FeedbackSession, ...prev]);
  };

  const stats = [
    { label: 'Active Circles', value: sessions.filter(s => s.status === 'open').length, icon: Target },
    { label: 'My Sessions', value: sessions.filter(s => s.creatorId === 'current-user').length, icon: User },
    { label: 'Joined Circles', value: sessions.filter(s => s.participants.includes('current-user')).length, icon: Users },
    { label: 'Total Feedback', value: sessions.reduce((acc, s) => acc + s.feedback.length, 0), icon: MessageSquare }
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-text-primary flex items-center justify-center">
            <MessageCircle className="h-8 w-8 mr-3 text-primary" />
            Feedback Circles
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Get structured feedback from fellow entrepreneurs. Share your challenges and help others grow.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <div className="space-y-2">
                <stat.icon className="h-6 w-6 mx-auto text-primary" />
                <div className="text-xl font-bold text-text-primary">{stat.value}</div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search feedback circles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={MessageCircle}
            />
          </div>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Circle</span>
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-white text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            All Circles ({sessions.length})
          </button>
          <button
            onClick={() => setActiveTab('my-sessions')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'my-sessions'
                ? 'bg-white text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            My Sessions ({sessions.filter(s => s.creatorId === 'current-user').length})
          </button>
          <button
            onClick={() => setActiveTab('joined')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'joined'
                ? 'bg-white text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Joined ({sessions.filter(s => s.participants.includes('current-user')).length})
          </button>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSessions.map((session) => (
            <FeedbackSessionCard
              key={session.sessionId}
              session={session}
              onJoin={handleJoinSession}
              onViewDetails={handleViewDetails}
              isOwner={session.creatorId === 'current-user'}
            />
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">
                {activeTab === 'all' ? 'No feedback circles found' : 
                 activeTab === 'my-sessions' ? 'You haven\'t created any circles yet' :
                 'You haven\'t joined any circles yet'}
              </h3>
              <p className="text-text-secondary mb-4">
                {activeTab === 'all' ? 'Try adjusting your search or create a new feedback circle.' :
                 activeTab === 'my-sessions' ? 'Create your first feedback circle to get insights from fellow entrepreneurs.' :
                 'Join existing circles to share your expertise and learn from others.'}
              </p>
              {activeTab !== 'joined' && (
                <Button
                  variant="primary"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Circle
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Create Session Modal */}
        <CreateSessionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateSession}
        />
      </div>
    </AppShell>
  );
}

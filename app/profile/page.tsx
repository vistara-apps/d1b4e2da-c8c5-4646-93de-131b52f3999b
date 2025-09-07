'use client';

import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { 
  User, 
  Settings, 
  Camera,
  Save,
  Plus,
  X,
  GraduationCap,
  Briefcase,
  Star,
  Crown,
  Shield,
  Wallet,
  Bell,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { User as UserType, SubscriptionTier } from '@/lib/types';

// Mock user data
const mockUser: UserType = {
  userId: 'current-user',
  username: 'john_entrepreneur',
  email: 'john@example.com',
  walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
  profile: {
    bio: 'Full-stack developer and entrepreneur passionate about building products that make a difference. Currently working on a fintech startup focused on financial inclusion.',
    university: 'Stanford University',
    year: 'Senior',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  skills: ['React', 'Node.js', 'Product Management', 'UI/UX Design', 'Python'],
  interests: ['Fintech', 'AI/ML', 'Social Impact', 'E-commerce'],
  subscriptionTier: 'pro',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-20T00:00:00Z'
};

const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Access to basic opportunities',
      'Limited masterclasses',
      'Basic founder matching',
      'Community access'
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
      'Unlimited opportunities access',
      'All masterclasses included',
      'Advanced AI matching',
      'Priority support',
      'Exclusive webinars'
    ],
    limits: {
      opportunities: 'unlimited',
      masterclasses: 'unlimited',
      connections: 50,
      feedbackSessions: 10
    }
  },
  {
    id: 'founders-circle',
    name: 'Founder\'s Circle',
    price: 25,
    features: [
      'Everything in Pro',
      'Exclusive networking events',
      'Direct mentor feedback',
      '1-on-1 strategy sessions',
      'Early access to new features',
      'Custom matching algorithms'
    ],
    limits: {
      opportunities: 'unlimited',
      masterclasses: 'unlimited',
      connections: 'unlimited',
      feedbackSessions: 'unlimited'
    }
  }
];

const skillOptions = [
  'React', 'Node.js', 'Python', 'Machine Learning', 'UI/UX Design', 
  'Product Management', 'Marketing', 'Sales', 'Business Development',
  'Blockchain', 'Data Science', 'Mobile Development', 'DevOps',
  'Finance', 'Operations', 'Strategy', 'Legal', 'HR'
];

const interestOptions = [
  'Fintech', 'Healthcare', 'E-commerce', 'AI/ML', 'Sustainability',
  'Social Impact', 'Education', 'Gaming', 'Fashion Tech', 'Food Tech',
  'Real Estate', 'Transportation', 'Energy', 'Media', 'Travel'
];

interface SkillTagProps {
  skill: string;
  onRemove: (skill: string) => void;
}

function SkillTag({ skill, onRemove }: SkillTagProps) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
      {skill}
      <button
        onClick={() => onRemove(skill)}
        className="ml-2 hover:text-primary/70"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

interface InterestTagProps {
  interest: string;
  onRemove: (interest: string) => void;
}

function InterestTag({ interest, onRemove }: InterestTagProps) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-accent/10 text-accent">
      {interest}
      <button
        onClick={() => onRemove(interest)}
        className="ml-2 hover:text-accent/70"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'settings'>('profile');
  const [user, setUser] = useState<UserType>(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [showWalletAddress, setShowWalletAddress] = useState(false);
  const [notifications, setNotifications] = useState({
    opportunities: true,
    connections: true,
    feedback: true,
    marketing: false
  });

  const handleSaveProfile = () => {
    // In a real app, this would make an API call to update the user profile
    console.log('Saving profile:', user);
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (newSkill && !user.skills.includes(newSkill)) {
      setUser(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setUser(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleAddInterest = () => {
    if (newInterest && !user.interests.includes(newInterest)) {
      setUser(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest]
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setUser(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSubscriptionChange = (tierId: 'free' | 'pro' | 'founders-circle') => {
    setUser(prev => ({
      ...prev,
      subscriptionTier: tierId
    }));
    // In a real app, this would handle payment processing
    console.log('Changing subscription to:', tierId);
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'founders-circle':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'pro':
        return <Shield className="h-4 w-4 text-blue-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <img
              src={user.profile.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
              alt={user.username}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-lg hover:bg-primary/90">
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center justify-center space-x-2">
              <span>@{user.username}</span>
              {getTierBadge(user.subscriptionTier)}
            </h1>
            <p className="text-text-secondary">{user.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-white text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'subscription'
                ? 'bg-white text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Subscription
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-white text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">Profile Information</h2>
                <Button
                  variant={isEditing ? 'primary' : 'outline'}
                  onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Username
                    </label>
                    <Input
                      value={user.username}
                      onChange={(e) => setUser(prev => ({ ...prev, username: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Email
                    </label>
                    <Input
                      value={user.email}
                      onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      type="email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      <GraduationCap className="h-4 w-4 inline mr-1" />
                      University
                    </label>
                    <Input
                      value={user.profile.university || ''}
                      onChange={(e) => setUser(prev => ({ 
                        ...prev, 
                        profile: { ...prev.profile, university: e.target.value }
                      }))}
                      disabled={!isEditing}
                      placeholder="Your university"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Academic Year
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      value={user.profile.year || ''}
                      onChange={(e) => setUser(prev => ({ 
                        ...prev, 
                        profile: { ...prev.profile, year: e.target.value }
                      }))}
                      disabled={!isEditing}
                    >
                      <option value="">Select year</option>
                      <option value="Freshman">Freshman</option>
                      <option value="Sophomore">Sophomore</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                      <option value="Graduate">Graduate</option>
                      <option value="PhD Candidate">PhD Candidate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Bio
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                    rows={4}
                    value={user.profile.bio}
                    onChange={(e) => setUser(prev => ({ 
                      ...prev, 
                      profile: { ...prev.profile, bio: e.target.value }
                    }))}
                    disabled={!isEditing}
                    placeholder="Tell others about yourself and what you're working on..."
                  />
                </div>
              </div>
            </Card>

            {/* Skills */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Skills
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <SkillTag
                      key={skill}
                      skill={skill}
                      onRemove={isEditing ? handleRemoveSkill : () => {}}
                    />
                  ))}
                </div>
                
                {isEditing && (
                  <div className="flex space-x-2">
                    <select
                      className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                    >
                      <option value="">Select a skill to add</option>
                      {skillOptions
                        .filter(skill => !user.skills.includes(skill))
                        .map(skill => (
                          <option key={skill} value={skill}>{skill}</option>
                        ))}
                    </select>
                    <Button
                      variant="outline"
                      onClick={handleAddSkill}
                      disabled={!newSkill}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Interests */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Interests
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest) => (
                    <InterestTag
                      key={interest}
                      interest={interest}
                      onRemove={isEditing ? handleRemoveInterest : () => {}}
                    />
                  ))}
                </div>
                
                {isEditing && (
                  <div className="flex space-x-2">
                    <select
                      className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                    >
                      <option value="">Select an interest to add</option>
                      {interestOptions
                        .filter(interest => !user.interests.includes(interest))
                        .map(interest => (
                          <option key={interest} value={interest}>{interest}</option>
                        ))}
                    </select>
                    <Button
                      variant="outline"
                      onClick={handleAddInterest}
                      disabled={!newInterest}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold text-text-primary mb-4">Current Plan</h2>
              <div className="flex items-center space-x-3 mb-6">
                {getTierBadge(user.subscriptionTier)}
                <div>
                  <h3 className="font-semibold text-text-primary">
                    {subscriptionTiers.find(t => t.id === user.subscriptionTier)?.name}
                  </h3>
                  <p className="text-text-secondary">
                    ${subscriptionTiers.find(t => t.id === user.subscriptionTier)?.price}/month
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {subscriptionTiers.map((tier) => (
                <SubscriptionCard
                  key={tier.id}
                  tier={tier}
                  isCurrentTier={user.subscriptionTier === tier.id}
                  onSelect={() => handleSubscriptionChange(tier.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Wallet */}
            <Card>
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <Wallet className="h-5 w-5 mr-2" />
                Wallet Connection
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Wallet className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">Connected Wallet</p>
                      <p className="text-sm text-text-secondary">
                        {showWalletAddress 
                          ? user.walletAddress 
                          : formatWalletAddress(user.walletAddress || '')
                        }
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowWalletAddress(!showWalletAddress)}
                  >
                    {showWalletAddress ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Notifications */}
            <Card>
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text-primary capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {key === 'opportunities' && 'Get notified about new funding opportunities'}
                        {key === 'connections' && 'Get notified about new connection requests'}
                        {key === 'feedback' && 'Get notified about feedback session updates'}
                        {key === 'marketing' && 'Receive marketing emails and product updates'}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Privacy */}
            <Card>
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Privacy & Security
              </h3>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
                  <X className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}

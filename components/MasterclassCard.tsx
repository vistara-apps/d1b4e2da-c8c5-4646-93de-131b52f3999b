'use client';

import { Masterclass } from '@/lib/types';
import { Card } from './Card';
import { Button } from './Button';
import { truncateText } from '@/lib/utils';
import { Play, Clock, Star, Lock } from 'lucide-react';

interface MasterclassCardProps {
  masterclass: Masterclass;
  userTier: 'free' | 'pro' | 'founders-circle';
  onStart?: (id: string) => void;
}

export function MasterclassCard({ masterclass, userTier, onStart }: MasterclassCardProps) {
  const canAccess = !masterclass.isPremium || userTier !== 'free';
  
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  return (
    <Card className={!canAccess ? 'opacity-60' : ''}>
      <div className="space-y-4">
        {/* Thumbnail placeholder */}
        <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
          {!canAccess && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <Lock className="h-8 w-8 text-white" />
            </div>
          )}
          <Play className="h-12 w-12 text-primary" />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyColors[masterclass.difficulty]}`}>
                  {masterclass.difficulty.charAt(0).toUpperCase() + masterclass.difficulty.slice(1)}
                </span>
                {masterclass.isPremium && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    Premium
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {masterclass.title}
              </h3>
              
              <p className="text-text-secondary text-sm leading-relaxed">
                {truncateText(masterclass.description, 100)}
              </p>
            </div>
          </div>

          {/* Meta info */}
          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            {masterclass.duration && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{masterclass.duration}</span>
              </div>
            )}
            {masterclass.instructor && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span>{masterclass.instructor}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {masterclass.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {masterclass.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
                >
                  {tag}
                </span>
              ))}
              {masterclass.tags.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md">
                  +{masterclass.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Action */}
          <div className="pt-2">
            {canAccess ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onStart?.(masterclass.masterclassId)}
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Learning
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled
              >
                <Lock className="h-4 w-4 mr-2" />
                Upgrade to Access
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

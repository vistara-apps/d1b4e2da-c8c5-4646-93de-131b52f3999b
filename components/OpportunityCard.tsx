'use client';

import { Opportunity } from '@/lib/types';
import { Card } from './Card';
import { Button } from './Button';
import { formatDate, getTimeUntilDeadline, truncateText } from '@/lib/utils';
import { ExternalLink, Clock, MapPin, DollarSign } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSave?: (id: string) => void;
  isSaved?: boolean;
}

export function OpportunityCard({ opportunity, onSave, isSaved = false }: OpportunityCardProps) {
  const timeLeft = getTimeUntilDeadline(opportunity.deadline);
  const isExpired = timeLeft === 'Expired';

  return (
    <Card 
      variant={opportunity.featured ? 'featured' : 'default'}
      className={isExpired ? 'opacity-60' : ''}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                opportunity.type === 'grant' ? 'bg-green-100 text-green-800' :
                opportunity.type === 'competition' ? 'bg-blue-100 text-blue-800' :
                opportunity.type === 'investor' ? 'bg-purple-100 text-purple-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
              </span>
              {opportunity.featured && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary text-white">
                  Featured
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {opportunity.title}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              {truncateText(opportunity.description, 120)}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span className={isExpired ? 'text-red-600' : 'text-text-secondary'}>
                {timeLeft}
              </span>
            </div>
            {opportunity.amount && (
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span>{opportunity.amount}</span>
              </div>
            )}
            {opportunity.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{opportunity.location}</span>
              </div>
            )}
          </div>
          
          <div className="text-sm text-text-secondary">
            <strong>Deadline:</strong> {formatDate(opportunity.deadline)}
          </div>
        </div>

        {/* Tags */}
        {opportunity.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {opportunity.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
              >
                {tag}
              </span>
            ))}
            {opportunity.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md">
                +{opportunity.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSave?.(opportunity.opportunityId)}
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            onClick={() => window.open(opportunity.url, '_blank')}
            disabled={isExpired}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Apply
          </Button>
        </div>
      </div>
    </Card>
  );
}

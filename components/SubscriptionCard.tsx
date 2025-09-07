'use client';

import { useState } from 'react';
import { SubscriptionTier } from '@/lib/types';
import { Card } from './Card';
import { Button } from './Button';
import { PaymentModal } from './PaymentModal';
import { formatCurrency } from '@/lib/utils';
import { Check, Star } from 'lucide-react';

interface SubscriptionCardProps {
  tier: SubscriptionTier;
  currentTier?: string;
  onUpgrade?: (tierId: string) => void;
}

export function SubscriptionCard({ tier, currentTier, onUpgrade }: SubscriptionCardProps) {
  const isCurrentTier = currentTier === tier.id;
  const isPopular = tier.id === 'pro';
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleUpgrade = () => {
    if (tier.price === 0) {
      // Free tier - handle directly
      onUpgrade?.(tier.id);
    } else {
      // Paid tier - show payment modal
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = (transactionHash: string) => {
    console.log('Payment successful:', transactionHash);
    setShowPaymentModal(false);
    onUpgrade?.(tier.id);
  };

  return (
    <Card 
      variant={isPopular ? 'featured' : 'default'}
      className="relative"
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-accent text-white px-3 py-1 text-xs font-medium rounded-full flex items-center space-x-1">
            <Star className="h-3 w-3" />
            <span>Most Popular</span>
          </span>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-text-primary">{tier.name}</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold text-text-primary">
              {tier.price === 0 ? 'Free' : formatCurrency(tier.price)}
            </span>
            {tier.price > 0 && (
              <span className="text-text-secondary">/month</span>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          {tier.features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <span className="text-sm text-text-secondary">{feature}</span>
            </div>
          ))}
        </div>

        {/* Limits */}
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-medium text-text-primary mb-3">Usage Limits</h4>
          <div className="space-y-2 text-sm text-text-secondary">
            <div className="flex justify-between">
              <span>Opportunities</span>
              <span>{tier.limits.opportunities === 'unlimited' ? '∞' : tier.limits.opportunities}</span>
            </div>
            <div className="flex justify-between">
              <span>Masterclasses</span>
              <span>{tier.limits.masterclasses === 'unlimited' ? '∞' : tier.limits.masterclasses}</span>
            </div>
            <div className="flex justify-between">
              <span>Connections</span>
              <span>{tier.limits.connections === 'unlimited' ? '∞' : tier.limits.connections}</span>
            </div>
            <div className="flex justify-between">
              <span>Feedback Sessions</span>
              <span>{tier.limits.feedbackSessions === 'unlimited' ? '∞' : tier.limits.feedbackSessions}</span>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="pt-2">
          {isCurrentTier ? (
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          ) : (
            <Button
              variant={isPopular ? 'primary' : 'outline'}
              className="w-full"
              onClick={handleUpgrade}
            >
              {tier.price === 0 ? 'Get Started' : 'Upgrade'}
            </Button>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && tier.id !== 'free' && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          subscriptionTier={tier.id as 'pro' | 'founders-circle'}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </Card>
  );
}

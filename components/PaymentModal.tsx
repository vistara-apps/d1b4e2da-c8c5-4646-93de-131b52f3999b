'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from './Button';
import { Card } from './Card';
import { usePaymentService, SUBSCRIPTION_PRICES, PaymentService } from '@/lib/payment';
import { SUBSCRIPTION_TIERS } from '@/lib/constants';
import { X, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionTier: 'pro' | 'founders-circle';
  onSuccess?: (transactionHash: string) => void;
}

export function PaymentModal({ 
  isOpen, 
  onClose, 
  subscriptionTier, 
  onSuccess 
}: PaymentModalProps) {
  const { address, isConnected } = useAccount();
  const { initiatePayment, verifyPayment, isWalletConnected } = usePaymentService();
  
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'confirming' | 'success' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [paymentId, setPaymentId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const tierInfo = SUBSCRIPTION_TIERS.find(tier => tier.id === subscriptionTier);
  const priceUSDC = PaymentService.formatUSDC(SUBSCRIPTION_PRICES[subscriptionTier]);

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setPaymentState('processing');
      setError('');

      console.log(`Starting payment for ${subscriptionTier} subscription`);
      
      const result = await initiatePayment(subscriptionTier, address);

      if (result.success && result.transactionHash) {
        setTransactionHash(result.transactionHash);
        setPaymentId(result.paymentId || '');
        setPaymentState('confirming');

        // Additional verification step
        if (result.paymentId) {
          const verification = await verifyPayment(result.paymentId);
          
          if (verification.verified) {
            setPaymentState('success');
            onSuccess?.(result.transactionHash);
          } else {
            throw new Error(verification.error || 'Payment verification failed');
          }
        } else {
          setPaymentState('success');
          onSuccess?.(result.transactionHash);
        }
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
      setPaymentState('error');
    }
  };

  const handleClose = () => {
    if (paymentState === 'processing' || paymentState === 'confirming') {
      // Don't allow closing during payment
      return;
    }
    
    setPaymentState('idle');
    setError('');
    setTransactionHash('');
    setPaymentId('');
    onClose();
  };

  const getStatusIcon = () => {
    switch (paymentState) {
      case 'processing':
      case 'confirming':
        return <Loader2 className="h-8 w-8 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-8 w-8 text-red-600" />;
      default:
        return <CreditCard className="h-8 w-8 text-primary" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentState) {
      case 'processing':
        return 'Processing payment...';
      case 'confirming':
        return 'Confirming transaction on Base network...';
      case 'success':
        return 'Payment successful! Your subscription has been upgraded.';
      case 'error':
        return error || 'Payment failed. Please try again.';
      default:
        return `Upgrade to ${tierInfo?.name} for $${priceUSDC} USDC`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">
              Upgrade Subscription
            </h2>
            <button
              onClick={handleClose}
              disabled={paymentState === 'processing' || paymentState === 'confirming'}
              className="text-text-secondary hover:text-text-primary disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Status Icon */}
          <div className="flex justify-center">
            {getStatusIcon()}
          </div>

          {/* Status Message */}
          <div className="text-center">
            <p className="text-text-primary font-medium">
              {getStatusMessage()}
            </p>
          </div>

          {/* Subscription Details */}
          {paymentState === 'idle' && tierInfo && (
            <div className="space-y-4">
              <div className="bg-background-secondary rounded-lg p-4">
                <h3 className="font-semibold text-text-primary mb-2">{tierInfo.name}</h3>
                <ul className="space-y-1 text-sm text-text-secondary">
                  {tierInfo.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary">${priceUSDC} USDC</span>
              </div>

              {!isWalletConnected && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm">
                    Please connect your wallet to proceed with payment.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Transaction Details */}
          {(paymentState === 'confirming' || paymentState === 'success') && transactionHash && (
            <div className="bg-background-secondary rounded-lg p-4">
              <p className="text-sm text-text-secondary mb-2">Transaction Hash:</p>
              <a
                href={`https://basescan.org/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm font-mono break-all"
              >
                {transactionHash}
              </a>
            </div>
          )}

          {/* Error Details */}
          {paymentState === 'error' && error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {paymentState === 'idle' && (
              <>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePayment}
                  disabled={!isWalletConnected}
                  className="flex-1"
                >
                  Pay ${priceUSDC} USDC
                </Button>
              </>
            )}

            {paymentState === 'success' && (
              <Button
                variant="primary"
                onClick={handleClose}
                className="w-full"
              >
                Continue
              </Button>
            )}

            {paymentState === 'error' && (
              <>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePayment}
                  disabled={!isWalletConnected}
                  className="flex-1"
                >
                  Try Again
                </Button>
              </>
            )}
          </div>

          {/* Payment Info */}
          {paymentState === 'idle' && (
            <div className="text-xs text-text-secondary text-center space-y-1">
              <p>Payment will be processed on Base network using USDC.</p>
              <p>Make sure you have sufficient USDC balance and ETH for gas fees.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

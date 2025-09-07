'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { AppShell } from '@/components/AppShell';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { PaymentModal } from '@/components/PaymentModal';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { usePaymentService, SUBSCRIPTION_PRICES, PaymentService } from '@/lib/payment';
import { SUBSCRIPTION_TIERS } from '@/lib/constants';
import { 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  Wallet,
  TestTube,
  DollarSign,
  Shield,
  Clock
} from 'lucide-react';

export default function PaymentTestPage() {
  const { address, isConnected } = useAccount();
  const { initiatePayment, verifyPayment, getPaymentHistory, isWalletConnected } = usePaymentService();
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'pro' | 'founders-circle'>('pro');
  const [currentTier, setCurrentTier] = useState<'free' | 'pro' | 'founders-circle'>('free');
  const [testResults, setTestResults] = useState<{
    walletConnection: boolean;
    paymentInitiation: boolean;
    transactionConfirmation: boolean;
    errorHandling: boolean;
  }>({
    walletConnection: false,
    paymentInitiation: false,
    transactionConfirmation: false,
    errorHandling: false,
  });
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestWalletConnection = () => {
    const result = !!(isWalletConnected && isConnected && address);
    setTestResults(prev => ({ ...prev, walletConnection: result }));
    
    if (result) {
      console.log('✅ Wallet connection test passed');
      console.log('Connected address:', address);
    } else {
      console.log('❌ Wallet connection test failed');
    }
  };

  const handleTestPaymentFlow = async (tier: 'pro' | 'founders-circle') => {
    if (!address) {
      console.log('❌ No wallet connected');
      return;
    }

    setIsLoading(true);
    try {
      console.log(`🧪 Testing payment flow for ${tier} tier`);
      
      // Test payment initiation
      const result = await initiatePayment(tier, address);
      
      if (result.success) {
        console.log('✅ Payment initiation test passed');
        setTestResults(prev => ({ ...prev, paymentInitiation: true }));
        
        if (result.transactionHash) {
          console.log('Transaction hash:', result.transactionHash);
          
          // Test transaction confirmation
          if (result.paymentId) {
            const verification = await verifyPayment(result.paymentId);
            if (verification.verified) {
              console.log('✅ Transaction confirmation test passed');
              setTestResults(prev => ({ ...prev, transactionConfirmation: true }));
            }
          }
        }
      } else {
        console.log('❌ Payment initiation test failed:', result.error);
        // This actually tests error handling
        setTestResults(prev => ({ ...prev, errorHandling: true }));
      }
    } catch (error) {
      console.log('❌ Payment flow test failed:', error);
      // Error handling test
      setTestResults(prev => ({ ...prev, errorHandling: true }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadPaymentHistory = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const history = await getPaymentHistory(address);
      setPaymentHistory(history);
      console.log('Payment history loaded:', history);
    } catch (error) {
      console.error('Failed to load payment history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = (tierId: string) => {
    setCurrentTier(tierId as 'free' | 'pro' | 'founders-circle');
    console.log(`Subscription upgraded to: ${tierId}`);
  };

  const handlePaymentSuccess = (transactionHash: string) => {
    console.log('✅ Payment successful!', transactionHash);
    setTestResults(prev => ({ 
      ...prev, 
      paymentInitiation: true, 
      transactionConfirmation: true 
    }));
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-text-primary flex items-center justify-center">
            <TestTube className="h-10 w-10 mr-3 text-primary" />
            x402 Payment Flow Test
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Test and verify the x402 payment integration with wagmi useWalletClient and USDC on Base network.
          </p>
        </div>

        {/* Connection Status */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center">
              <Wallet className="h-6 w-6 mr-2 text-primary" />
              Wallet Connection Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm">
                  Wallet: {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${address ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm">
                  Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'None'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${isWalletConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm">
                  Wallet Client: {isWalletConnected ? 'Ready' : 'Not Ready'}
                </span>
              </div>
            </div>
            <Button onClick={handleTestWalletConnection} variant="outline">
              Test Wallet Connection
            </Button>
          </div>
        </Card>

        {/* Test Results */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center">
              <Shield className="h-6 w-6 mr-2 text-accent" />
              Test Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(testResults).map(([test, passed]) => (
                <div key={test} className="flex items-center space-x-3">
                  {passed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  )}
                  <span className="text-sm capitalize">
                    {test.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Payment Testing */}
        <Card>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center">
              <CreditCard className="h-6 w-6 mr-2 text-primary" />
              Payment Flow Testing
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-text-primary">Direct Payment Tests</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => handleTestPaymentFlow('pro')}
                    disabled={!isWalletConnected || isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    Test Pro Payment ($10 USDC)
                  </Button>
                  <Button
                    onClick={() => handleTestPaymentFlow('founders-circle')}
                    disabled={!isWalletConnected || isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    Test Founder's Circle Payment ($25 USDC)
                  </Button>
                  <Button
                    onClick={() => setShowPaymentModal(true)}
                    disabled={!isWalletConnected}
                    variant="primary"
                    className="w-full"
                  >
                    Test Payment Modal
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-text-primary">Payment Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Pro Tier Price:</span>
                    <span className="font-mono">${PaymentService.formatUSDC(SUBSCRIPTION_PRICES.pro)} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Founder's Circle Price:</span>
                    <span className="font-mono">${PaymentService.formatUSDC(SUBSCRIPTION_PRICES['founders-circle'])} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network:</span>
                    <span>Base</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Currency:</span>
                    <span>USDC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment History */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-text-primary flex items-center">
                <Clock className="h-6 w-6 mr-2 text-accent" />
                Payment History
              </h2>
              <Button
                onClick={handleLoadPaymentHistory}
                disabled={!address || isLoading}
                variant="outline"
                size="sm"
              >
                Load History
              </Button>
            </div>
            
            {paymentHistory.length > 0 ? (
              <div className="space-y-2">
                {paymentHistory.map((payment, index) => (
                  <div key={index} className="bg-background-secondary rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{payment.description || 'Payment'}</span>
                      <span className="text-sm text-text-secondary">{payment.status}</span>
                    </div>
                    {payment.transactionHash && (
                      <a
                        href={`https://basescan.org/tx/${payment.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline font-mono"
                      >
                        {payment.transactionHash}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-center py-4">
                No payment history available. Connect your wallet and load history.
              </p>
            )}
          </div>
        </Card>

        {/* Subscription Cards Test */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-text-primary flex items-center">
            <DollarSign className="h-6 w-6 mr-2 text-primary" />
            Subscription Integration Test
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUBSCRIPTION_TIERS.map((tier) => (
              <SubscriptionCard
                key={tier.id}
                tier={tier}
                currentTier={currentTier}
                onUpgrade={handleUpgrade}
              />
            ))}
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            subscriptionTier={selectedTier}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </AppShell>
  );
}

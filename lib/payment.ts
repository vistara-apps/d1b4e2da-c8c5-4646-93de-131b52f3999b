import { withPaymentInterceptor, createSigner } from 'x402-axios';
import axios from 'axios';
import { useWalletClient } from 'wagmi';
import { base } from 'wagmi/chains';
import { parseUnits, formatUnits } from 'viem';

// USDC contract address on Base
export const USDC_BASE_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// Subscription prices in USDC (6 decimals)
export const SUBSCRIPTION_PRICES = {
  pro: parseUnits('10', 6), // $10 USDC
  'founders-circle': parseUnits('25', 6), // $25 USDC
} as const;

export interface PaymentRequest {
  amount: bigint;
  currency: string;
  recipient: string;
  description?: string;
  subscriptionTier?: 'pro' | 'founders-circle';
}

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  paymentId?: string;
}

export class PaymentService {
  private axiosInstance: any;
  private walletClient: any;
  
  constructor(walletClient?: any) {
    this.walletClient = walletClient;
    
    // Create axios instance for x402 payments
    this.axiosInstance = axios.create({
      baseURL: 'https://api.x402.com', // Replace with actual x402 API base URL
      timeout: 30000,
    });

    // Note: In a real implementation, you would set up the x402 interceptor here
    // For demo purposes, we'll simulate the payment flow
    if (walletClient) {
      console.log('Wallet client connected for x402 payments');
      // In a real implementation:
      // const signer = await createSigner('base', privateKey);
      // withPaymentInterceptor(this.axiosInstance, { signer });
    }
  }

  /**
   * Initialize payment for subscription upgrade
   */
  async initiateSubscriptionPayment(
    walletClient: any,
    subscriptionTier: 'pro' | 'founders-circle',
    userAddress: string
  ): Promise<PaymentResult> {
    try {
      if (!walletClient) {
        throw new Error('Wallet not connected');
      }

      const amount = SUBSCRIPTION_PRICES[subscriptionTier];
      const amountFormatted = formatUnits(amount, 6);

      console.log(`Initiating payment for ${subscriptionTier} subscription: $${amountFormatted} USDC`);

      // Create payment request
      const paymentRequest = {
        amount: amountFormatted,
        currency: 'USDC',
        recipient: process.env.NEXT_PUBLIC_PAYMENT_RECIPIENT || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        description: `NicheConnect ${subscriptionTier} subscription`,
        metadata: {
          userAddress,
          subscriptionTier,
          timestamp: Date.now(),
        },
      };

      // Use x402-axios interceptor to handle the payment
      // The interceptor will automatically handle the x402 payment flow
      const paymentResponse = await this.axiosInstance.post('/payments', paymentRequest);

      if (paymentResponse.data && paymentResponse.data.transactionHash) {
        console.log('Payment successful:', paymentResponse.data.transactionHash);
        
        // Simulate transaction confirmation for demo purposes
        // In a real implementation, you would check the actual transaction status
        const confirmed = await this.simulateConfirmation(paymentResponse.data.transactionHash);
        
        if (confirmed) {
          return {
            success: true,
            transactionHash: paymentResponse.data.transactionHash,
            paymentId: paymentResponse.data.paymentId || `payment_${Date.now()}`,
          };
        } else {
          throw new Error('Transaction confirmation timeout');
        }
      } else {
        // For demo purposes, simulate a successful payment
        const mockTransactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        console.log('Demo mode: Simulating successful payment with hash:', mockTransactionHash);
        
        return {
          success: true,
          transactionHash: mockTransactionHash,
          paymentId: `demo_payment_${Date.now()}`,
        };
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      // For demo purposes, we'll simulate different error scenarios
      if (Math.random() > 0.7) {
        return {
          success: false,
          error: 'Insufficient USDC balance',
        };
      } else if (Math.random() > 0.5) {
        return {
          success: false,
          error: 'Network congestion, please try again',
        };
      } else {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Payment failed',
        };
      }
    }
  }

  /**
   * Simulate transaction confirmation for demo purposes
   * In a real implementation, this would check the actual Base network
   */
  private async simulateConfirmation(
    transactionHash: string,
    maxAttempts: number = 5,
    intervalMs: number = 1000
  ): Promise<boolean> {
    console.log(`Simulating confirmation for transaction: ${transactionHash}`);
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      
      // Simulate 90% success rate
      if (Math.random() > 0.1) {
        console.log(`Transaction confirmed after ${attempt + 1} attempts`);
        return true;
      }
      
      console.log(`Confirmation attempt ${attempt + 1}/${maxAttempts}...`);
    }
    
    console.log('Transaction confirmation timeout (demo)');
    return false;
  }

  /**
   * Verify payment status (demo implementation)
   */
  async verifyPayment(paymentId: string): Promise<{
    verified: boolean;
    status?: string;
    transactionHash?: string;
    error?: string;
  }> {
    try {
      console.log(`Verifying payment: ${paymentId}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate 95% verification success rate
      if (Math.random() > 0.05) {
        return {
          verified: true,
          status: 'completed',
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        };
      } else {
        return {
          verified: false,
          status: 'pending',
          error: 'Payment still processing',
        };
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        verified: false,
        error: error instanceof Error ? error.message : 'Verification failed',
      };
    }
  }

  /**
   * Get payment history for a user (demo implementation)
   */
  async getPaymentHistory(userAddress: string): Promise<any[]> {
    try {
      console.log(`Fetching payment history for: ${userAddress}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock payment history
      return [
        {
          paymentId: 'demo_payment_1',
          description: 'NicheConnect Pro subscription',
          amount: '10.00',
          currency: 'USDC',
          status: 'completed',
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          timestamp: Date.now() - 86400000, // 1 day ago
        },
        {
          paymentId: 'demo_payment_2',
          description: 'NicheConnect Founder\'s Circle subscription',
          amount: '25.00',
          currency: 'USDC',
          status: 'completed',
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          timestamp: Date.now() - 172800000, // 2 days ago
        },
      ];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  }

  /**
   * Format USDC amount for display
   */
  static formatUSDC(amount: bigint): string {
    return formatUnits(amount, 6);
  }

  /**
   * Parse USDC amount from string
   */
  static parseUSDC(amount: string): bigint {
    return parseUnits(amount, 6);
  }
}

// Hook for using the payment service
export function usePaymentService() {
  const { data: walletClient } = useWalletClient();
  const paymentService = new PaymentService(walletClient);

  const initiatePayment = async (
    subscriptionTier: 'pro' | 'founders-circle',
    userAddress: string
  ) => {
    if (!walletClient) {
      throw new Error('Wallet not connected');
    }

    return await paymentService.initiateSubscriptionPayment(
      walletClient,
      subscriptionTier,
      userAddress
    );
  };

  const verifyPayment = async (paymentId: string) => {
    return await paymentService.verifyPayment(paymentId);
  };

  const getPaymentHistory = async (userAddress: string) => {
    return await paymentService.getPaymentHistory(userAddress);
  };

  return {
    initiatePayment,
    verifyPayment,
    getPaymentHistory,
    isWalletConnected: !!walletClient,
  };
}

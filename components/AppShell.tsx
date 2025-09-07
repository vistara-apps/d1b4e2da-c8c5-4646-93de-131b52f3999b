'use client';

import { useState, useEffect } from 'react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { 
  Home, 
  Search, 
  BookOpen, 
  Users, 
  MessageCircle, 
  Settings2,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AppShellProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Opportunities', href: '/opportunities', icon: Search },
  { name: 'Masterclasses', href: '/masterclasses', icon: BookOpen },
  { name: 'Connections', href: '/connections', icon: Users },
  { name: 'Feedback', href: '/feedback', icon: MessageCircle },
];

export function AppShell({ children }: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { setFrameReady } = useMiniKit();

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  return (
    <div className="min-h-screen bg-bg">
      {/* Mobile header */}
      <div className="lg:hidden bg-surface/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-muted active:bg-muted/80 transition-all duration-200"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-text-primary" />
            ) : (
              <Menu className="h-6 w-6 text-text-primary" />
            )}
          </button>
          <h1 className="text-xl font-bold text-gradient-primary">NicheConnect</h1>
        </div>
        
        <Wallet>
          <ConnectWallet>
            <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors duration-200">
              <Avatar className="h-8 w-8" />
            </div>
          </ConnectWallet>
        </Wallet>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-72 bg-surface/95 backdrop-blur-md shadow-2xl border-r border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-gradient-primary">NicheConnect</h2>
            </div>
            <nav className="p-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-md'
                        : 'text-text-secondary hover:bg-muted hover:text-text-primary'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            
            {/* Mobile menu footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-surface/80">
              <Wallet>
                <ConnectWallet>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors duration-200">
                    <Avatar className="h-10 w-10" />
                    <div className="flex-1 min-w-0">
                      <Name className="text-sm font-medium text-text-primary" />
                    </div>
                  </div>
                </ConnectWallet>
              </Wallet>
            </div>
          </div>
        </div>
      )}

      <div className="lg:flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-surface border-r border-border">
            {/* Logo */}
            <div className="flex items-center px-6 py-4 border-b border-border">
              <h1 className="text-2xl font-bold text-primary">NicheConnect</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-text-secondary hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User section */}
            <div className="px-4 py-4 border-t border-border">
              <Wallet>
                <ConnectWallet>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <Avatar className="h-8 w-8" />
                    <div className="flex-1 min-w-0">
                      <Name className="text-sm font-medium text-text-primary" />
                    </div>
                  </div>
                </ConnectWallet>
              </Wallet>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import type { Currency, UserProfile, AnyPlanResult } from './types/index.js';
import { api, getStoredUser, clearStoredAuth } from './services/apiClient.js';
import { Navbar } from './components/Navbar.js';
import { Dashboard } from './components/Dashboard.js';
import { HomePlanner } from './components/HomePlanner.js';
import { PartyPlanner } from './components/PartyPlanner.js';
import { JewelryPlanner } from './components/JewelryPlanner.js';
import { HistoryView } from './components/HistoryView.js';
import { AuthModal } from './components/AuthModal.js';
import { BudgetBreakdownModal } from './components/BudgetBreakdownModal.js';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'home' | 'party' | 'jewelry' | 'history'>('dashboard');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [breakdownPlan, setBreakdownPlan] = useState<AnyPlanResult | null>(null);

  useEffect(() => {
    // Initial user sync
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
    }

    async function checkSession() {
      try {
        const info = await api.getSessionInfo();
        if (info.user) {
          setUser(info.user);
          if (info.user.currency) {
            setCurrency(info.user.currency);
          }
        }
      } catch (err) {
        console.error('Session check failed:', err);
      }
    }
    checkSession();
  }, []);

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            user={user}
            currency={currency}
            setActiveTab={setActiveTab}
            onOpenBreakdown={(plan) => setBreakdownPlan(plan)}
          />
        )}

        {activeTab === 'home' && (
          <HomePlanner
            currency={currency}
            onOpenBreakdown={(plan) => setBreakdownPlan(plan)}
            onPlanCreated={() => {}}
          />
        )}

        {activeTab === 'party' && (
          <PartyPlanner
            currency={currency}
            onOpenBreakdown={(plan) => setBreakdownPlan(plan)}
            onPlanCreated={() => {}}
          />
        )}

        {activeTab === 'jewelry' && (
          <JewelryPlanner
            currency={currency}
            onOpenBreakdown={(plan) => setBreakdownPlan(plan)}
            onPlanCreated={() => {}}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            currency={currency}
            onOpenBreakdown={(plan) => setBreakdownPlan(plan)}
          />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(newUser) => setUser(newUser)}
      />

      {/* Budget Breakdown / Export Modal */}
      <BudgetBreakdownModal
        plan={breakdownPlan}
        onClose={() => setBreakdownPlan(null)}
      />
    </div>
  );
}

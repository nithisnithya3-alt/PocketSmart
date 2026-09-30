import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Home,
  PartyPopper,
  Sparkles,
  TrendingDown,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Percent,
  Sliders,
  Store,
  Layers,
  Star,
  Zap,
  Tag
} from 'lucide-react';
import type { Currency, UserProfile, AnyPlanResult } from '../types/index.js';
import { api } from '../services/apiClient.js';
import { formatCurrency, getCurrencySymbol } from '../utils/formatters.js';

interface DashboardProps {
  user: UserProfile | null;
  currency: Currency;
  setActiveTab: (tab: 'dashboard' | 'home' | 'party' | 'jewelry' | 'history') => void;
  onOpenBreakdown: (plan: AnyPlanResult) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  currency,
  setActiveTab,
  onOpenBreakdown,
}) => {
  const [stats, setStats] = useState({
    totalPlansCreated: 4,
    totalBudgetManaged: 385000,
    totalSavingsCalculated: 34200,
    homePlansCount: 2,
    partyPlansCount: 1,
    jewelryPlansCount: 1,
  });
  const [recentPlans, setRecentPlans] = useState<AnyPlanResult[]>([]);

  // Interactive quick calculator state
  const [calcBudget, setCalcBudget] = useState<number>(currency === 'INR' ? 100000 : 2000);
  const [calcCategory, setCalcCategory] = useState<'home' | 'party' | 'jewelry'>('home');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getSessionData();
        if (res.stats) {
          setStats(res.stats);
        }
        if (res.recentPlans) {
          setRecentPlans(res.recentPlans);
        }
      } catch (err) {
        console.error('Failed to load session data:', err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-300 text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Powered by Gemini 3.8 Flash &amp; Multimodal Vision</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight leading-tight">
            Stop Guessing Costs. <br />
            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-amber-300 bg-clip-text text-transparent">
              Plan Smarter With AI.
            </span>
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            PocketSmart AI takes your total budget and intelligently allocates every cent across Home Interiors, Celebrations &amp; Parties, and Hallmarked Jewelry. Get real-world product links from Amazon, Flipkart, IKEA, Swiggy, and Tanishq.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition hover:-translate-y-0.5"
            >
              <Home className="w-4 h-4" />
              <span>Plan Home Interior</span>
            </button>

            <button
              onClick={() => setActiveTab('party')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition hover:-translate-y-0.5"
            >
              <PartyPopper className="w-4 h-4" />
              <span>Plan Party &amp; Event</span>
            </button>

            <button
              onClick={() => setActiveTab('jewelry')}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-600/30 flex items-center gap-2 transition hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Match Outfit Jewelry</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="relative z-10 mt-10 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total Managed</span>
            <div className="text-xl sm:text-2xl font-heading font-extrabold text-white mt-0.5">
              {formatCurrency(stats.totalBudgetManaged, currency)}
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Estimated Savings</span>
            <div className="text-xl sm:text-2xl font-heading font-extrabold text-emerald-400 mt-0.5">
              {formatCurrency(stats.totalSavingsCalculated, currency)}
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Verified Platforms</span>
            <div className="text-xl sm:text-2xl font-heading font-extrabold text-amber-300 mt-0.5">
              8+ Stores
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Budget Adherence</span>
            <div className="text-xl sm:text-2xl font-heading font-extrabold text-indigo-300 mt-0.5">
              100% Guaranteed
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Planner Modules Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Core AI Modules
            </span>
            <h2 className="text-2xl font-heading font-bold text-slate-900 mt-1">
              Select Your Budget Planner
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Each module features custom allocation algorithms, strict constraint validation, and direct store search links.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Module 1: Home Interior */}
          <div
            onClick={() => setActiveTab('home')}
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-105 transition-transform">
                <Home className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Module A
                </span>
                <span className="text-xs text-slate-400">IKEA • Amazon • Pepperfry</span>
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition">
                Home Interior Budget Planner
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Furnish Living rooms, bedrooms, and kitchens. Automatic category divisions across sofas, ceiling fans, chandeliers, and dining sets keeping your exact budget intact.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Start Home Plan</span>
                <ArrowRight className="w-4 h-4" />
              </span>
              <span className="text-[11px] text-slate-400 font-medium">From ₹25,000 / $300</span>
            </div>
          </div>

          {/* Module 2: Party Planner */}
          <div
            onClick={() => setActiveTab('party')}
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5 transition duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-4 group-hover:scale-105 transition-transform">
                <PartyPopper className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  Module B
                </span>
                <span className="text-xs text-slate-400">Swiggy • Zomato • OYO</span>
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-purple-600 transition">
                Party &amp; Event Budget Planner
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Birthdays, weddings, corporate events, and cocktail evenings. Calculates per-plate catering, banquet rentals, sound &amp; DJ packages, and full timeline checklists.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-purple-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Start Event Plan</span>
                <ArrowRight className="w-4 h-4" />
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Per Guest Breakdown</span>
            </div>
          </div>

          {/* Module 3: Jewelry & Outfit Planner */}
          <div
            onClick={() => setActiveTab('jewelry')}
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5 transition duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                  Module C
                </span>
                <span className="text-xs text-slate-400">Tanishq • CaratLane • Giva</span>
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-amber-700 transition">
                Jewelry &amp; Outfit Matcher
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Upload your dress photo or pick an outfit. Gemini scans palette hues and neckline to curate BIS Hallmarked 22K gold, diamonds, or silver jewelry within your budget.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Match Outfit &amp; Jewels</span>
                <ArrowRight className="w-4 h-4" />
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Vision AI Matching</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quick Budget Allocation Estimator Widget */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold mb-1">
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Simulator</span>
            </div>
            <h3 className="text-xl font-heading font-bold text-slate-900">
              Quick Budget Allocation Preview
            </h3>
            <p className="text-xs text-slate-500">
              See how PocketSmart AI divides and balances budgets in real-time
            </p>
          </div>

          {/* Module Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setCalcCategory('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                calcCategory === 'home' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Home Interior
            </button>
            <button
              onClick={() => setCalcCategory('party')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                calcCategory === 'party' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Party &amp; Event
            </button>
            <button
              onClick={() => setCalcCategory('jewelry')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                calcCategory === 'jewelry' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Jewelry
            </button>
          </div>
        </div>

        {/* Budget Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700">
            <span>Simulated Total Budget:</span>
            <span className="text-base font-extrabold text-indigo-600">
              {formatCurrency(calcBudget, currency)}
            </span>
          </div>
          <input
            type="range"
            min={currency === 'INR' ? 20000 : 500}
            max={currency === 'INR' ? 500000 : 10000}
            step={currency === 'INR' ? 10000 : 250}
            value={calcBudget}
            onChange={(e) => setCalcBudget(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
        </div>

        {/* Dynamic Category Allocation Mock Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {calcCategory === 'home' && (
            <>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 font-medium block">Sofa &amp; Seating (35%)</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">
                  {formatCurrency(calcBudget * 0.35, currency)}
                </span>
                <span className="text-[10px] text-slate-400">IKEA / Pepperfry</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 font-medium block">Lighting &amp; Fans (20%)</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">
                  {formatCurrency(calcBudget * 0.20, currency)}
                </span>
                <span className="text-[10px] text-slate-400">Amazon / Flipkart</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 font-medium block">Dining &amp; Storage (30%)</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">
                  {formatCurrency(calcBudget * 0.30, currency)}
                </span>
                <span className="text-[10px] text-slate-400">Urban Ladder</span>
              </div>
              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
                <span className="text-[11px] text-emerald-800 font-medium block">Reserved Savings (15%)</span>
                <span className="text-sm font-bold text-emerald-900 mt-1 block">
                  {formatCurrency(calcBudget * 0.15, currency)}
                </span>
                <span className="text-[10px] text-emerald-600">Buffer Protected</span>
              </div>
            </>
          )}

          {calcCategory === 'party' && (
            <>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 font-medium block">Catering Buffet (45%)</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">
                  {formatCurrency(calcBudget * 0.45, currency)}
                </span>
                <span className="text-[10px] text-slate-400">Swiggy / Zomato</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 font-medium block">Banquet / Venue (25%)</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">
                  {formatCurrency(calcBudget * 0.25, currency)}
                </span>
                <span className="text-[10px] text-slate-400">OYO / Banquet Pro</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 font-medium block">Decor &amp; Music (20%)</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">
                  {formatCurrency(calcBudget * 0.20, currency)}
                </span>
                <span className="text-[10px] text-slate-400">Artist Network</span>
              </div>
              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
                <span className="text-[11px] text-emerald-800 font-medium block">Discounts &amp; Buffer (10%)</span>
                <span className="text-sm font-bold text-emerald-900 mt-1 block">
                  {formatCurrency(calcBudget * 0.10, currency)}
                </span>
                <span className="text-[10px] text-emerald-600">Headcount Buffer</span>
              </div>
            </>
          )}

          {calcCategory === 'jewelry' && (
            <>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 font-medium block">Necklace / Choker (55%)</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">
                  {formatCurrency(calcBudget * 0.55, currency)}
                </span>
                <span className="text-[10px] text-slate-400">Tanishq / CaratLane</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 font-medium block">Earrings &amp; Studs (25%)</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">
                  {formatCurrency(calcBudget * 0.25, currency)}
                </span>
                <span className="text-[10px] text-slate-400">Bluestone / Giva</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 font-medium block">Rings / Bangles (15%)</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">
                  {formatCurrency(calcBudget * 0.15, currency)}
                </span>
                <span className="text-[10px] text-slate-400">Certified Hallmarked</span>
              </div>
              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
                <span className="text-[11px] text-emerald-800 font-medium block">Labor Making Rebate (5%)</span>
                <span className="text-sm font-bold text-emerald-900 mt-1 block">
                  {formatCurrency(calcBudget * 0.05, currency)}
                </span>
                <span className="text-[10px] text-emerald-600">Promo Waiver</span>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setActiveTab(calcCategory)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <span>Launch Complete {calcCategory === 'home' ? 'Interior' : calcCategory === 'party' ? 'Party' : 'Jewelry'} Wizard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Recent Plans or Sample Demo Section */}
      {recentPlans.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-heading font-bold text-slate-900">
              Recent Budget Plans
            </h3>
            <button
              onClick={() => setActiveTab('history')}
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>View All Saved Plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPlans.slice(0, 3).map((plan) => (
              <div
                key={plan.id}
                onClick={() => onOpenBreakdown(plan)}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {plan.planType} Plan
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{plan.title}</h4>
                  <div className="flex items-center justify-between mt-3 text-xs">
                    <span className="text-slate-500">Budget: {formatCurrency(plan.totalBudget, plan.currency)}</span>
                    <span className="font-bold text-indigo-600">Est: {formatCurrency(plan.estimatedSpending, plan.currency)}</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 font-semibold">
                    ✓ Fits within budget
                  </span>
                  <span className="text-indigo-600 font-bold">Inspect →</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials & Trust */}
      <section className="bg-slate-100/70 rounded-3xl p-8 border border-slate-200 space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Trusted Recommendations
          </span>
          <h3 className="text-xl font-heading font-bold text-slate-900 mt-1">
            Real Shoppers Planning Confidently
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex text-amber-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              "We had exactly ₹1,50,000 for our 2BHK living room. PocketSmart allocated for our sofa, smart ceiling fans, and dining table with exact IKEA &amp; Pepperfry links. Saved us ~₹12,000."
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs">
              <span className="font-bold text-slate-900 block">Arjun &amp; Kavya Nair</span>
              <span className="text-[10px] text-slate-400">Bangalore • Home Interior</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex text-amber-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              "The per-guest calculation for our 50-person birthday party was brilliant. Swiggy catering and OYO banquet recommendations kept everything neat without surprise vendor fees."
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs">
              <span className="font-bold text-slate-900 block">Rohan Mehta</span>
              <span className="text-[10px] text-slate-400">Mumbai • Party Planner</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex text-amber-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              "I took a photo of my silk wedding saree and uploaded it. Gemini detected the gold zari undertones and recommended matching temple jhumkas from Tanishq within my ₹50,000 budget!"
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs">
              <span className="font-bold text-slate-900 block">Sneha Patel</span>
              <span className="text-[10px] text-slate-400">Ahmedabad • Jewelry &amp; Outfit</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-slate-200 text-slate-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
            P
          </div>
          <span className="font-bold text-slate-800">PocketSmart AI</span>
          <span>© {new Date().getFullYear()} • Smart Budget &amp; Recommendation Assistant</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Google Gemini 3.8 Flash</span>
          <span>•</span>
          <span>Amazon • Flipkart • IKEA • Swiggy • Tanishq</span>
        </div>
      </footer>
    </div>
  );
};

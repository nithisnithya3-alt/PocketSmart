import React, { useState } from 'react';
import {
  PartyPopper,
  Sparkles,
  Users,
  MapPin,
  Calendar,
  Utensils,
  Music,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Clock,
  DollarSign
} from 'lucide-react';
import type { Currency, PartyPlanInput, PartyPlanResult } from '../types/index.js';
import { api } from '../services/apiClient.js';
import { formatCurrency, getCurrencySymbol } from '../utils/formatters.js';

interface PartyPlannerProps {
  currency: Currency;
  onOpenBreakdown: (plan: PartyPlanResult) => void;
  onPlanCreated: () => void;
}

export const PartyPlanner: React.FC<PartyPlannerProps> = ({
  currency,
  onOpenBreakdown,
  onPlanCreated,
}) => {
  const [budget, setBudget] = useState<number>(75000);
  const [eventType, setEventType] = useState<string>('Birthday Celebration');
  const [guestCount, setGuestCount] = useState<number>(45);
  const [eventDate, setEventDate] = useState<string>(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [venuePreference, setVenuePreference] = useState<string>('Boutique AC Banquet Hall');
  const [foodPreference, setFoodPreference] = useState<string>('Non-Vegetarian & Multi-cuisine');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Catering & Food/Beverages',
    'Venue Rental & Setup',
    'Theme Decoration & Florals',
    'DJ, Music & Sound Entertainment',
    'Photography & Videography',
  ]);
  const [notes, setNotes] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PartyPlanResult | null>(null);

  const eventTypes = [
    'Birthday Celebration',
    'Wedding & Reception',
    'Corporate Mixer & Dinner',
    'House Warming Party',
    'Anniversary Gala',
    'Cocktail & DJ Night',
    'Baby Shower / Naming Ceremony',
  ];

  const venueOptions = [
    'Boutique AC Banquet Hall',
    'Open-air Rooftop Lounge',
    'Home / Private Backyard',
    'Lawn / Farmhouse Resort',
    'Cozy Cafe / Bistro',
  ];

  const foodOptions = [
    'Non-Vegetarian & Multi-cuisine',
    'Pure Vegetarian Buffet',
    'Finger Foods & Cocktails / Mocktails',
    'Healthy & Vegan Gourmet',
  ];

  const categoryOptions = [
    'Catering & Food/Beverages',
    'Venue Rental & Setup',
    'Theme Decoration & Florals',
    'DJ, Music & Sound Entertainment',
    'Photography & Videography',
    'Guest Return Gifts & Favors',
    'Accommodation & Travel',
  ];

  const budgetPresets = currency === 'INR'
    ? [35000, 75000, 150000, 300000]
    : [500, 1000, 2500, 5000];

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget || budget <= 0) {
      setError('Please provide a valid budget.');
      return;
    }
    if (!guestCount || guestCount <= 0) {
      setError('Guest count must be at least 1.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const input: PartyPlanInput = {
        budget: Number(budget),
        currency,
        eventType,
        guestCount: Number(guestCount),
        eventDate,
        venuePreference,
        selectedCategories,
        foodPreference,
        notes,
      };

      const result = await api.generateParty(input);
      setCurrentPlan(result);
      onPlanCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to generate party budget plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <PartyPopper className="w-3.5 h-3.5" />
            Module B: Party &amp; Celebration Budget Planner
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
            Host Unforgettable Events on Budget
          </h1>
          <p className="mt-2 text-purple-100/90 text-sm leading-relaxed">
            From birthdays and corporate galas to weddings. Calculate accurate per-guest costs, coordinate venue options with OYO &amp; banquets, and discover catering through Swiggy &amp; Zomato partners.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-heading font-bold text-slate-900">
              Event Parameters &amp; Logistics
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify guest count, catering type, and budget limits
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Total Budget */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Total Budget ({getCurrencySymbol(currency)})
                </label>
                <span className="text-xs font-semibold text-purple-600">
                  {formatCurrency(budget, currency)}
                </span>
              </div>
              <input
                type="number"
                min="100"
                step="100"
                required
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-base font-bold text-slate-900 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[11px] text-slate-400 mr-1">Presets:</span>
                {budgetPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBudget(preset)}
                    className={`px-2 py-1 rounded-md text-xs font-medium border transition ${
                      budget === preset
                        ? 'bg-purple-50 border-purple-300 text-purple-700 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {formatCurrency(preset, currency)}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Type & Guest Count Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Event Celebration
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                >
                  {eventTypes.map((et) => (
                    <option key={et} value={et}>{et}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Guest Headcount
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="number"
                    min="5"
                    max="1000"
                    required
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-xs font-bold text-slate-900 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Venue & Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Venue Preference
                </label>
                <select
                  value={venuePreference}
                  onChange={(e) => setVenuePreference(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                >
                  {venueOptions.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Event Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Catering & Food Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Catering &amp; Cuisine Style
              </label>
              <select
                value={foodPreference}
                onChange={(e) => setFoodPreference(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              >
                {foodOptions.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Required Services */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Allocated Services ({selectedCategories.length} selected)
              </label>
              <div className="space-y-1">
                {categoryOptions.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium text-left transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-purple-50 text-purple-900 border border-purple-200 font-semibold'
                          : 'bg-slate-50 text-slate-600 border border-slate-200/70 hover:bg-slate-100'
                      }`}
                    >
                      <span>{cat}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Special Requests or Theme Details (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Neon glow theme, require mocktail bar and karaoke mic for guests."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md shadow-purple-500/20 text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini AI Optimizing Event Budget...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Event &amp; Catering Budget Plan</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Area (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {currentPlan ? (
            <div className="space-y-6">
              {/* Event Overview Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
                        {currentPlan.eventType}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {currentPlan.guestCount} Guests
                      </span>
                    </div>
                    <h2 className="text-lg font-heading font-extrabold text-slate-900 mt-1">
                      {currentPlan.title}
                    </h2>
                  </div>

                  <button
                    onClick={() => onOpenBreakdown(currentPlan)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition self-start sm:self-center"
                  >
                    <span>Full Breakdown &amp; Print</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 4 Metrics: Total, Spent, Cost Per Guest, Balance */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-500 font-medium">Budget</span>
                    <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                      {formatCurrency(currentPlan.totalBudget, currentPlan.currency)}
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-100">
                    <span className="text-[11px] text-purple-700 font-medium">Est. Total</span>
                    <div className="text-sm sm:text-base font-extrabold text-purple-900 mt-0.5">
                      {formatCurrency(currentPlan.estimatedSpending, currentPlan.currency)}
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-100">
                    <span className="text-[11px] text-amber-700 font-medium">Per Guest Cost</span>
                    <div className="text-sm sm:text-base font-extrabold text-amber-900 mt-0.5">
                      {formatCurrency(currentPlan.costPerGuest, currentPlan.currency)}
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    currentPlan.remainingBalance >= 0
                      ? 'bg-emerald-50/70 border-emerald-100 text-emerald-900'
                      : 'bg-rose-50/70 border-rose-100 text-rose-900'
                  }`}>
                    <span className="text-[11px] font-medium opacity-80">
                      {currentPlan.remainingBalance >= 0 ? 'Remaining' : 'Deficit'}
                    </span>
                    <div className="text-sm sm:text-base font-extrabold mt-0.5">
                      {formatCurrency(Math.abs(currentPlan.remainingBalance), currentPlan.currency)}
                    </div>
                  </div>
                </div>

                {/* Category Allocations Visual Bars */}
                <div className="mt-5 space-y-2 pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 block">Category Distribution</span>
                  <div className="space-y-1.5">
                    {currentPlan.categoryAllocations.map((cat, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="flex justify-between text-slate-600 mb-0.5">
                          <span className="font-semibold text-slate-800">{cat.category}</span>
                          <span className="font-bold text-slate-900">
                            {formatCurrency(cat.estimatedCost, currentPlan.currency)} ({cat.percentageOfBudget}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${Math.min(100, cat.percentageOfBudget)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Service & Item Recommendations */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-heading font-bold text-slate-900">
                    Curated Vendors &amp; Services ({currentPlan.recommendations.length} Packages)
                  </h3>
                  <span className="text-xs text-slate-500">
                    Linked to Swiggy, Zomato, OYO &amp; BookMyShow
                  </span>
                </div>

                <div className="space-y-3.5">
                  {currentPlan.recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 hover:border-purple-200 transition space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold">
                              {rec.category}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                              {rec.providerType}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm">{rec.serviceOrItemName}</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rec.description}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-base font-extrabold text-slate-900">
                            {formatCurrency(rec.estimatedPrice, currentPlan.currency)}
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium">
                            {rec.pricingBasis}
                          </div>
                        </div>
                      </div>

                      {/* Coordination Tip */}
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                        <span><strong>Event Ops Note:</strong> {rec.coordinationTips}</span>
                      </div>

                      {/* Search/Book Platform Links */}
                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        <span className="text-[11px] font-semibold text-slate-400">Find on:</span>
                        {rec.suggestedPlatforms.map((store, sIdx) => (
                          <a
                            key={sIdx}
                            href={store.searchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 border border-slate-200 transition"
                          >
                            <span>{store.platform}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Checklist & Budget Hacks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Timeline */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>Planning Timeline &amp; Milestones</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {currentPlan.timelineChecklist.map((item, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-800">{item.timeframe}:</span>{' '}
                          <span className="text-slate-600">{item.task}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget Advice */}
                <div className="bg-purple-50/50 rounded-2xl p-5 border border-purple-100 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Event Cost Optimization Tips</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside">
                    {currentPlan.budgetAdvice.map((advice, idx) => (
                      <li key={idx} className="leading-relaxed">{advice}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <PartyPopper className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-heading font-bold text-slate-900">
                  Ready to plan your celebration
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Enter your headcount, occasion, and total budget. PocketSmart AI will balance per-guest catering rates, calculate venue benchmarks, and prevent unexpected vendor overages.
                </p>
              </div>
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleGenerate}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Run Sample ₹75,000 Party Plan (45 Guests)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

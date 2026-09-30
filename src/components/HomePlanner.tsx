import React, { useState } from 'react';
import {
  Home,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Plus,
  SlidersHorizontal,
  Bookmark,
  TrendingDown,
  Info,
  DollarSign
} from 'lucide-react';
import type { Currency, HomePlanInput, HomePlanResult } from '../types/index.js';
import { api } from '../services/apiClient.js';
import { formatCurrency, getCurrencySymbol } from '../utils/formatters.js';

interface HomePlannerProps {
  currency: Currency;
  onOpenBreakdown: (plan: HomePlanResult) => void;
  onPlanCreated: () => void;
}

export const HomePlanner: React.FC<HomePlannerProps> = ({
  currency,
  onOpenBreakdown,
  onPlanCreated,
}) => {
  const [budget, setBudget] = useState<number>(150000);
  const [roomTypes, setRoomTypes] = useState<string[]>(['Living Room', 'Bedroom']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Sofa & Seating',
    'Lighting & Chandeliers',
    'Ceiling Fans',
    'Dining Table & Chairs',
    'Wardrobe & Storage',
  ]);
  const [stylePreference, setStylePreference] = useState<string>('Modern Minimalist');
  const [priority, setPriority] = useState<'budget_saver' | 'balanced' | 'quality'>('balanced');
  const [notes, setNotes] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<HomePlanResult | null>(null);

  // Available room options
  const availableRooms = [
    'Living Room',
    'Master Bedroom',
    'Modern Kitchen',
    'Dining Area',
    'Home Office / Study',
    'Balcony Garden',
    'Kids Room',
  ];

  // Available product categories
  const availableCategories = [
    'Sofa & Seating',
    'Lighting & Chandeliers',
    'Ceiling Fans',
    'Dining Table & Chairs',
    'Bed & Mattress',
    'Wardrobe & Storage',
    'Modular Kitchen Racks',
    'Curtains & Window Blinds',
    'Area Rugs & Carpets',
    'Wall Art & Decor',
  ];

  const styles = [
    'Modern Minimalist',
    'Warm Scandinavian',
    'Contemporary Indian',
    'Industrial Loft',
    'Luxury Japandi',
    'Bohemian Chic',
  ];

  const budgetPresets = currency === 'INR'
    ? [75000, 150000, 300000, 500000]
    : [1000, 2500, 5000, 10000];

  const toggleRoom = (room: string) => {
    if (roomTypes.includes(room)) {
      if (roomTypes.length > 1) {
        setRoomTypes(roomTypes.filter((r) => r !== room));
      }
    } else {
      setRoomTypes([...roomTypes, room]);
    }
  };

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
      setError('Please provide a valid budget amount.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const input: HomePlanInput = {
        budget: Number(budget),
        currency,
        roomTypes,
        selectedCategories,
        stylePreference,
        priority,
        notes,
      };

      const result = await api.generateHome(input);
      setCurrentPlan(result);
      onPlanCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to generate home budget plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <Home className="w-3.5 h-3.5" />
            Module A: Home Interior Planner
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
            Design Your Dream Home Without Overspending
          </h1>
          <p className="mt-2 text-indigo-100/90 text-sm leading-relaxed">
            Enter your budget, pick rooms and furniture requirements. PocketSmart AI allocates your funds across ceiling fans, lighting, sofas, and dining sets, matching real catalog products from IKEA, Amazon, and Pepperfry that stay strictly within your target.
          </p>
        </div>
      </div>

      {/* Main Grid: Form Left, Output Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-heading font-bold text-slate-900">
              Interior Budget &amp; Style Parameters
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize rooms, styles, and priority allocation
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
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
                <span className="text-xs font-semibold text-indigo-600">
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
                className="w-full px-3.5 py-2.5 text-base font-bold text-slate-900 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[11px] text-slate-400 mr-1">Quick:</span>
                {budgetPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBudget(preset)}
                    className={`px-2 py-1 rounded-md text-xs font-medium border transition ${
                      budget === preset
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {formatCurrency(preset, currency)}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Multi-Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Rooms to Furnish
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableRooms.map((room) => {
                  const isSelected = roomTypes.includes(room);
                  return (
                    <button
                      key={room}
                      type="button"
                      onClick={() => toggleRoom(room)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {room}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Furniture & Items Categories */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Required Furniture &amp; Fixtures ({selectedCategories.length} selected)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {availableCategories.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left truncate transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold'
                          : 'bg-slate-50 text-slate-600 border border-slate-200/70 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0"></span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Style Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Interior Style Preference
              </label>
              <select
                value={stylePreference}
                onChange={(e) => setStylePreference(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {styles.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Budget Strategy / Priority */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Budget Allocation Strategy
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'budget_saver', label: 'Maximum Savings' },
                  { id: 'balanced', label: 'Balanced Value' },
                  { id: 'quality', label: 'Premium Finish' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id as any)}
                    className={`p-2 rounded-xl text-center text-xs font-semibold border transition ${
                      priority === p.id
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Room Dimensions or Custom Requests (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Living room is 14x18 ft, prefer warm lighting and pet-friendly sofa fabric."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-xl shadow-md shadow-indigo-500/20 text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini AI Analyzing &amp; Allocating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Smart Interior Budget Plan</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Area (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          {currentPlan ? (
            <div className="space-y-6">
              {/* Plan Overview Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                        {currentPlan.stylePreference}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {currentPlan.generatedBy === 'gemini' ? 'Gemini 3.8 Flash' : 'Smart Engine'}
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
                    <span>View &amp; Print Full Breakdown</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Budget Health Meter */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-500 font-medium">Target Budget</span>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">
                      {formatCurrency(currentPlan.totalBudget, currentPlan.currency)}
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100">
                    <span className="text-[11px] text-indigo-700 font-medium">Estimated Spending</span>
                    <div className="text-base font-extrabold text-indigo-900 mt-0.5">
                      {formatCurrency(currentPlan.estimatedSpending, currentPlan.currency)}
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    currentPlan.remainingBalance >= 0
                      ? 'bg-emerald-50/70 border-emerald-100 text-emerald-900'
                      : 'bg-rose-50/70 border-rose-100 text-rose-900'
                  }`}>
                    <span className="text-[11px] font-medium opacity-80">
                      {currentPlan.remainingBalance >= 0 ? 'Remaining Balance' : 'Over Budget'}
                    </span>
                    <div className="text-base font-extrabold mt-0.5">
                      {formatCurrency(Math.abs(currentPlan.remainingBalance), currentPlan.currency)}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>Budget Utilization</span>
                    <span>
                      {Math.min(100, Math.round((currentPlan.estimatedSpending / currentPlan.totalBudget) * 100))}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        currentPlan.estimatedSpending <= currentPlan.totalBudget
                          ? 'bg-gradient-to-r from-emerald-500 to-indigo-600'
                          : 'bg-rose-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (currentPlan.estimatedSpending / currentPlan.totalBudget) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Room summary pills */}
                <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                  {currentPlan.roomsSummary.map((r, i) => (
                    <div key={i} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{r.room}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-indigo-600 font-bold">{formatCurrency(r.estimatedCost, currentPlan.currency)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Recommendations */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-heading font-bold text-slate-900">
                    Recommended Products ({currentPlan.recommendations.length} Items)
                  </h3>
                  <span className="text-xs text-slate-500">
                    Pre-matched with Amazon, Flipkart, IKEA &amp; Pepperfry
                  </span>
                </div>

                <div className="space-y-3.5">
                  {currentPlan.recommendations.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 hover:border-indigo-200 transition space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                              {item.room}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                              {item.category}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                              {item.styleMatchScore}% Match
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-base font-extrabold text-slate-900">
                            {formatCurrency(item.totalPrice, currentPlan.currency)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-[11px] text-slate-400">
                              {item.quantity} × {formatCurrency(item.estimatedPrice, currentPlan.currency)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Specs and tip */}
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex items-start gap-2">
                        <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <strong>Specs:</strong> {item.dimensionsOrSpecs}.{' '}
                          <span className="text-slate-500 font-medium">Tip: {item.proTip}</span>
                        </div>
                      </div>

                      {/* Platform Purchase / Search Links */}
                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        <span className="text-[11px] font-semibold text-slate-400">Compare &amp; Buy:</span>
                        {item.suggestedStores.map((store, sIdx) => (
                          <a
                            key={sIdx}
                            href={store.searchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 border border-slate-200 transition"
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

              {/* Optimization Tips & Scenarios */}
              <div className="bg-gradient-to-br from-indigo-50/70 to-amber-50/50 rounded-2xl p-5 border border-indigo-100 space-y-3">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>PocketSmart Budget Optimization Hacks</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                  {currentPlan.budgetOptimizationTips.map((tip, idx) => (
                    <li key={idx} className="leading-relaxed">{tip}</li>
                  ))}
                </ul>

                {/* Scenarios */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-white/80 rounded-xl border border-indigo-100 text-xs">
                    <span className="font-bold text-emerald-700 block mb-1">💡 Lower-Cost Alternative:</span>
                    <p className="text-slate-600 text-[11px]">{currentPlan.alternativeBudgetScenarios.lowerCostOption}</p>
                  </div>
                  <div className="p-3 bg-white/80 rounded-xl border border-indigo-100 text-xs">
                    <span className="font-bold text-indigo-700 block mb-1">✨ Premium Upgrade Path:</span>
                    <p className="text-slate-600 text-[11px]">{currentPlan.alternativeBudgetScenarios.premiumUpgradeOption}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Home className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-heading font-bold text-slate-900">
                  Ready to calculate your interior plan
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Fill in your budget and preferred furniture items on the left. Gemini will generate balanced category allocations, check store prices on IKEA, Amazon &amp; Pepperfry, and keep you comfortably under budget.
                </p>
              </div>
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleGenerate}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Run Sample ₹1,50,000 Interior Plan</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

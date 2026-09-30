import React, { useState, useEffect } from 'react';
import {
  History,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
  Home,
  PartyPopper,
  Sparkles,
  Calendar,
  DollarSign,
  TrendingDown
} from 'lucide-react';
import type { AnyPlanResult, Currency } from '../types/index.js';
import { api } from '../services/apiClient.js';
import { formatCurrency } from '../utils/formatters.js';

interface HistoryViewProps {
  currency: Currency;
  onOpenBreakdown: (plan: AnyPlanResult) => void;
  onSelectPlanToEdit?: (plan: AnyPlanResult) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  currency,
  onOpenBreakdown,
}) => {
  const [plans, setPlans] = useState<AnyPlanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'home' | 'party' | 'jewelry'>('all');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory();
      setPlans(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to remove this plan from your history?')) return;
    try {
      await api.deleteHistory(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert('Could not delete plan');
    }
  };

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || plan.planType === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="w-4 h-4 text-indigo-600" />;
      case 'party':
        return <PartyPopper className="w-4 h-4 text-purple-600" />;
      case 'jewelry':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      default:
        return <History className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-heading font-extrabold text-slate-900">
              Saved Plans &amp; Recommendation History
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Access previous home, party, and jewelry budgets with detailed breakdowns
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['all', 'home', 'party', 'jewelry'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                selectedFilter === f
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f === 'all' ? 'All Plans' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search saved budgets by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
      </div>

      {/* Plans List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">
          Loading your budget history...
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No saved plans found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search filter or generate a new budget plan in the Home, Party, or Jewelry modules.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => onOpenBreakdown(plan)}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {getIcon(plan.planType)}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {plan.planType} Planner
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(plan.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition line-clamp-2">
                  {plan.title}
                </h3>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Total Budget</span>
                    <span className="text-xs font-bold text-slate-800">
                      {formatCurrency(plan.totalBudget, plan.currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Est. Spend</span>
                    <span className="text-xs font-bold text-indigo-600">
                      {formatCurrency(plan.estimatedSpending, plan.currency)}
                    </span>
                  </div>
                </div>

                {/* Status Pill */}
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                    plan.budgetStatus === 'within_budget'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {plan.budgetStatus === 'within_budget' ? 'Fits Budget' : 'Optimized Target'}
                  </span>
                  <span className="text-slate-500 font-medium">
                    {plan.recommendations.length} recommendations
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:underline">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>

                <button
                  onClick={(e) => handleDelete(plan.id, e)}
                  title="Delete plan"
                  className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

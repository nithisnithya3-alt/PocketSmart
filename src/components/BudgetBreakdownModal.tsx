import React from 'react';
import { X, Printer, ExternalLink, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { AnyPlanResult } from '../types/index.js';
import { formatCurrency } from '../utils/formatters.js';

interface BudgetBreakdownModalProps {
  plan: AnyPlanResult | null;
  onClose: () => void;
}

export const BudgetBreakdownModal: React.FC<BudgetBreakdownModalProps> = ({ plan, onClose }) => {
  if (!plan) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-bold uppercase rounded-md bg-indigo-100 text-indigo-700">
                {plan.planType.toUpperCase()} PLAN
              </span>
              <span className="text-xs text-slate-500">
                Generated {new Date(plan.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-lg font-heading font-bold text-slate-900 mt-1">{plan.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-medium text-slate-700 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs text-slate-500 font-medium">Total Budget</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {formatCurrency(plan.totalBudget, plan.currency)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <div className="text-xs text-indigo-700 font-medium">Estimated Cost</div>
              <div className="text-base font-bold text-indigo-900 mt-0.5">
                {formatCurrency(plan.estimatedSpending, plan.currency)}
              </div>
            </div>
            <div className={`p-3.5 rounded-xl border ${
              plan.remainingBalance >= 0
                ? 'bg-emerald-50/60 border-emerald-100 text-emerald-900'
                : 'bg-rose-50/60 border-rose-100 text-rose-900'
            }`}>
              <div className="text-xs font-medium opacity-80">
                {plan.remainingBalance >= 0 ? 'Remaining Balance' : 'Over Budget By'}
              </div>
              <div className="text-base font-bold mt-0.5">
                {formatCurrency(Math.abs(plan.remainingBalance), plan.currency)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100">
              <div className="text-xs text-amber-700 font-medium">Status &amp; Verification</div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-900 mt-1">
                {plan.budgetStatus === 'within_budget' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fits Target</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Budget Optimized</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Category Allocation Breakdown */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2.5">Category Allocations</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {plan.categoryAllocations.map((cat, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    <span className="font-semibold text-slate-800">{cat.category}</span>
                    <span className="text-slate-400">({cat.percentageOfBudget}%)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500">
                      Allocated: {formatCurrency(cat.allocatedBudget, plan.currency)}
                    </span>
                    <span className="font-bold text-slate-900">
                      Est: {formatCurrency(cat.estimatedCost, plan.currency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Line Items List */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2.5">Itemized Recommendations</h3>
            <div className="space-y-2.5">
              {plan.planType === 'home' &&
                plan.recommendations.map((item, idx) => (
                  <div key={idx} className="p-3 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{item.room} • {item.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 text-sm">
                        {formatCurrency(item.totalPrice, plan.currency)}
                      </div>
                      <div className="text-[11px] text-slate-400">Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}

              {plan.planType === 'party' &&
                plan.recommendations.map((item, idx) => (
                  <div key={idx} className="p-3 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{item.serviceOrItemName}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{item.category} • {item.providerType}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 text-sm">
                        {formatCurrency(item.estimatedPrice, plan.currency)}
                      </div>
                      <div className="text-[11px] text-slate-400">{item.pricingBasis}</div>
                    </div>
                  </div>
                ))}

              {plan.planType === 'jewelry' &&
                plan.recommendations.map((item, idx) => (
                  <div key={idx} className="p-3 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{item.material} • {item.matchWithOutfit}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 text-sm">
                        {formatCurrency(item.estimatedPrice, plan.currency)}
                      </div>
                      <div className="text-[11px] text-emerald-600 font-medium">{item.type}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Legal / Disclaimer Notice */}
          <div className="p-3 bg-amber-50/50 border border-amber-200/50 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Price Disclaimer:</strong> Product costs are estimated market benchmarks based on seasonal averages on Amazon, Flipkart, IKEA, Swiggy, and Tanishq. Actual checkout prices and availability may vary based on merchant inventory, coupon codes, and shipping fees.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            Close Sheet
          </button>
        </div>
      </div>
    </div>
  );
};

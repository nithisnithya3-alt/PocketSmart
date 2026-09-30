import React, { useState } from 'react';
import {
  Wallet,
  Home,
  PartyPopper,
  Sparkles,
  History,
  LayoutDashboard,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import type { Currency, UserProfile } from '../types/index.js';

interface NavbarProps {
  activeTab: 'dashboard' | 'home' | 'party' | 'jewelry' | 'history';
  setActiveTab: (tab: 'dashboard' | 'home' | 'party' | 'jewelry' | 'history') => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  user,
  onOpenAuth,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const currencies: Currency[] = ['INR', 'USD', 'EUR', 'GBP'];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'home', label: 'Home Interior', icon: Home },
    { id: 'party', label: 'Party & Events', icon: PartyPopper },
    { id: 'jewelry', label: 'Jewelry & Outfit', icon: Sparkles },
    { id: 'history', label: 'My Saved Plans', icon: History },
  ] as const;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900">
                  PocketSmart<span className="text-indigo-600">.ai</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-full">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block -mt-0.5">
                Smart Budget &amp; Recommendation Assistant
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Currency Switcher + User Profile */}
          <div className="flex items-center gap-2.5">
            {/* Currency Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
              >
                <span>{currency === 'INR' ? '₹ INR' : currency === 'USD' ? '$ USD' : currency === 'EUR' ? '€ EUR' : '£ GBP'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {currencyDropdownOpen && (
                <div
                  className="absolute right-0 mt-1 w-28 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50"
                  onClick={() => setCurrencyDropdownOpen(false)}
                >
                  {currencies.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between hover:bg-indigo-50 ${
                        currency === c ? 'text-indigo-600 font-semibold bg-indigo-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{c === 'INR' ? '₹ INR' : c === 'USD' ? '$ USD' : c === 'EUR' ? '€ EUR' : '£ GBP'}</span>
                      {currency === c && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile / Auth Button */}
            {user ? (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800 leading-tight">{user.name}</span>
                  <span className="text-[10px] text-slate-500 truncate max-w-[120px]">{user.email}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={onLogout}
                  title="Log out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

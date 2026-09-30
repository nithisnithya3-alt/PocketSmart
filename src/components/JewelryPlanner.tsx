import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  X,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Palette,
  Heart,
  Info,
  DollarSign
} from 'lucide-react';
import type { Currency, JewelryPlanInput, JewelryPlanResult } from '../types/index.js';
import { api } from '../services/apiClient.js';
import { formatCurrency, getCurrencySymbol } from '../utils/formatters.js';

interface JewelryPlannerProps {
  currency: Currency;
  onOpenBreakdown: (plan: JewelryPlanResult) => void;
  onPlanCreated: () => void;
}

export const JewelryPlanner: React.FC<JewelryPlannerProps> = ({
  currency,
  onOpenBreakdown,
  onPlanCreated,
}) => {
  const [budget, setBudget] = useState<number>(60000);
  const [occasion, setOccasion] = useState<string>('Grand Wedding / Festive');
  const [preferredTypes, setPreferredTypes] = useState<string[]>([
    'Necklace / Choker',
    'Earrings / Jhumkas / Studs',
    'Bangles / Bracelets',
  ]);
  const [material, setMaterial] = useState<string>('22K Yellow Gold');
  const [style, setStyle] = useState<string>('Royal Traditional Heritage');
  const [outfitDescription, setOutfitDescription] = useState<string>('');
  const [outfitImage, setOutfitImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<JewelryPlanResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const occasions = [
    'Daily Wear & Office Formal',
    'Grand Wedding / Festive',
    'Cocktail & Evening Gala',
    'Engagement / Anniversary Gift',
    'Traditional Ceremony / Puja',
  ];

  const jewelryTypes = [
    'Necklace / Choker',
    'Earrings / Jhumkas / Studs',
    'Rings / Solitaire',
    'Bangles / Bracelets',
    'Pendant Set',
    'Full Bridal Set',
  ];

  const materials = [
    '22K Yellow Gold',
    '18K Diamond & Rose Gold',
    '925 Sterling Silver',
    'Platinum Band',
    'Antique Kundan & Polki',
    'Contemporary Fashion Gold-Plated',
  ];

  const styles = [
    'Minimalist Everyday',
    'Royal Traditional Heritage',
    'Contemporary Chic',
    'Vintage Art Deco',
    'Bohemian Statement',
  ];

  // Preset sample outfits for 1-click test
  const sampleOutfits = [
    {
      title: 'Maroon & Gold Silk Kanjeevaram Saree',
      description: 'Deep royal crimson silk with woven zari border and wide boat neckline.',
      palette: ['#800020', '#D4AF37'],
    },
    {
      title: 'Emerald Green Satin Evening Gown',
      description: 'Sleek dark emerald satin gown with a deep V-neckline and silver shoulder accents.',
      palette: ['#0A5C36', '#E5E4E2'],
    },
    {
      title: 'Pastel Blush Pink Embroidered Lehenga',
      description: 'Soft rose quartz net fabric with pearl embroidery and sweetheart neckline.',
      palette: ['#FAD2E1', '#FAF0CA'],
    },
    {
      title: 'Midnight Navy Velvet Blazer',
      description: 'Structured midnight blue velvet tuxedo jacket with satin lapels.',
      palette: ['#191970', '#C0C0C0'],
    },
  ];

  const budgetPresets = currency === 'INR'
    ? [25000, 60000, 120000, 250000]
    : [350, 750, 1500, 3000];

  const toggleType = (type: string) => {
    if (preferredTypes.includes(type)) {
      if (preferredTypes.length > 1) {
        setPreferredTypes(preferredTypes.filter((t) => t !== type));
      }
    } else {
      setPreferredTypes([...preferredTypes, type]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('Image file must be under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setOutfitImage(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSampleOutfit = (sample: typeof sampleOutfits[0]) => {
    setOutfitDescription(`${sample.title}: ${sample.description}`);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget || budget <= 0) {
      setError('Please provide a valid budget.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const input: JewelryPlanInput = {
        budget: Number(budget),
        currency,
        occasion,
        preferredTypes,
        material,
        style,
        outfitImage: outfitImage || undefined,
        outfitDescription: outfitDescription || undefined,
      };

      const result = await api.generateJewelry(input);
      setCurrentPlan(result);
      onPlanCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to generate jewelry plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Module C: Jewelry &amp; Outfit Matcher Planner
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
            Curate Hallmarked Jewelry That Pairs With Your Outfit
          </h1>
          <p className="mt-2 text-amber-100/90 text-sm leading-relaxed">
            Upload your dress photo or describe your neckline. Gemini AI analyzes tones, fabric undertones, and silhouettes to recommend certified 22K gold, diamonds, or silver from Tanishq, CaratLane, and Amazon within your budget.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-heading font-bold text-slate-900">
              Jewelry Preferences &amp; Outfit
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Set budget, metal preferences, and optional outfit image
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
                <span className="text-xs font-semibold text-amber-700">
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
                className="w-full px-3.5 py-2.5 text-base font-bold text-slate-900 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
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
                        ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {formatCurrency(preset, currency)}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion & Material */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Occasion
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  {occasions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Metal / Material
                </label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  {materials.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Jewelry Style &amp; Craftsmanship
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                {styles.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Desired Pieces Multi-Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Pieces ({preferredTypes.length} selected)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {jewelryTypes.map((type) => {
                  const isSelected = preferredTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleType(type)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left truncate transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-50 text-amber-900 border border-amber-300 font-semibold'
                          : 'bg-slate-50 text-slate-600 border border-slate-200/70 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{type}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0"></span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Outfit Upload Section */}
            <div className="p-3.5 rounded-xl border border-amber-200/70 bg-amber-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-600" />
                  Outfit Matching (Optional)
                </span>
                <span className="text-[10px] text-amber-700 font-medium">Gemini Vision AI</span>
              </div>

              {/* Upload Dropzone */}
              {outfitImage ? (
                <div className="relative rounded-xl overflow-hidden border border-amber-300 bg-white p-2 flex items-center gap-3">
                  <img
                    src={outfitImage}
                    alt="Uploaded Outfit"
                    className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                  />
                  <div className="text-xs flex-1">
                    <span className="font-bold text-slate-800 block">Outfit Photo Attached</span>
                    <span className="text-[11px] text-slate-500">Gemini will scan color palette &amp; neckline</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOutfitImage(null)}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-amber-300/80 hover:border-amber-500 rounded-xl p-3 text-center cursor-pointer bg-white transition hover:bg-amber-50/50"
                >
                  <Upload className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-slate-700 block">
                    Upload Outfit Photo
                  </span>
                  <span className="text-[10px] text-slate-400">
                    PNG, JPG or WebP (Max 8MB)
                  </span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Preset Outfit Clickers */}
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">
                  Or pick a sample outfit to test:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {sampleOutfits.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSampleOutfit(s)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:border-amber-300 text-left text-[11px] transition flex items-center gap-1.5"
                    >
                      <div className="flex gap-0.5 shrink-0">
                        {s.palette.map((color, cIdx) => (
                          <span
                            key={cIdx}
                            className="w-2.5 h-2.5 rounded-full border border-black/10"
                            style={{ backgroundColor: color }}
                          ></span>
                        ))}
                      </div>
                      <span className="truncate font-medium text-slate-700">{s.title.split(' ')[0]} {s.title.split(' ')[1]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description Input */}
              <input
                type="text"
                placeholder="Or describe outfit (e.g. Red silk saree with heavy zari border)"
                value={outfitDescription}
                onChange={(e) => setOutfitDescription(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold rounded-xl shadow-md shadow-amber-600/20 text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Outfit &amp; Matching Jewelry...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Generate Curated Jewelry Collection</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Area (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {currentPlan ? (
            <div className="space-y-6">
              {/* Overview Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
                        {currentPlan.material}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {currentPlan.occasion}
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

                {/* 3 Metrics: Target, Spent, Remaining */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-500 font-medium">Budget</span>
                    <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                      {formatCurrency(currentPlan.totalBudget, currentPlan.currency)}
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-100">
                    <span className="text-[11px] text-amber-700 font-medium">Est. Collection</span>
                    <div className="text-sm sm:text-base font-extrabold text-amber-900 mt-0.5">
                      {formatCurrency(currentPlan.estimatedSpending, currentPlan.currency)}
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    currentPlan.remainingBalance >= 0
                      ? 'bg-emerald-50/70 border-emerald-100 text-emerald-900'
                      : 'bg-rose-50/70 border-rose-100 text-rose-900'
                  }`}>
                    <span className="text-[11px] font-medium opacity-80">
                      {currentPlan.remainingBalance >= 0 ? 'Remaining' : 'Over Target'}
                    </span>
                    <div className="text-sm sm:text-base font-extrabold mt-0.5">
                      {formatCurrency(Math.abs(currentPlan.remainingBalance), currentPlan.currency)}
                    </div>
                  </div>
                </div>

                {/* Outfit AI Analysis Card (if available) */}
                {currentPlan.outfitAnalysis && (
                  <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-amber-50/90 to-orange-50/50 border border-amber-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <Palette className="w-4 h-4 text-amber-600" />
                        AI Outfit Color &amp; Silhouette Analysis
                      </span>
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Harmonized
                      </span>
                    </div>

                    {/* Detected Palettes */}
                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-[11px] font-semibold text-slate-500">Palette:</span>
                      <div className="flex items-center gap-2">
                        {currentPlan.outfitAnalysis.detectedPalette.map((p, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-1">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs"
                              style={{ backgroundColor: p.hex }}
                            ></span>
                            <span className="text-[11px] font-medium text-slate-700">{p.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-amber-950 leading-relaxed font-medium">
                      {currentPlan.outfitAnalysis.stylingRationale}
                    </p>
                  </div>
                )}
              </div>

              {/* Jewelry Recommendations */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-heading font-bold text-slate-900">
                    Recommended Jewelry Pieces ({currentPlan.recommendations.length} Items)
                  </h3>
                  <span className="text-xs text-slate-500">
                    Sourced from Tanishq, CaratLane, Bluestone &amp; Giva
                  </span>
                </div>

                <div className="space-y-3.5">
                  {currentPlan.recommendations.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 hover:border-amber-300 transition space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold">
                              {item.type}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                              {item.material}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-base font-extrabold text-slate-900">
                            {formatCurrency(item.estimatedPrice, currentPlan.currency)}
                          </div>
                          <div className="text-[10px] text-amber-700 font-semibold flex items-center justify-end gap-1 mt-0.5">
                            <ShieldCheck className="w-3 h-3 text-amber-600" />
                            <span>BIS / IGI Certified</span>
                          </div>
                        </div>
                      </div>

                      {/* Outfit Match Note */}
                      <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-100 text-[11px] text-amber-950 flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span><strong>Outfit Styling Harmony:</strong> {item.matchWithOutfit}</span>
                      </div>

                      {/* Care Tip */}
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Info className="w-3 h-3 text-slate-400" />
                        <span>Care Guide: {item.careTip}</span>
                      </div>

                      {/* Stores */}
                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        <span className="text-[11px] font-semibold text-slate-400">Explore &amp; Buy:</span>
                        {item.suggestedStores.map((store, sIdx) => (
                          <a
                            key={sIdx}
                            href={store.searchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 border border-slate-200 transition"
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

              {/* Guidelines & Price Volatility Tips */}
              <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Gold &amp; Gemstone Smart Buying Guidelines</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                  {currentPlan.stylingGuidelines.map((g, idx) => (
                    <li key={idx} className="leading-relaxed">{g}</li>
                  ))}
                </ul>

                {currentPlan.budgetWarnings.length > 0 && (
                  <div className="pt-2 border-t border-amber-200/60 text-xs text-amber-900 font-medium">
                    {currentPlan.budgetWarnings.map((w, idx) => (
                      <p key={idx}>⚠️ {w}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-heading font-bold text-slate-900">
                  Ready to match your jewelry
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Enter your target budget, metal preferences, or upload an outfit picture on the left. Gemini will analyze the color palette, balance necklace and earring weights, and find verified designs from Tanishq &amp; CaratLane.
                </p>
              </div>
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleGenerate}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Run Sample ₹60,000 Wedding Gold &amp; Diamond Plan</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  currency: Currency;
  savedPlansCount: number;
}

export interface StoreLink {
  platform: 'Amazon' | 'Flipkart' | 'IKEA' | 'Pepperfry' | 'Urban Ladder' | 'Swiggy' | 'Zomato' | 'OYO' | 'Tanishq' | 'CaratLane' | 'Bluestone' | 'Giva' | 'Other';
  searchUrl: string;
  badge?: string;
}

export interface CategoryAllocation {
  category: string;
  allocatedBudget: number;
  estimatedCost: number;
  percentageOfBudget: number;
  costPerGuest?: number;
  status: 'under' | 'match' | 'over';
  note?: string;
}

// 1. Home Interior Types
export interface HomePlanInput {
  budget: number;
  currency: Currency;
  roomTypes: string[];
  selectedCategories: string[];
  stylePreference: string;
  priority: 'quality' | 'balanced' | 'budget_saver';
  notes?: string;
}

export interface HomeRecommendationItem {
  id: string;
  name: string;
  room: string;
  category: string;
  estimatedPrice: number;
  quantity: number;
  totalPrice: number;
  description: string;
  suggestedStores: StoreLink[];
  styleMatchScore: number;
  dimensionsOrSpecs: string;
  budgetTier: 'Value' | 'Mid-range' | 'Premium';
  proTip: string;
}

export interface HomePlanResult {
  id: string;
  planType: 'home';
  title: string;
  createdAt: string;
  totalBudget: number;
  allocatedTotal: number;
  estimatedSpending: number;
  remainingBalance: number;
  savingsPercentage: number;
  budgetStatus: 'within_budget' | 'stretched' | 'over_budget';
  currency: Currency;
  stylePreference: string;
  roomsSummary: { room: string; itemCount: number; estimatedCost: number }[];
  categoryAllocations: CategoryAllocation[];
  recommendations: HomeRecommendationItem[];
  budgetOptimizationTips: string[];
  alternativeBudgetScenarios: {
    lowerCostOption: string;
    premiumUpgradeOption: string;
  };
  generatedBy: 'gemini' | 'smart-engine';
}

// 2. Party Event Types
export interface PartyPlanInput {
  budget: number;
  currency: Currency;
  eventType: string;
  guestCount: number;
  eventDate: string;
  venuePreference: string;
  selectedCategories: string[];
  foodPreference: string;
  notes?: string;
}

export interface PartyRecommendationItem {
  id: string;
  category: string;
  serviceOrItemName: string;
  providerType: string;
  estimatedPrice: number;
  pricingBasis: 'Fixed' | 'Per Plate' | 'Per Hour' | 'Per Unit';
  description: string;
  suggestedPlatforms: StoreLink[];
  coordinationTips: string;
}

export interface PartyPlanResult {
  id: string;
  planType: 'party';
  title: string;
  createdAt: string;
  totalBudget: number;
  estimatedSpending: number;
  remainingBalance: number;
  costPerGuest: number;
  currency: Currency;
  eventType: string;
  guestCount: number;
  categoryAllocations: CategoryAllocation[];
  recommendations: PartyRecommendationItem[];
  timelineChecklist: { timeframe: string; task: string }[];
  budgetAdvice: string[];
  budgetStatus: 'within_budget' | 'stretched' | 'over_budget';
  generatedBy: 'gemini' | 'smart-engine';
}

// 3. Jewelry Types
export interface JewelryPlanInput {
  budget: number;
  currency: Currency;
  occasion: string;
  preferredTypes: string[];
  material: string;
  style: string;
  outfitImage?: string; // base64 data URI
  outfitDescription?: string;
  notes?: string;
}

export interface OutfitColor {
  hex: string;
  name: string;
}

export interface OutfitAnalysis {
  detectedPalette: OutfitColor[];
  outfitAesthetic: string;
  necklineAndSilhouette: string;
  stylingRationale: string;
}

export interface JewelryRecommendationItem {
  id: string;
  name: string;
  type: string;
  material: string;
  estimatedPrice: number;
  description: string;
  matchWithOutfit: string;
  suggestedStores: StoreLink[];
  careTip: string;
  certifiedEstimateNote: string;
}

export interface JewelryPlanResult {
  id: string;
  planType: 'jewelry';
  title: string;
  createdAt: string;
  totalBudget: number;
  estimatedSpending: number;
  remainingBalance: number;
  currency: Currency;
  occasion: string;
  material: string;
  style: string;
  outfitAnalysis?: OutfitAnalysis;
  outfitImagePreview?: string;
  categoryAllocations: CategoryAllocation[];
  recommendations: JewelryRecommendationItem[];
  stylingGuidelines: string[];
  budgetWarnings: string[];
  budgetStatus: 'within_budget' | 'stretched' | 'over_budget';
  generatedBy: 'gemini' | 'smart-engine';
}

export type AnyPlanResult = HomePlanResult | PartyPlanResult | JewelryPlanResult;

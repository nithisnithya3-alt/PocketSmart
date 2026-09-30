import { GoogleGenAI } from '@google/genai';
import type {
  HomePlanInput,
  HomePlanResult,
  PartyPlanInput,
  PartyPlanResult,
  JewelryPlanInput,
  JewelryPlanResult,
  HomeRecommendationItem,
  PartyRecommendationItem,
  JewelryRecommendationItem,
  CategoryAllocation,
  OutfitAnalysis
} from '../src/types/index.js';
import { buildSearchUrl, HOME_CATALOG_BENCHMARKS, PARTY_CATALOG_BENCHMARKS, JEWELRY_CATALOG_BENCHMARKS } from './sampleCatalog.js';

const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Currency symbol helper
export function getCurrencySymbol(c: string = 'INR'): string {
  switch (c) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    default:
      return '₹';
  }
}

// Convert INR benchmark to target currency
function convertPrice(priceINR: number, targetCurrency: string): number {
  if (targetCurrency === 'USD') return Math.round(priceINR / 83);
  if (targetCurrency === 'EUR') return Math.round(priceINR / 90);
  if (targetCurrency === 'GBP') return Math.round(priceINR / 105);
  return priceINR;
}

// Safe JSON parser from Gemini markdown codeblocks or raw text
function extractJsonFromText(text: string): any {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

// ==========================================
// 1. HOME INTERIOR PLANNER GENERATOR
// ==========================================
export async function generateHomePlan(input: HomePlanInput): Promise<HomePlanResult> {
  const { budget, currency, roomTypes, selectedCategories, stylePreference, priority, notes } = input;
  if (!budget || budget <= 0) {
    throw new Error('Please enter a valid positive budget amount.');
  }

  const planId = `plan_home_${Date.now()}`;
  const prompt = `
You are PocketSmart AI, an expert interior designer and budget optimization specialist.
Generate a realistic, comprehensive, itemized budget plan and product recommendations for a client with:
- Total Budget: ${budget} ${currency}
- Rooms to decorate: ${roomTypes.join(', ')}
- Required Categories: ${selectedCategories.join(', ')}
- Style Preference: ${stylePreference}
- Budget Strategy / Priority: ${priority}
- Additional Notes: ${notes || 'None'}

CRITICAL BUDGET CONSTRAINTS:
1. The sum of all item total prices MUST STAY STRICTLY WITHIN or very close to the total budget of ${budget} ${currency}.
2. Allocate realistic percentages across the chosen categories.
3. Recommend realistic furniture and fixtures that can be found on stores like Amazon, Flipkart, IKEA, Pepperfry, Urban Ladder.
4. Calculate exact total prices (estimatedPrice * quantity).
5. Calculate remainingBalance = totalBudget - estimatedSpending.

Return ONLY a pure JSON object (no additional conversational text) matching this exact TypeScript structure:
{
  "title": "Short descriptive title for this interior budget plan",
  "roomsSummary": [
    { "room": "string", "itemCount": number, "estimatedCost": number }
  ],
  "categoryAllocations": [
    {
      "category": "string",
      "allocatedBudget": number,
      "estimatedCost": number,
      "percentageOfBudget": number,
      "status": "under" | "match" | "over",
      "note": "string"
    }
  ],
  "items": [
    {
      "name": "string (specific product name)",
      "room": "string",
      "category": "string",
      "estimatedPrice": number,
      "quantity": number,
      "description": "string (specifications, materials, finishes)",
      "platforms": ["Amazon" | "Flipkart" | "IKEA" | "Pepperfry" | "Urban Ladder"],
      "styleMatchScore": number (85-99),
      "dimensionsOrSpecs": "string",
      "budgetTier": "Value" | "Mid-range" | "Premium",
      "proTip": "string (installation or styling advice)"
    }
  ],
  "budgetOptimizationTips": [
    "string tip 1",
    "string tip 2",
    "string tip 3"
  ],
  "alternativeBudgetScenarios": {
    "lowerCostOption": "Specific advice on how to save 15-20% if needed",
    "premiumUpgradeOption": "Where to allocate extra money if budget expands"
  }
}
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = extractJsonFromText(response.text || '{}');
      if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
        let totalEstimated = 0;
        const recommendations: HomeRecommendationItem[] = parsed.items.map((item: any, idx: number) => {
          const qty = Math.max(1, Number(item.quantity) || 1);
          const unitPrice = Math.max(1, Number(item.estimatedPrice) || 500);
          const itemTotal = unitPrice * qty;
          totalEstimated += itemTotal;

          const platforms: string[] = Array.isArray(item.platforms) && item.platforms.length > 0
            ? item.platforms
            : ['IKEA', 'Amazon'];

          return {
            id: `rec_h_${idx + 1}`,
            name: item.name || 'Custom Interior Fixture',
            room: item.room || roomTypes[0] || 'Living Room',
            category: item.category || selectedCategories[0] || 'Furniture',
            estimatedPrice: unitPrice,
            quantity: qty,
            totalPrice: itemTotal,
            description: item.description || 'Quality interior piece matching design theme.',
            suggestedStores: platforms.map((p) => ({
              platform: p as any,
              searchUrl: buildSearchUrl(p, `${item.name} ${item.room}`),
            })),
            styleMatchScore: Number(item.styleMatchScore) || 94,
            dimensionsOrSpecs: item.dimensionsOrSpecs || 'Standard residential specs',
            budgetTier: item.budgetTier || 'Mid-range',
            proTip: item.proTip || 'Coordinate with room ambient light.',
          };
        });

        const remaining = budget - totalEstimated;
        const status = totalEstimated > budget ? 'over_budget' : (remaining < budget * 0.05 ? 'stretched' : 'within_budget');
        const savingsPercent = Math.max(0, Number(((remaining / budget) * 100).toFixed(1)));

        return {
          id: planId,
          planType: 'home',
          title: parsed.title || `${stylePreference} Home Interior Plan`,
          createdAt: new Date().toISOString(),
          totalBudget: budget,
          allocatedTotal: parsed.allocatedTotal || budget,
          estimatedSpending: totalEstimated,
          remainingBalance: remaining,
          savingsPercentage: savingsPercent,
          budgetStatus: status,
          currency,
          stylePreference,
          roomsSummary: parsed.roomsSummary || roomTypes.map((r) => ({ room: r, itemCount: 2, estimatedCost: Math.round(totalEstimated / roomTypes.length) })),
          categoryAllocations: parsed.categoryAllocations || selectedCategories.map((c) => ({
            category: c,
            allocatedBudget: Math.round(budget / selectedCategories.length),
            estimatedCost: Math.round(totalEstimated / selectedCategories.length),
            percentageOfBudget: Math.round(100 / selectedCategories.length),
            status: 'match',
          })),
          recommendations,
          budgetOptimizationTips: parsed.budgetOptimizationTips || [
            'Bulk purchasing lighting and fixtures together qualifies for multi-cart discounts on IKEA/Amazon.',
            'Opt for modular furniture that can be reconfigured in future layouts.',
          ],
          alternativeBudgetScenarios: parsed.alternativeBudgetScenarios || {
            lowerCostOption: 'Opting for engineered wood finishes rather than solid veneer saves approx 18%.',
            premiumUpgradeOption: 'Allocate extra funds into an acoustic ceiling fan and statement chandelier.',
          },
          generatedBy: 'gemini',
        };
      }
    } catch (err) {
      console.warn('Gemini generation fallback triggered:', err);
    }
  }

  // Smart Algorithmic Fallback Engine
  return generateHomePlanFallback(input, planId);
}

function generateHomePlanFallback(input: HomePlanInput, planId: string): HomePlanResult {
  const { budget, currency, roomTypes, selectedCategories, stylePreference } = input;
  const categoriesToUse = selectedCategories.length > 0 ? selectedCategories : ['Sofa & Seating', 'Lighting & Chandeliers', 'Ceiling Fans'];
  const roomsToUse = roomTypes.length > 0 ? roomTypes : ['Living Room', 'Bedroom'];

  const perCategoryBudget = Math.floor(budget / categoriesToUse.length);
  let accumulatedSpending = 0;
  const recommendations: HomeRecommendationItem[] = [];

  categoriesToUse.forEach((cat, idx) => {
    const room = roomsToUse[idx % roomsToUse.length];
    const benchmark = HOME_CATALOG_BENCHMARKS.find((b) => b.category.toLowerCase().includes(cat.toLowerCase()) || cat.toLowerCase().includes(b.category.toLowerCase())) || HOME_CATALOG_BENCHMARKS[idx % HOME_CATALOG_BENCHMARKS.length];
    
    // Scale benchmark price according to user's budget tier
    const baseINR = benchmark.priceINR;
    const convertedBase = convertPrice(baseINR, currency);
    const targetPrice = Math.min(Math.round(perCategoryBudget * 0.9), Math.max(convertedBase, Math.round(perCategoryBudget * 0.5)));
    const qty = 1;
    const itemTotal = targetPrice * qty;
    accumulatedSpending += itemTotal;

    recommendations.push({
      id: `rec_h_f_${idx + 1}`,
      name: `${stylePreference} ${benchmark.name}`,
      room,
      category: cat,
      estimatedPrice: targetPrice,
      quantity: qty,
      totalPrice: itemTotal,
      description: `${benchmark.specs}. Curated for ${stylePreference} interior aesthetics.`,
      suggestedStores: benchmark.platforms.map((p) => ({
        platform: p as any,
        searchUrl: buildSearchUrl(p, `${benchmark.name} ${stylePreference}`),
      })),
      styleMatchScore: 92 + (idx % 6),
      dimensionsOrSpecs: benchmark.specs,
      budgetTier: benchmark.budgetTier,
      proTip: 'Compare merchant ratings and check return policies before checkout.',
    });
  });

  const remaining = budget - accumulatedSpending;
  const savingsPct = Math.max(0, Number(((remaining / budget) * 100).toFixed(1)));
  const budgetStatus = remaining < 0 ? 'over_budget' : (remaining < budget * 0.05 ? 'stretched' : 'within_budget');

  const categoryAllocations: CategoryAllocation[] = categoriesToUse.map((cat, i) => {
    const item = recommendations[i];
    const cost = item ? item.totalPrice : perCategoryBudget;
    return {
      category: cat,
      allocatedBudget: perCategoryBudget,
      estimatedCost: cost,
      percentageOfBudget: Math.round((cost / budget) * 100),
      status: cost <= perCategoryBudget ? 'under' : 'over',
      note: cost <= perCategoryBudget ? 'Comfortably within targeted allocation' : 'Slightly above standard category weight',
    };
  });

  return {
    id: planId,
    planType: 'home',
    title: `${stylePreference} ${roomsToUse.join(' & ')} Interior Budget Plan`,
    createdAt: new Date().toISOString(),
    totalBudget: budget,
    allocatedTotal: budget,
    estimatedSpending: accumulatedSpending,
    remainingBalance: remaining,
    savingsPercentage: savingsPct,
    budgetStatus,
    currency,
    stylePreference,
    roomsSummary: roomsToUse.map((r) => {
      const roomItems = recommendations.filter((i) => i.room === r);
      return {
        room: r,
        itemCount: roomItems.length,
        estimatedCost: roomItems.reduce((acc, curr) => acc + curr.totalPrice, 0),
      };
    }),
    categoryAllocations,
    recommendations,
    budgetOptimizationTips: [
      'Standardize hardware (handles, fixtures) across rooms for bulk purchasing rates.',
      'Check IKEA & Pepperfry end-of-season sales for an extra 10-15% discount.',
      'Utilize credit card reward portals to earn 5-10% cashback on home retail.',
    ],
    alternativeBudgetScenarios: {
      lowerCostOption: 'Selecting flat-pack assembly options rather than pre-assembled saves ~15% on installation.',
      premiumUpgradeOption: 'Investing in architectural track lighting elevates the living area ambiance noticeably.',
    },
    generatedBy: 'smart-engine',
  };
}

// ==========================================
// 2. PARTY BUDGET PLANNER GENERATOR
// ==========================================
export async function generatePartyPlan(input: PartyPlanInput): Promise<PartyPlanResult> {
  const { budget, currency, eventType, guestCount, eventDate, venuePreference, selectedCategories, foodPreference, notes } = input;
  if (!budget || budget <= 0) {
    throw new Error('Please enter a valid positive budget amount.');
  }
  if (!guestCount || guestCount <= 0) {
    throw new Error('Please enter a valid guest count.');
  }

  const planId = `plan_party_${Date.now()}`;
  const prompt = `
You are PocketSmart AI, an elite event planner and party budget strategist.
Plan a budget and recommend services for:
- Event: ${eventType}
- Total Budget: ${budget} ${currency}
- Guest Count: ${guestCount} guests
- Date: ${eventDate || 'Upcoming date'}
- Venue Preference: ${venuePreference}
- Categories Required: ${selectedCategories.join(', ')}
- Catering / Food Preference: ${foodPreference}
- Notes: ${notes || 'None'}

REQUIREMENTS:
1. Strict budget adherence: The total estimated cost MUST STAY WITHIN or very close to ${budget} ${currency}.
2. Recommend catering and food partnerships from platforms like Swiggy, Zomato, or local banquet caterers.
3. Recommend venue partners like OYO Townhouse, banquet halls, or rooftop spaces.
4. Calculate cost per guest (estimatedTotal / guestCount).
5. Divide the budget realistically across Catering (approx 40-50%), Venue (20-30%), Decor (10-15%), Entertainment/Sound (10-15%), etc.

Return ONLY a pure JSON object (no conversation) matching:
{
  "title": "string",
  "categoryAllocations": [
    {
      "category": "string",
      "allocatedBudget": number,
      "estimatedCost": number,
      "percentageOfBudget": number,
      "costPerGuest": number,
      "status": "under" | "match" | "over",
      "note": "string"
    }
  ],
  "recommendations": [
    {
      "category": "string",
      "serviceOrItemName": "string",
      "providerType": "string",
      "estimatedPrice": number,
      "pricingBasis": "Fixed" | "Per Plate" | "Per Hour" | "Per Unit",
      "description": "string",
      "platforms": ["Swiggy" | "Zomato" | "OYO" | "BookMyShow" | "Other"],
      "coordinationTips": "string"
    }
  ],
  "timelineChecklist": [
    { "timeframe": "2 Weeks Before", "task": "string" },
    { "timeframe": "1 Week Before", "task": "string" },
    { "timeframe": "2 Days Before", "task": "string" },
    { "timeframe": "Day of Event", "task": "string" }
  ],
  "budgetAdvice": [
    "string tip 1",
    "string tip 2",
    "string tip 3"
  ]
}
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = extractJsonFromText(response.text || '{}');
      if (parsed && Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) {
        let totalCost = 0;
        const recommendations: PartyRecommendationItem[] = parsed.recommendations.map((rec: any, idx: number) => {
          const price = Math.max(1, Number(rec.estimatedPrice) || 2000);
          totalCost += price;
          const platforms: string[] = Array.isArray(rec.platforms) && rec.platforms.length > 0 ? rec.platforms : ['Swiggy', 'Zomato'];

          return {
            id: `rec_p_${idx + 1}`,
            category: rec.category || selectedCategories[0] || 'Catering',
            serviceOrItemName: rec.serviceOrItemName || 'Event Service Package',
            providerType: rec.providerType || 'Verified Event Partner',
            estimatedPrice: price,
            pricingBasis: rec.pricingBasis || 'Fixed',
            description: rec.description || 'Professional event service tailored to your party theme.',
            suggestedPlatforms: platforms.map((p) => ({
              platform: p as any,
              searchUrl: buildSearchUrl(p, `${rec.serviceOrItemName} ${eventType}`),
            })),
            coordinationTips: rec.coordinationTips || 'Confirm arrival 2 hours prior to start.',
          };
        });

        const remaining = budget - totalCost;
        const status = totalCost > budget ? 'over_budget' : (remaining < budget * 0.05 ? 'stretched' : 'within_budget');
        const costPerGuest = Math.round(totalCost / guestCount);

        return {
          id: planId,
          planType: 'party',
          title: parsed.title || `${eventType} Budget Plan for ${guestCount} Guests`,
          createdAt: new Date().toISOString(),
          totalBudget: budget,
          estimatedSpending: totalCost,
          remainingBalance: remaining,
          costPerGuest,
          currency,
          eventType,
          guestCount,
          categoryAllocations: parsed.categoryAllocations || selectedCategories.map((c) => ({
            category: c,
            allocatedBudget: Math.round(budget / selectedCategories.length),
            estimatedCost: Math.round(totalCost / selectedCategories.length),
            percentageOfBudget: Math.round(100 / selectedCategories.length),
            costPerGuest: Math.round(totalCost / (guestCount * selectedCategories.length)),
            status: 'match',
          })),
          recommendations,
          timelineChecklist: parsed.timelineChecklist || [
            { timeframe: '3 Weeks Prior', task: 'Lock venue and lock caterer menu' },
            { timeframe: '1 Week Prior', task: 'Finalize RSVP count and confirm playlist with DJ' },
            { timeframe: 'Day Before', task: 'Check audio visual gear and table seating setup' },
          ],
          budgetAdvice: parsed.budgetAdvice || [
            'Booking catering through group party packages on Zomato/Swiggy or direct bulk catering can save 15-20% per plate.',
            'Opting for a weekday or Sunday brunch celebration usually halves venue rental rates.',
          ],
          budgetStatus: status,
          generatedBy: 'gemini',
        };
      }
    } catch (err) {
      console.warn('Gemini party generation fallback triggered:', err);
    }
  }

  return generatePartyPlanFallback(input, planId);
}

function generatePartyPlanFallback(input: PartyPlanInput, planId: string): PartyPlanResult {
  const { budget, currency, eventType, guestCount, venuePreference, selectedCategories, foodPreference } = input;
  const categories = selectedCategories.length > 0 ? selectedCategories : ['Catering & Food/Beverages', 'Venue Rental & Setup', 'Theme Decoration & Florals', 'DJ, Music & Sound Entertainment'];

  // Smart standard percentage weighting
  const weights: Record<string, number> = {
    'Catering & Food/Beverages': 0.45,
    'Venue Rental & Setup': 0.25,
    'Theme Decoration & Florals': 0.12,
    'DJ, Music & Sound Entertainment': 0.10,
    'Photography & Videography': 0.08,
  };

  let totalAllocated = 0;
  const recommendations: PartyRecommendationItem[] = [];
  const categoryAllocations: CategoryAllocation[] = [];

  categories.forEach((cat, idx) => {
    const weight = weights[cat] || (1 / categories.length);
    const catBudget = Math.round(budget * weight);
    const benchmark = PARTY_CATALOG_BENCHMARKS.find((b) => b.category.includes(cat) || cat.includes(b.category)) || PARTY_CATALOG_BENCHMARKS[idx % PARTY_CATALOG_BENCHMARKS.length];

    let estimatedPrice = catBudget;
    let pricingBasis: 'Fixed' | 'Per Plate' | 'Per Hour' | 'Per Unit' = 'Fixed';

    if (cat.includes('Catering')) {
      pricingBasis = 'Per Plate';
      const perPlateCost = Math.round(catBudget / guestCount);
      estimatedPrice = perPlateCost * guestCount;
    }

    totalAllocated += estimatedPrice;

    recommendations.push({
      id: `rec_p_f_${idx + 1}`,
      category: cat,
      serviceOrItemName: `${eventType} ${benchmark.service}`,
      providerType: benchmark.provider,
      estimatedPrice,
      pricingBasis,
      description: `Comprehensive ${cat.toLowerCase()} package curated for ${guestCount} guests with ${foodPreference} menu preferences.`,
      suggestedPlatforms: benchmark.platforms.map((p) => ({
        platform: p as any,
        searchUrl: buildSearchUrl(p, `${cat} ${eventType} party booking`),
      })),
      coordinationTips: 'Sign off on menu items and setup timeline at least 5 days in advance.',
    });

    categoryAllocations.push({
      category: cat,
      allocatedBudget: catBudget,
      estimatedCost: estimatedPrice,
      percentageOfBudget: Math.round((estimatedPrice / budget) * 100),
      costPerGuest: Math.round(estimatedPrice / guestCount),
      status: estimatedPrice <= catBudget ? 'under' : 'over',
      note: cat.includes('Catering') ? `Approx ${getCurrencySymbol(currency)}${Math.round(estimatedPrice / guestCount)} per plate` : 'Venue & vendor package',
    });
  });

  const remaining = budget - totalAllocated;
  const costPerGuest = Math.round(totalAllocated / guestCount);
  const budgetStatus = remaining < 0 ? 'over_budget' : (remaining < budget * 0.05 ? 'stretched' : 'within_budget');

  return {
    id: planId,
    planType: 'party',
    title: `${eventType} (${guestCount} Guests) at ${venuePreference}`,
    createdAt: new Date().toISOString(),
    totalBudget: budget,
    estimatedSpending: totalAllocated,
    remainingBalance: remaining,
    costPerGuest,
    currency,
    eventType,
    guestCount,
    categoryAllocations,
    recommendations,
    timelineChecklist: [
      { timeframe: '3 Weeks Prior', task: `Reserve ${venuePreference} and confirm deposit terms` },
      { timeframe: '2 Weeks Prior', task: `Finalize ${foodPreference} tasting menu with caterer` },
      { timeframe: '5 Days Prior', task: 'Send reminder to guests and confirm final headcount' },
      { timeframe: 'Day of Event', task: 'Coordinate soundcheck and floral photo booth arrival' },
    ],
    budgetAdvice: [
      'Order catering buffet style instead of table service to cut staffing overhead by up to 20%.',
      'Use digital invitations with RSVP tracking to avoid food wastage.',
      'Check OYO & local hotel banquet promotions for bundled hall + sound packages.',
    ],
    budgetStatus,
    generatedBy: 'smart-engine',
  };
}

// ==========================================
// 3. JEWELRY BUDGET PLANNER & OUTFIT MATCHER
// ==========================================
export async function generateJewelryPlan(input: JewelryPlanInput): Promise<JewelryPlanResult> {
  const { budget, currency, occasion, preferredTypes, material, style, outfitImage, outfitDescription, notes } = input;
  if (!budget || budget <= 0) {
    throw new Error('Please enter a valid positive budget amount.');
  }

  const planId = `plan_jewelry_${Date.now()}`;
  const typesToUse = preferredTypes.length > 0 ? preferredTypes : ['Necklace / Choker', 'Earrings / Jhumkas / Studs'];

  const promptText = `
You are PocketSmart AI, an haute joaillerie stylist and luxury budget planner.
Analyze the user's budget and requirements:
- Total Budget: ${budget} ${currency}
- Occasion: ${occasion}
- Jewelry Pieces Desired: ${typesToUse.join(', ')}
- Preferred Material / Metal: ${material}
- Aesthetic Style: ${style}
- Outfit Description: ${outfitDescription || 'Not provided'}
- Additional Notes: ${notes || 'None'}
${outfitImage ? 'An outfit image has been provided. Analyze the colors, neckline, undertones, and fabric aesthetic to recommend matching jewelry.' : ''}

CRITICAL RULES:
1. The sum of all jewelry item prices MUST STAY WITHIN or very close to ${budget} ${currency}.
2. If an outfit is provided/described, extract dominant color palette hex codes, neckline, and explain why the selected metals (e.g. ${material}) and stones harmonize with the outfit.
3. Suggest items discoverable on Tanishq, CaratLane, Bluestone, Giva, Amazon, Flipkart.
4. Calculate individual item prices and budget allocations.

Return ONLY a pure JSON object matching:
{
  "title": "string",
  "outfitAnalysis": {
    "detectedPalette": [
      { "hex": "#...", "name": "string color name" },
      { "hex": "#...", "name": "string color name" }
    ],
    "outfitAesthetic": "string",
    "necklineAndSilhouette": "string",
    "stylingRationale": "string (clear reason why this jewelry complements the outfit)"
  },
  "categoryAllocations": [
    {
      "category": "string",
      "allocatedBudget": number,
      "estimatedCost": number,
      "percentageOfBudget": number,
      "status": "under" | "match" | "over"
    }
  ],
  "recommendations": [
    {
      "name": "string",
      "type": "string",
      "material": "string",
      "estimatedPrice": number,
      "description": "string",
      "matchWithOutfit": "string (why it pairs beautifully)",
      "platforms": ["Tanishq" | "CaratLane" | "Bluestone" | "Giva" | "Amazon" | "Flipkart"],
      "careTip": "string",
      "certifiedEstimateNote": "string"
    }
  ],
  "stylingGuidelines": [
    "string guideline 1",
    "string guideline 2",
    "string guideline 3"
  ],
  "budgetWarnings": [
    "string warning or smart buying tip"
  ]
}
`;

  if (ai) {
    try {
      let contentsPayload: any = promptText;

      // Multimodal vision if outfit image exists!
      if (outfitImage && outfitImage.includes(',')) {
        const matches = outfitImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          contentsPayload = {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
              {
                text: promptText,
              },
            ],
          };
        }
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contentsPayload,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = extractJsonFromText(response.text || '{}');
      if (parsed && Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) {
        let totalCost = 0;
        const recommendations: JewelryRecommendationItem[] = parsed.recommendations.map((rec: any, idx: number) => {
          const price = Math.max(1, Number(rec.estimatedPrice) || 1000);
          totalCost += price;
          const platforms: string[] = Array.isArray(rec.platforms) && rec.platforms.length > 0 ? rec.platforms : ['Tanishq', 'CaratLane'];

          return {
            id: `rec_j_${idx + 1}`,
            name: rec.name || `${material} ${rec.type || 'Jewelry Piece'}`,
            type: rec.type || typesToUse[0] || 'Necklace',
            material: rec.material || material,
            estimatedPrice: price,
            description: rec.description || `Exquisitely crafted ${material} piece for ${occasion}.`,
            matchWithOutfit: rec.matchWithOutfit || 'Accentuates neckline and contrasts warmly with outfit tones.',
            suggestedStores: platforms.map((p) => ({
              platform: p as any,
              searchUrl: buildSearchUrl(p, `${rec.name} ${material}`),
            })),
            careTip: rec.careTip || 'Store in airtight suede pouch away from perfume sprays.',
            certifiedEstimateNote: rec.certifiedEstimateNote || 'BIS Hallmarked / IGI Certified benchmark estimate.',
          };
        });

        const remaining = budget - totalCost;
        const status = totalCost > budget ? 'over_budget' : (remaining < budget * 0.05 ? 'stretched' : 'within_budget');

        return {
          id: planId,
          planType: 'jewelry',
          title: parsed.title || `${occasion} ${material} Jewelry Collection`,
          createdAt: new Date().toISOString(),
          totalBudget: budget,
          estimatedSpending: totalCost,
          remainingBalance: remaining,
          currency,
          occasion,
          material,
          style,
          outfitAnalysis: parsed.outfitAnalysis || (outfitDescription ? {
            detectedPalette: [{ hex: '#8B0000', name: 'Crimson' }, { hex: '#D4AF37', name: 'Warm Gold' }],
            outfitAesthetic: outfitDescription,
            necklineAndSilhouette: 'Standard Neckline',
            stylingRationale: `Warm ${material} tones balance the deep richness of the described garment.`,
          } : undefined),
          outfitImagePreview: outfitImage,
          categoryAllocations: parsed.categoryAllocations || typesToUse.map((t) => ({
            category: t,
            allocatedBudget: Math.round(budget / typesToUse.length),
            estimatedCost: Math.round(totalCost / typesToUse.length),
            percentageOfBudget: Math.round(100 / typesToUse.length),
            status: 'match',
          })),
          recommendations,
          stylingGuidelines: parsed.stylingGuidelines || [
            `For ${occasion}, keep earrings proportional to your necklace volume so they do not compete.`,
            'Ensure metal undertones match your outfit embroidery and clutch hardware.',
          ],
          budgetWarnings: parsed.budgetWarnings || [
            '18K and 22K gold prices fluctuate with daily market rates; look for zero making charge promo days on CaratLane/Tanishq.',
          ],
          budgetStatus: status,
          generatedBy: 'gemini',
        };
      }
    } catch (err) {
      console.warn('Gemini jewelry generation fallback triggered:', err);
    }
  }

  return generateJewelryPlanFallback(input, planId);
}

function generateJewelryPlanFallback(input: JewelryPlanInput, planId: string): JewelryPlanResult {
  const { budget, currency, occasion, preferredTypes, material, style, outfitImage, outfitDescription } = input;
  const types = preferredTypes.length > 0 ? preferredTypes : ['Necklace / Choker', 'Earrings / Jhumkas / Studs'];

  let totalAllocated = 0;
  const perTypeBudget = Math.floor(budget / types.length);
  const recommendations: JewelryRecommendationItem[] = [];

  types.forEach((type, idx) => {
    const benchmark = JEWELRY_CATALOG_BENCHMARKS.find((b) => b.type.toLowerCase().includes(type.toLowerCase()) || type.toLowerCase().includes(b.type.toLowerCase())) || JEWELRY_CATALOG_BENCHMARKS[idx % JEWELRY_CATALOG_BENCHMARKS.length];

    const baseINR = benchmark.priceINR;
    const convertedBase = convertPrice(baseINR, currency);
    const price = Math.min(Math.round(perTypeBudget * 0.95), Math.max(convertedBase, Math.round(perTypeBudget * 0.6)));
    totalAllocated += price;

    recommendations.push({
      id: `rec_j_f_${idx + 1}`,
      name: `${material} ${style} ${benchmark.name}`,
      type,
      material,
      estimatedPrice: price,
      description: `Handcrafted in ${material} with subtle detailing. Ideal balance of elegance and daily durability.`,
      matchWithOutfit: outfitDescription
        ? `Ties into ${outfitDescription} by providing a luminous metallic contrast along the neckline.`
        : `Complements ${occasion} wear with balanced luster and refined silhouette.`,
      suggestedStores: benchmark.platforms.map((p) => ({
        platform: p as any,
        searchUrl: buildSearchUrl(p, `${material} ${type} ${style}`),
      })),
      careTip: 'Clean gently with lukewarm soapy water and dry with microfiber cloth.',
      certifiedEstimateNote: 'Standard BIS Hallmarked / 925 Stamped benchmark estimate.',
    });
  });

  const remaining = budget - totalAllocated;
  const budgetStatus = remaining < 0 ? 'over_budget' : (remaining < budget * 0.05 ? 'stretched' : 'within_budget');

  const outfitAnalysis: OutfitAnalysis | undefined = outfitImage || outfitDescription ? {
    detectedPalette: [
      { hex: '#C5A059', name: 'Imperial Gold' },
      { hex: '#800020', name: 'Burgundy Wine' },
      { hex: '#2C3E50', name: 'Midnight Navy' },
    ],
    outfitAesthetic: outfitDescription || 'Festive Elegant Silhouette',
    necklineAndSilhouette: 'Flattering Collarbone Neckline',
    stylingRationale: `${material} creates radiant warmth against the outfit's tones, highlighting facial contours without overpowering the fabric's embroidery.`,
  } : undefined;

  return {
    id: planId,
    planType: 'jewelry',
    title: `${occasion} ${material} Curated Collection`,
    createdAt: new Date().toISOString(),
    totalBudget: budget,
    estimatedSpending: totalAllocated,
    remainingBalance: remaining,
    currency,
    occasion,
    material,
    style,
    outfitAnalysis,
    outfitImagePreview: outfitImage,
    categoryAllocations: types.map((t, i) => ({
      category: t,
      allocatedBudget: perTypeBudget,
      estimatedCost: recommendations[i]?.estimatedPrice || perTypeBudget,
      percentageOfBudget: Math.round((perTypeBudget / budget) * 100),
      status: 'under',
    })),
    recommendations,
    stylingGuidelines: [
      'Balance statement pieces: if wearing a bold choker or jhumka, keep rings and bracelets subtle.',
      'Check hallmarking stamps (916 for 22K, 750 for 18K, 925 for Silver) for guaranteed purity.',
      'Always test clasp mechanisms on necklaces and tennis bracelets for everyday peace of mind.',
    ],
    budgetWarnings: [
      'Jewelry labor/making charges range from 8% to 22%; negotiate making fees during festival festive campaigns.',
    ],
    budgetStatus,
    generatedBy: 'smart-engine',
  };
}

import crypto from 'crypto';
import type { AnyPlanResult, UserProfile } from '../src/types/index.js';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

// In-memory persistent database store
class MemoryDatabase {
  private users: Map<string, UserRecord> = new Map();
  private sessions: Map<string, { userId: string; createdAt: number }> = new Map();
  private history: Map<string, AnyPlanResult & { userId?: string }> = new Map();

  constructor() {
    this.seedDemoData();
  }

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password + 'pocketsmart_salt_2026').digest('hex');
  }

  private seedDemoData() {
    // Demo user
    const demoUser: UserRecord = {
      id: 'user_demo_1',
      name: 'Priya Sharma',
      email: 'demo@pocketsmart.ai',
      passwordHash: this.hashPassword('pocket123'),
      createdAt: new Date().toISOString(),
    };
    this.users.set(demoUser.email, demoUser);

    // Initial session token for convenience
    this.sessions.set('demo_session_token', {
      userId: demoUser.id,
      createdAt: Date.now(),
    });

    // Sample Home Interior Plan
    const homeDemo: AnyPlanResult & { userId?: string } = {
      id: 'plan_home_demo_1',
      userId: demoUser.id,
      planType: 'home',
      title: 'Modern Minimalist 2BHK Living & Bedroom Setup',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      totalBudget: 150000,
      allocatedTotal: 147500,
      estimatedSpending: 142300,
      remainingBalance: 7700,
      savingsPercentage: 5.1,
      budgetStatus: 'within_budget',
      currency: 'INR',
      stylePreference: 'Modern Minimalist',
      roomsSummary: [
        { room: 'Living Room', itemCount: 4, estimatedCost: 82500 },
        { room: 'Bedroom', itemCount: 3, estimatedCost: 59800 },
      ],
      categoryAllocations: [
        { category: 'Sofa & Seating', allocatedBudget: 45000, estimatedCost: 42000, percentageOfBudget: 28, status: 'under' },
        { category: 'Lighting & Fans', allocatedBudget: 18000, estimatedCost: 16500, percentageOfBudget: 11, status: 'under' },
        { category: 'Bed & Mattress', allocatedBudget: 42000, estimatedCost: 43000, percentageOfBudget: 29, status: 'over' },
        { category: 'Wardrobe & Storage', allocatedBudget: 42500, estimatedCost: 40800, percentageOfBudget: 27, status: 'under' },
      ],
      recommendations: [
        {
          id: 'rec_h1',
          name: 'Nordic 3-Seater High-Density Fabric Sofa',
          room: 'Living Room',
          category: 'Sofa & Seating',
          estimatedPrice: 38500,
          quantity: 1,
          totalPrice: 38500,
          description: 'Solid pine wood inner frame with spill-resistant oatmeal grey fabric. Ergonomic curved armrests.',
          suggestedStores: [
            { platform: 'IKEA', searchUrl: 'https://www.ikea.com/in/en/search/?q=3-seater+fabric+sofa' },
            { platform: 'Pepperfry', searchUrl: 'https://www.pepperfry.com/site_product/search?q=fabric+sofa+3+seater' },
            { platform: 'Amazon', searchUrl: 'https://www.amazon.in/s?k=3+seater+nordic+fabric+sofa' },
          ],
          styleMatchScore: 98,
          dimensionsOrSpecs: 'W: 210cm x D: 88cm x H: 85cm',
          budgetTier: 'Mid-range',
          proTip: 'Measure your elevator door clearance before delivery.',
        },
        {
          id: 'rec_h2',
          name: 'Tri-Tone Dimmable LED Pendant Linear Chandelier',
          room: 'Living Room',
          category: 'Lighting & Fans',
          estimatedPrice: 6500,
          quantity: 1,
          totalPrice: 6500,
          description: 'Ultra-thin architectural matte black hanging bar with 3000K-6500K remote color temperature control.',
          suggestedStores: [
            { platform: 'Amazon', searchUrl: 'https://www.amazon.in/s?k=linear+pendant+chandelier+dimmable' },
            { platform: 'Flipkart', searchUrl: 'https://www.flipkart.com/search?q=pendant+led+hanging+light' },
          ],
          styleMatchScore: 94,
          dimensionsOrSpecs: 'Length: 120cm, 36W LED, 3200 Lumens',
          budgetTier: 'Value',
          proTip: 'Hang 30-36 inches above the coffee table for optimal glare-free diffusion.',
        },
        {
          id: 'rec_h3',
          name: 'Queen Engineered Wood Bed with Hydraulic Box Storage',
          room: 'Bedroom',
          category: 'Bed & Mattress',
          estimatedPrice: 24500,
          quantity: 1,
          totalPrice: 24500,
          description: 'European E1-grade pre-laminated board with high-torque gas lifters for effortless mattress elevation.',
          suggestedStores: [
            { platform: 'IKEA', searchUrl: 'https://www.ikea.com/in/en/search/?q=storage+bed+queen' },
            { platform: 'Flipkart', searchUrl: 'https://www.flipkart.com/search?q=queen+bed+hydraulic+storage' },
          ],
          styleMatchScore: 92,
          dimensionsOrSpecs: 'Length 78" x Width 60" x Height 36"',
          budgetTier: 'Mid-range',
          proTip: 'Pair with an 8-inch pocket spring or orthopedic memory foam mattress.',
        }
      ],
      budgetOptimizationTips: [
        'Bundling the sofa and center table from IKEA or Pepperfry can unlock an extra 8-12% bank discount.',
        'Use BLDC smart ceiling fans to shave up to 60% on living room power bills.',
      ],
      alternativeBudgetScenarios: {
        lowerCostOption: 'Switching to a 2-seater modular sofa saves approx ₹14,000 without sacrificing aesthetic flow.',
        premiumUpgradeOption: 'Upgrading the bed to solid Sheesham wood adds lifetime durability for ~₹12,000 more.',
      },
      generatedBy: 'smart-engine',
    };
    this.history.set(homeDemo.id, homeDemo);
  }

  public register(name: string, email: string, password: string): { user: UserProfile; token: string } {
    const existing = this.users.get(email.toLowerCase().trim());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }
    const user: UserRecord = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: this.hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    this.users.set(user.email, user);
    const token = `tok_${crypto.randomBytes(16).toString('hex')}`;
    this.sessions.set(token, { userId: user.id, createdAt: Date.now() });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: 'INR',
        savedPlansCount: 0,
      },
      token,
    };
  }

  public login(email: string, password: string): { user: UserProfile; token: string } {
    const user = this.users.get(email.toLowerCase().trim());
    if (!user) {
      throw new Error('Invalid email or password.');
    }
    if (user.passwordHash !== this.hashPassword(password)) {
      throw new Error('Invalid email or password.');
    }
    const token = `tok_${crypto.randomBytes(16).toString('hex')}`;
    this.sessions.set(token, { userId: user.id, createdAt: Date.now() });

    const userPlans = Array.from(this.history.values()).filter((p) => p.userId === user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: 'INR',
        savedPlansCount: userPlans.length,
      },
      token,
    };
  }

  public getUserFromToken(token?: string): UserProfile | null {
    if (!token) return null;
    const session = this.sessions.get(token);
    if (!session) return null;
    const user = Array.from(this.users.values()).find((u) => u.id === session.userId);
    if (!user) return null;

    const userPlans = Array.from(this.history.values()).filter((p) => p.userId === user.id);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      currency: 'INR',
      savedPlansCount: userPlans.length,
    };
  }

  public logout(token: string): boolean {
    return this.sessions.delete(token);
  }

  public savePlan(plan: AnyPlanResult, userId?: string): AnyPlanResult {
    const record = { ...plan, userId };
    this.history.set(plan.id, record);
    return plan;
  }

  public getHistory(userId?: string): AnyPlanResult[] {
    const all = Array.from(this.history.values());
    if (!userId) {
      return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    const filtered = all.filter((p) => !p.userId || p.userId === userId);
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getPlanById(id: string): AnyPlanResult | null {
    return this.history.get(id) || null;
  }

  public deletePlan(id: string, userId?: string): boolean {
    const plan = this.history.get(id);
    if (!plan) return false;
    if (userId && plan.userId && plan.userId !== userId) return false;
    return this.history.delete(id);
  }
}

export const db = new MemoryDatabase();

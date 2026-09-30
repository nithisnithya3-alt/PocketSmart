import { Router, Request, Response } from 'express';
import { db } from './db.js';
import { generateHomePlan, generatePartyPlan, generateJewelryPlan } from './geminiService.js';
import type { HomePlanInput, PartyPlanInput, JewelryPlanInput } from '../src/types/index.js';

export const apiRouter = Router();

// Helper to extract bearer token or header
function getAuthToken(req: Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return req.headers['x-session-token'] as string | undefined;
}

// 1. User Registration
apiRouter.post('/register', (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }
    const result = db.register(name, email, password);
    return res.status(201).json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Registration failed.' });
  }
});

// 2. User Login
apiRouter.post('/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const result = db.login(email, password);
    return res.json(result);
  } catch (err: any) {
    return res.status(401).json({ error: err.message || 'Login failed.' });
  }
});

// 3. User Logout
apiRouter.post('/logout', (req: Request, res: Response) => {
  const token = getAuthToken(req);
  if (token) {
    db.logout(token);
  }
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// 4. Session Info
apiRouter.get('/session-info', (req: Request, res: Response) => {
  const token = getAuthToken(req);
  const user = db.getUserFromToken(token);
  return res.json({
    authenticated: !!user,
    user: user || null,
    serverTime: new Date().toISOString(),
    supportedCurrencies: ['INR', 'USD', 'EUR', 'GBP'],
    aiModel: 'gemini-3.8-flash',
  });
});

// 5. Session Data (Personalized stats and saved plans)
apiRouter.get('/session-data', (req: Request, res: Response) => {
  const token = getAuthToken(req);
  const user = db.getUserFromToken(token);
  const plans = db.getHistory(user?.id);

  const stats = {
    totalPlansCreated: plans.length,
    homePlansCount: plans.filter((p) => p.planType === 'home').length,
    partyPlansCount: plans.filter((p) => p.planType === 'party').length,
    jewelryPlansCount: plans.filter((p) => p.planType === 'jewelry').length,
    totalBudgetManaged: plans.reduce((acc, p) => acc + (p.totalBudget || 0), 0),
    totalSavingsCalculated: plans.reduce((acc, p) => acc + Math.max(0, p.remainingBalance || 0), 0),
  };

  return res.json({
    user: user || null,
    stats,
    recentPlans: plans.slice(0, 5),
  });
});

// 6. Generate Home Interior Recommendations
apiRouter.post('/generate-home', async (req: Request, res: Response) => {
  try {
    const input: HomePlanInput = req.body;
    if (!input.budget || Number(input.budget) <= 0) {
      return res.status(400).json({ error: 'Please enter a positive budget amount.' });
    }
    const token = getAuthToken(req);
    const user = db.getUserFromToken(token);

    const plan = await generateHomePlan(input);
    db.savePlan(plan, user?.id);

    return res.json(plan);
  } catch (err: any) {
    console.error('Error generating home plan:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate home interior plan.' });
  }
});

// 7. Generate Party Planning Recommendations
apiRouter.post('/generate-party', async (req: Request, res: Response) => {
  try {
    const input: PartyPlanInput = req.body;
    if (!input.budget || Number(input.budget) <= 0) {
      return res.status(400).json({ error: 'Please enter a positive budget amount.' });
    }
    if (!input.guestCount || Number(input.guestCount) <= 0) {
      return res.status(400).json({ error: 'Guest count must be at least 1.' });
    }
    const token = getAuthToken(req);
    const user = db.getUserFromToken(token);

    const plan = await generatePartyPlan(input);
    db.savePlan(plan, user?.id);

    return res.json(plan);
  } catch (err: any) {
    console.error('Error generating party plan:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate party plan.' });
  }
});

// 8. Generate Jewelry Recommendations (with optional outfit analysis)
apiRouter.post('/generate-jewelry', async (req: Request, res: Response) => {
  try {
    const input: JewelryPlanInput = req.body;
    if (!input.budget || Number(input.budget) <= 0) {
      return res.status(400).json({ error: 'Please enter a positive budget amount.' });
    }
    const token = getAuthToken(req);
    const user = db.getUserFromToken(token);

    const plan = await generateJewelryPlan(input);
    db.savePlan(plan, user?.id);

    return res.json(plan);
  } catch (err: any) {
    console.error('Error generating jewelry plan:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate jewelry plan.' });
  }
});

// 9. Recommendations Details by ID
apiRouter.get('/recommendations-details', (req: Request, res: Response) => {
  const id = req.query.id as string;
  if (!id) {
    return res.status(400).json({ error: 'Plan ID query parameter is required.' });
  }
  const plan = db.getPlanById(id);
  if (!plan) {
    return res.status(404).json({ error: 'Plan not found.' });
  }
  return res.json(plan);
});

// 10. History List
apiRouter.get('/history', (req: Request, res: Response) => {
  const token = getAuthToken(req);
  const user = db.getUserFromToken(token);
  const history = db.getHistory(user?.id);
  return res.json(history);
});

// 11. Delete History Item
apiRouter.delete('/history/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const token = getAuthToken(req);
  const user = db.getUserFromToken(token);
  const deleted = db.deletePlan(id, user?.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Plan could not be deleted or not found.' });
  }
  return res.json({ success: true, message: 'Plan deleted from history.' });
});

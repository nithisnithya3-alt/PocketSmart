import type {
  HomePlanInput,
  HomePlanResult,
  PartyPlanInput,
  PartyPlanResult,
  JewelryPlanInput,
  JewelryPlanResult,
  AnyPlanResult,
  UserProfile,
} from '../types/index.js';

const TOKEN_KEY = 'pocketsmart_auth_token';
const USER_KEY = 'pocketsmart_auth_user';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeAuth(token: string, user: UserProfile) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to store auth:', e);
  }
}

export function clearStoredAuth() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error('Failed to clear auth:', e);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['x-session-token'] = token;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP error ${response.status}`);
  }
  return data as T;
}

export const api = {
  async register(name: string, email: string, password: string): Promise<{ user: UserProfile; token: string }> {
    const res = await request<{ user: UserProfile; token: string }>('/api/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    storeAuth(res.token, res.user);
    return res;
  },

  async login(email: string, password: string): Promise<{ user: UserProfile; token: string }> {
    const res = await request<{ user: UserProfile; token: string }>('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    storeAuth(res.token, res.user);
    return res;
  },

  async logout(): Promise<void> {
    try {
      await request('/api/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      clearStoredAuth();
    }
  },

  async getSessionInfo(): Promise<{
    authenticated: boolean;
    user: UserProfile | null;
    serverTime: string;
    supportedCurrencies: string[];
    aiModel: string;
  }> {
    return request('/api/session-info');
  },

  async getSessionData(): Promise<{
    user: UserProfile | null;
    stats: {
      totalPlansCreated: number;
      homePlansCount: number;
      partyPlansCount: number;
      jewelryPlansCount: number;
      totalBudgetManaged: number;
      totalSavingsCalculated: number;
    };
    recentPlans: AnyPlanResult[];
  }> {
    return request('/api/session-data');
  },

  async generateHome(input: HomePlanInput): Promise<HomePlanResult> {
    return request<HomePlanResult>('/api/generate-home', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async generateParty(input: PartyPlanInput): Promise<PartyPlanResult> {
    return request<PartyPlanResult>('/api/generate-party', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async generateJewelry(input: JewelryPlanInput): Promise<JewelryPlanResult> {
    return request<JewelryPlanResult>('/api/generate-jewelry', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async getRecommendationsDetails(id: string): Promise<AnyPlanResult> {
    return request<AnyPlanResult>(`/api/recommendations-details?id=${encodeURIComponent(id)}`);
  },

  async getHistory(): Promise<AnyPlanResult[]> {
    return request<AnyPlanResult[]>('/api/history');
  },

  async deleteHistory(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/history/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};

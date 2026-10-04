/* ==========================================================================
   KV store abstraction.
   Production: set KV_REST_API_URL + KV_REST_API_TOKEN (Vercel KV / Upstash)
   and the REST client is used automatically — no extra dependencies.
   Development / demo: in-memory Map (persisted for the process lifetime).
   ========================================================================== */

type Json = unknown;

interface KvLike {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: Json): Promise<void>;
  incr(key: string): Promise<number>;
}

const globalStore = globalThis as unknown as { __ukweliMem?: Map<string, Json> };

function memoryKv(): KvLike {
  if (!globalStore.__ukweliMem) globalStore.__ukweliMem = new Map();
  const map = globalStore.__ukweliMem;
  return {
    async get<T>(key: string) {
      return (map.has(key) ? (map.get(key) as T) : null) ?? null;
    },
    async set(key: string, value: Json) {
      map.set(key, value);
    },
    async incr(key: string) {
      const next = Number(map.get(key) ?? 0) + 1;
      map.set(key, next);
      return next;
    },
  };
}

function restKv(): KvLike {
  const url = process.env.KV_REST_API_URL!;
  const token = process.env.KV_REST_API_TOKEN!;
  async function call<T>(path: string, body?: Json): Promise<T> {
    const res = await fetch(`${url}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
    const json = (await res.json()) as { result: T };
    return json.result;
  }
  return {
    async get<T>(key: string) {
      return (await call<T | null>(`/get/${encodeURIComponent(key)}`)) ?? null;
    },
    async set(key: string, value: Json) {
      await call(`/set/${encodeURIComponent(key)}`, { value: JSON.stringify(value) });
    },
    async incr(key: string) {
      return call<number>(`/incr/${encodeURIComponent(key)}`);
    },
  };
}

export const kv: KvLike =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN ? restKv() : memoryKv();

// ------------------------------------------------------------- domain types
export interface Purchase {
  orderId: string;
  bookSlug: string;
  email: string;
  method: "mpesa" | "card" | "free";
  amountKES: number;
  purchasedAt: string; // ISO
  downloadsUsed: number;
  token: string; // signed download token
}

export async function savePurchase(p: Purchase): Promise<void> {
  await kv.set(`purchase:${p.orderId}`, p);
  const listKey = `purchases:${p.email}`;
  const list = (await kv.get<string[]>(listKey)) ?? [];
  await kv.set(listKey, [...list, p.orderId]);
}

export async function getPurchase(orderId: string): Promise<Purchase | null> {
  return kv.get<Purchase>(`purchase:${orderId}`);
}

export async function updatePurchase(p: Purchase): Promise<void> {
  await kv.set(`purchase:${p.orderId}`, p);
}

export async function purchasesFor(email: string): Promise<Purchase[]> {
  const ids = (await kv.get<string[]>(`purchases:${email}`)) ?? [];
  const out: Purchase[] = [];
  for (const id of ids) {
    const p = await getPurchase(id);
    if (p) out.push(p);
  }
  return out.sort((a, b) => b.purchasedAt.localeCompare(a.purchasedAt));
}

export interface NewsletterSubscriber {
  email: string;
  joinedAt: string;
}

export async function addSubscriber(email: string): Promise<void> {
  await kv.set(`newsletter:${email.toLowerCase()}`, { email: email.toLowerCase(), joinedAt: new Date().toISOString() });
}

export interface Subscription {
  email: string;
  plan: string;
  billing: "monthly" | "annual";
  startedAt: string;
  renewsAt: string;
}

export async function saveSubscription(s: Subscription): Promise<void> {
  await kv.set(`subscription:${s.email.toLowerCase()}`, s);
}

export async function getSubscription(email: string): Promise<Subscription | null> {
  return kv.get<Subscription>(`subscription:${email.toLowerCase()}`);
}

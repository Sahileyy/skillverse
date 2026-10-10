export type BadgeTier = {
  id: string;
  name: string;
  minXp: number;
  discountPercent: number;
  maxDiscountAmount: number;
  redeemXpCost: number;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
};

export const BADGE_TIERS: BadgeTier[] = [
  {
    id: "bronze",
    name: "Bronze Scholar",
    minXp: 0,
    discountPercent: 5,
    maxDiscountAmount: 50,
    redeemXpCost: 20,
    icon: "🥉",
    color: "text-amber-800",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description: "Foundational learner. Eligible for 5% discount on paid mentor sessions.",
  },
  {
    id: "silver",
    name: "Silver Explorer",
    minXp: 100,
    discountPercent: 15,
    maxDiscountAmount: 150,
    redeemXpCost: 50,
    icon: "🥈",
    color: "text-slate-800",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-300",
    description: "Active peer learner. Eligible for 15% discount on paid mentor sessions.",
  },
  {
    id: "gold",
    name: "Gold Practitioner",
    minXp: 250,
    discountPercent: 25,
    maxDiscountAmount: 250,
    redeemXpCost: 100,
    icon: "🥇",
    color: "text-amber-700",
    bgColor: "bg-amber-100/70",
    borderColor: "border-amber-300",
    description: "Verified domain capability. Eligible for 25% discount on paid mentor sessions.",
  },
  {
    id: "platinum",
    name: "Platinum Architect",
    minXp: 500,
    discountPercent: 50,
    maxDiscountAmount: 500,
    redeemXpCost: 200,
    icon: "💎",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-300",
    description: "Elite community standing. Eligible for up to 50% discount on paid mentor sessions.",
  },
];

export function getBadgeForXp(xp: number = 0): BadgeTier {
  if (xp >= 500) return BADGE_TIERS[3];
  if (xp >= 250) return BADGE_TIERS[2];
  if (xp >= 100) return BADGE_TIERS[1];
  return BADGE_TIERS[0];
}

export function getNextBadge(xp: number = 0): { nextBadge: BadgeTier | null; xpNeeded: number } {
  if (xp < 100) return { nextBadge: BADGE_TIERS[1], xpNeeded: 100 - xp };
  if (xp < 250) return { nextBadge: BADGE_TIERS[2], xpNeeded: 250 - xp };
  if (xp < 500) return { nextBadge: BADGE_TIERS[3], xpNeeded: 500 - xp };
  return { nextBadge: null, xpNeeded: 0 };
}

/**
 * Calculate discount for a paid session using student's XP
 */
export function calculateXpDiscount(userXp: number, rawPrice: number | string | null) {
  if (!rawPrice) return { discountAmount: 0, finalPrice: 0, canApply: false, badge: getBadgeForXp(userXp) };
  
  const numericPrice = typeof rawPrice === "number" 
    ? rawPrice 
    : parseFloat(String(rawPrice).replace(/[^0-9.]/g, "")) || 0;

  if (numericPrice <= 0) {
    return { discountAmount: 0, finalPrice: 0, canApply: false, badge: getBadgeForXp(userXp) };
  }

  const badge = getBadgeForXp(userXp);
  const canApply = userXp >= badge.redeemXpCost;

  if (!canApply) {
    return { discountAmount: 0, finalPrice: numericPrice, canApply: false, badge };
  }

  const rawDiscount = (numericPrice * badge.discountPercent) / 100;
  const discountAmount = Math.min(rawDiscount, badge.maxDiscountAmount);
  const finalPrice = Math.max(0, numericPrice - discountAmount);

  return {
    discountAmount: Math.round(discountAmount),
    finalPrice: Math.round(finalPrice),
    canApply: true,
    badge,
  };
}

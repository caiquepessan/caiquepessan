import {
  CarFront,
  Coins,
  Crown,
  DollarSign,
  Crosshair,
  Flame,
  Gamepad2,
  Gauge,
  Gem,
  Building2,
  LockOpen,
  Monitor,
  Shirt,
  Timer,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Platform, Product, StatIcon } from "@/data/products";

export const statIcons: Record<StatIcon, LucideIcon> = {
  level: TrendingUp,
  money: Coins,
  cars: CarFront,
  unlock: LockOpen,
  outfit: Shirt,
  property: Building2,
  weapon: Crosshair,
  speed: Timer,
};

export const platformIcons: Record<Platform, LucideIcon> = {
  pc: Monitor,
  playstation: Gamepad2,
  xbox: Gamepad2,
};

export const productIcons = {
  starter: Zap,
  pro: Flame,
  elite: Gem,
  lendaria: Crown,
  money: DollarSign,
  unlock: LockOpen,
  level: Gauge,
  cars: CarFront,
} satisfies Record<string, LucideIcon>;

const serviceIconKeys: Record<string, keyof typeof productIcons> = {
  "unlock-all": "unlock",
  "upar-nivel": "level",
  "pack-carros-modded": "cars",
};

/** Qual ícone representa o produto na "capa" gerada. */
export function productIconKey(product: Product): keyof typeof productIcons {
  if (product.category === "dinheiro") return "money";
  if (product.category === "servico") return serviceIconKeys[product.slug] ?? "starter";
  return product.tier;
}

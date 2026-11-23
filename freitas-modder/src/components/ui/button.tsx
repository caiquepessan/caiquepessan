import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "light" | "dark";
type Size = "sm" | "md" | "lg";

interface StyleProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

const base =
  "group/btn relative isolate inline-flex select-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-xl font-semibold transition-[background-color,color,box-shadow,transform] duration-200 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40";

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-[15px]",
  lg: "h-14 px-7 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-400 hover:shadow-[0_12px_32px_-10px_rgba(232,24,44,0.8)]",
  secondary:
    "bg-white/[0.07] text-white ring-1 ring-inset ring-white/10 hover:bg-white/[0.12] hover:ring-white/20",
  light: "bg-paper text-ink-950 hover:bg-white",
  dark: "bg-ink-950 text-white hover:bg-ink-800",
};

/** Faixa de luz que atravessa o botão no hover. */
function Sheen() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-2/3 -translate-x-[160%] skew-x-[-20deg] bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-[260%]"
    />
  );
}

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: Omit<StyleProps, "children">) {
  return cn(base, sizes[size], variants[variant], className);
}

export function ButtonLink({
  variant,
  size,
  className,
  children,
  ...props
}: StyleProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link className={buttonClasses({ variant, size, className })} {...props}>
      <Sheen />
      {children}
    </Link>
  );
}

export function ButtonAnchor({
  variant,
  size,
  className,
  children,
  ...props
}: StyleProps & Omit<ComponentProps<"a">, "className" | "children">) {
  return (
    <a className={buttonClasses({ variant, size, className })} {...props}>
      <Sheen />
      {children}
    </a>
  );
}

export function Button({
  variant,
  size,
  className,
  children,
  type = "button",
  ...props
}: StyleProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...props}>
      <Sheen />
      {children}
    </button>
  );
}

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
  "group/btn inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-[background-color,color,box-shadow,transform] duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40";

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-[15px]",
  lg: "h-14 px-7 text-base",
};

const variants: Record<Variant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-400",
  secondary:
    "bg-white/[0.07] text-white ring-1 ring-inset ring-white/10 hover:bg-white/[0.12]",
  light: "bg-paper text-ink-950 hover:bg-white",
  dark: "bg-ink-950 text-white hover:bg-ink-800",
};

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
      {children}
    </button>
  );
}

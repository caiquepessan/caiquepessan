import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

interface StyleProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

const base =
  "group/btn relative isolate inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap font-tech font-semibold uppercase tracking-[0.08em] transition-[transform,filter,color] duration-300 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-xs [--cut:9px]",
  md: "h-12 px-6 text-[13px] [--cut:11px]",
  lg: "h-14 px-8 text-sm [--cut:13px]",
};

const variants: Record<Variant, string> = {
  primary:
    "text-white drop-shadow-[0_0_14px_rgba(255,42,71,0.45)] hover:drop-shadow-[0_0_26px_rgba(255,42,71,0.75)]",
  outline: "text-bone-100 hover:text-white",
  ghost: "text-bone-300 hover:text-white",
  light:
    "text-ink-950 drop-shadow-[0_0_14px_rgba(255,255,255,0.2)] hover:drop-shadow-[0_0_24px_rgba(255,255,255,0.4)]",
};

function ButtonBackground({ variant }: { variant: Variant }) {
  if (variant === "ghost") {
    return (
      <span
        aria-hidden
        className="absolute inset-0 -z-10 rounded-md transition-colors duration-300 group-hover/btn:bg-white/6"
      />
    );
  }

  if (variant === "outline") {
    return (
      <span
        aria-hidden
        className="clip-corner absolute inset-0 -z-10 bg-blood-500/40 transition-colors duration-300 group-hover/btn:bg-blood-400"
      >
        <span className="clip-corner absolute inset-px bg-ink-900/95 transition-colors duration-300 group-hover/btn:bg-ink-800" />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "clip-corner absolute inset-0 -z-10 overflow-hidden",
        variant === "primary"
          ? "bg-linear-to-r from-blood-700 via-blood-600 to-blood-500"
          : "bg-bone-50",
      )}
    >
      <span className="absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] bg-linear-to-r from-transparent via-white/45 to-transparent group-hover/btn:animate-sweep" />
    </span>
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
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: StyleProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link className={buttonClasses({ variant, size, className })} {...props}>
      <ButtonBackground variant={variant} />
      {children}
    </Link>
  );
}

export function ButtonAnchor({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: StyleProps & Omit<ComponentProps<"a">, "className" | "children">) {
  return (
    <a className={buttonClasses({ variant, size, className })} {...props}>
      <ButtonBackground variant={variant} />
      {children}
    </a>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...props
}: StyleProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      <ButtonBackground variant={variant} />
      {children}
    </button>
  );
}

// app/components/ui/badge.tsx
import { cva, VariantProps } from "class-variance-authority";
import { FC, HTMLAttributes } from "react";

const badgeVariants = cva(
  "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-800",
        secondary: "bg-blue-100 text-blue-800",
        destructive: "bg-red-100 text-red-800",
        outline: "border border-gray-300",
        green: "bg-green-100 text-green-800",
        yellow: "bg-yellow-100 text-yellow-800",
        red: "bg-red-100 text-red-800", // added red
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge: FC<BadgeProps> = ({ variant, className, ...props }) => (
  <span
    className={badgeVariants({ variant }) + " " + (className ?? "")}
    {...props}
  />
);

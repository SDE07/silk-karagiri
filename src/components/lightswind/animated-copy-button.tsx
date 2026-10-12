"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export interface AnimatedCopyButtonProps {
  /** The text that will be copied to the clipboard */
  textToCopy?: string;
  /** Optional classname for the button */
  className?: string;
  /** Size of the button */
  size?: "sm" | "md" | "lg";
  /** Optional callback fired when copied */
  onCopy?: () => void;
  /** Optional custom content / text */
  children?: React.ReactNode;
  /** Optional navigation target after copy or on click */
  href?: string;
  /** Optional show arrow icon */
  showArrow?: boolean;
}

export function AnimatedCopyButton({
  textToCopy = "https://silkkaragiri.com/products?category=Sarees",
  className,
  size = "md",
  onCopy,
  children,
  href,
  showArrow = false,
}: AnimatedCopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  const handleCopy = async (e: React.MouseEvent) => {
    try {
      if (textToCopy) {
        await navigator.clipboard.writeText(textToCopy);
      }
      setIsCopied(true);
      if (onCopy) onCopy();

      if (href) {
        setTimeout(() => {
          router.push(href);
        }, 600);
      }

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      if (href) router.push(href);
    }
  };

  const sizes = {
    sm: "h-8 min-w-8 text-xs",
    md: "h-10 min-w-10 text-sm",
    lg: "h-12 min-w-12 text-base",
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "relative flex items-center justify-center rounded-md border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring select-none cursor-pointer",
        !children && sizes[size],
        className
      )}
      aria-label="Copy to clipboard"
    >
      {children ? (
        <span className="inline-flex items-center gap-2">
          <span>{isCopied ? "Link Copied!" : children}</span>
          <AnimatePresence initial={false} mode="wait">
            {isCopied ? (
              <motion.span
                key="check"
                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="flex items-center text-golden-orange"
              >
                <Check className={iconSizes[size]} />
              </motion.span>
            ) : showArrow ? (
              <motion.span
                key="arrow"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 4 }}
                className="flex items-center"
              >
                <ArrowRight className={iconSizes[size]} />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="flex items-center opacity-80"
              >
                <Copy className={iconSizes[size]} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      ) : (
        <AnimatePresence initial={false}>
          {isCopied ? (
            <motion.div
              key="check"
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute flex items-center justify-center text-green-500"
            >
              <Check className={iconSizes[size]} />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute flex items-center justify-center text-foreground/70"
            >
              <Copy className={iconSizes[size]} />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Background Ripple Effect on Copy */}
      {isCopied && (
        <motion.div
          initial={{ opacity: 0.4, scale: 0.95 }}
          animate={{ opacity: 0, scale: 1.15 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 rounded-full bg-golden-orange/20 pointer-events-none"
        />
      )}
    </button>
  );
}

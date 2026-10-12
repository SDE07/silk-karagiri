"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-ink-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-out Drawer */}
      <div className="relative w-full max-w-md bg-vanilla-custard-900 text-ink-black h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-golden-orange/25">
        {/* Header */}
        <div className="px-6 py-5 border-b border-golden-orange/20 flex items-center justify-between bg-vanilla-custard-800/40">
          <div className="flex items-center gap-2.5">
            <h2 className="font-heading-sub text-xl font-bold text-ink-black">
              Shopping Bag
            </h2>
            <span className="font-ui text-xs bg-golden-orange/15 text-golden-orange-400 border border-golden-orange/30 px-2.5 py-0.5 rounded-full font-bold">
              {totalItems}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-full hover:bg-vanilla-custard-800 text-ink-black transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-ink-black-300 space-y-3">
              <div className="w-16 h-16 rounded-full bg-vanilla-custard-800 border border-golden-orange/30 flex items-center justify-center text-golden-orange">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="font-heading-sub text-xl text-ink-black font-bold">Your bag is empty</p>
              <p className="font-body text-sm max-w-xs text-ink-black-300">
                Explore our pure silk collections and add timeless handwoven drapes to your cart.
              </p>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-4 p-3.5 rounded-xl border border-golden-orange/20 bg-white/70 shadow-2xs"
              >
                <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0 border border-golden-orange/20">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-heading-sub text-sm font-bold text-ink-black line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="font-ui text-xs font-semibold text-dark-teal mt-0.5">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2 font-ui">
                    <div className="flex items-center border border-golden-orange/30 rounded-full text-xs bg-vanilla-custard-800/50">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-2.5 py-0.5 hover:bg-vanilla-custard-700 rounded-l-full cursor-pointer text-ink-black"
                      >
                        -
                      </button>
                      <span className="px-2 font-bold text-ink-black">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-2.5 py-0.5 hover:bg-vanilla-custard-700 rounded-r-full cursor-pointer text-ink-black"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="font-ui text-xs text-brown-red hover:text-oxidized-iron hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Checkout CTA */}
        {items.length > 0 && (
          <div className="p-6 border-t border-golden-orange/20 space-y-4 bg-vanilla-custard-800/50">
            <div className="flex items-center justify-between">
              <span className="font-ui text-xs uppercase tracking-wider text-dark-teal-400 font-semibold">Subtotal</span>
              <span className="font-ui text-lg font-bold text-dark-teal">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="font-body text-xs text-ink-black-300 leading-tight">
              Taxes calculated at checkout. Complimentary insured express delivery across India.
            </p>
            <Button className="w-full" size="md" variant="primary">
              Proceed to Secure Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

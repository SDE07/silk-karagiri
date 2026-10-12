"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div className={cn("flex flex-col items-center gap-4 p-4 rounded-lg bg-vanilla-custard-800/40 border border-golden-orange/20")}>
      <h1 className="text-2xl font-bold mb-2 font-heading-main text-ink-black">Component Example</h1>
      <h2 className="text-xl font-semibold font-ui text-dark-teal">{count}</h2>
      <div className="flex gap-2">
        <button
          onClick={() => setCount((prev) => prev - 1)}
          className="px-4 py-1.5 rounded-full bg-dark-teal text-vanilla-custard-900 font-ui text-xs"
        >
          -
        </button>
        <button
          onClick={() => setCount((prev) => prev + 1)}
          className="px-4 py-1.5 rounded-full bg-dark-teal text-vanilla-custard-900 font-ui text-xs"
        >
          +
        </button>
      </div>
    </div>
  );
};

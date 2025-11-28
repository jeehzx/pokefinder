"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  items: {
    label: string;
    content: React.ReactNode;
  }[];
  defaultTab?: number;
}

export function Tabs({ items, defaultTab = 0 }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="flex justify-center border-b border-light mb-3 sm:mb-4 gap-1">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={cn(
              "px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all duration-200 relative",
              "hover:text-primary",
              activeTab === index
                ? "text-primary border-b-2 border-primary"
                : "text-medium hover:bg-background/50 rounded-t"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab Content with horizontal slide animation */}
      <div className="relative min-h-[150px] sm:min-h-[200px] overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${activeTab * 100}%)` }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0"
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


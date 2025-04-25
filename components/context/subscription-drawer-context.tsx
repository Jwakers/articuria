"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";

type SubscriptionDrawerContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SubscriptionDrawerContext = createContext<
  SubscriptionDrawerContextType | undefined
>(undefined);

export function SubscriptionDrawerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SubscriptionDrawerContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SubscriptionDrawerContext.Provider>
  );
}

export function useSubscriptionDrawer() {
  const context = useContext(SubscriptionDrawerContext);
  if (context === undefined) {
    throw new Error(
      "useSubscriptionDrawer must be used within a SubscriptionDrawerProvider",
    );
  }
  return context;
}

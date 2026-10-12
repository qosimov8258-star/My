"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type IntroContextValue = {
  introDone: boolean;
  finishIntro: () => void;
};

const IntroContext = createContext<IntroContextValue>({
  introDone: false,
  finishIntro: () => {},
});

export function IntroProvider({ children }: { children: ReactNode }) {
  const [introDone, setIntroDone] = useState(false);

  return (
    <IntroContext.Provider
      value={{ introDone, finishIntro: () => setIntroDone(true) }}
    >
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  return useContext(IntroContext);
}

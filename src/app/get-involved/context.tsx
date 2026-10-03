"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

type OnboardingData = {
  contribution: string;
  state: string;
  lga: string;
  ward: string;
  availability: string;
  skills: string[];
};

type OnboardingContextType = {
  data: OnboardingData;
  setContribution: (value: string) => void;
  setLocation: (state: string, lga: string, ward: string, availability: string) => void;
  setSkills: (skills: string[]) => void;
  reset: () => void;
};

const initialData: OnboardingData = {
  contribution: "",
  state: "",
  lga: "",
  ward: "",
  availability: "",
  skills: [],
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(initialData);

  function setContribution(value: string) {
    setData((current) => ({
      ...current,
      contribution: value,
    }));
  }

  function setLocation(
    state: string,
    lga: string,
    ward: string,
    availability: string,
  ) {
    setData((current) => ({
      ...current,
      state,
      lga,
      ward,
      availability,
    }));
  }

  function setSkills(skills: string[]) {
    setData((current) => ({
      ...current,
      skills,
    }));
  }

  function reset() {
    setData(initialData);
  }

  return (
    <OnboardingContext.Provider
      value={{
        data,
        setContribution,
        setLocation,
        setSkills,
        reset,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error(
      "useOnboarding must be used inside OnboardingProvider",
    );
  }

  return context;
}

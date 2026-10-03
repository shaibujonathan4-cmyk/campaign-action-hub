import { OnboardingProvider } from "./context";

export default function GetInvolvedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <OnboardingProvider>{children}</OnboardingProvider>;
}

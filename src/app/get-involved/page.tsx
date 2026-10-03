"use client";

import Link from "next/link";
import { useState } from "react";
import { useOnboarding } from "./context";

const options = [
  "Community activities",
  "Event support",
  "Digital & media",
  "Professional skills",
  "Research & administration",
  "Volunteer coordination",
];

export default function GetInvolved() {
  const { data, setContribution } = useOnboarding();
  const [selected, setSelected] = useState(data.contribution);

  function selectContribution(option: string) {
    setSelected(option);
    setContribution(option);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/" className="text-sm font-semibold text-blue-600">
          ← Back
        </Link>

        <div className="mt-12">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Step 1 of 3
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
            How would you like to contribute?
          </h1>

          <p className="mt-4 text-lg leading-7 text-slate-600">
            Tell us where your time, skills, or experience can be useful.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {options.map((option) => {
              const active = selected === option;

              return (
                <button
                  key={option}
                  onClick={() => selectContribution(option)}
                  className={`rounded-2xl border p-6 text-left font-semibold transition ${
                    active
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                      : "border-slate-200 bg-white text-slate-800 shadow-sm hover:border-blue-400 hover:shadow-md"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <Link
            href={selected ? "/get-involved/location" : "#"}
            onClick={(event) => {
              if (!selected) event.preventDefault();
            }}
            className={`mt-8 block w-full rounded-xl px-6 py-4 text-center font-bold transition ${
              selected
                ? "bg-slate-950 text-white hover:bg-slate-800"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
          >
            Continue →
          </Link>

          {!selected && (
            <p className="mt-3 text-center text-sm text-slate-500">
              Select one option to continue.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useOnboarding } from "../context";

export default function Location() {
  const { data, setLocation } = useOnboarding();

  const [state, setState] = useState(data.state);
  const [lga, setLga] = useState(data.lga);
  const [ward, setWard] = useState(data.ward);
  const [availability, setAvailability] = useState(data.availability);

  function saveLocation() {
    setLocation(state, lga, ward, availability);
  }

  const ready = state && lga && ward && availability;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/get-involved"
          className="text-sm font-semibold text-blue-600"
        >
          ← Back
        </Link>

        <div className="mt-12">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Step 2 of 3
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
            Where and when can you help?
          </h1>

          <p className="mt-4 text-lg leading-7 text-slate-600">
            This helps coordinators connect you with activities in the right
            location and schedule.
          </p>

          <div className="mt-10 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                State
              </span>
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Kaduna"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                LGA
              </span>
              <input
                value={lga}
                onChange={(e) => setLga(e.target.value)}
                placeholder="e.g. Kaduna North"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Ward
              </span>
              <input
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                placeholder="e.g. Ward 7"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </label>

            <div>
              <p className="text-sm font-semibold text-slate-700">
                Availability
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {["Weekdays", "Weekends", "Both"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setAvailability(item)}
                    className={`rounded-xl border px-4 py-3 font-semibold transition ${
                      availability === item
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-700 hover:border-blue-400"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Link
            href={ready ? "/get-involved/skills" : "#"}
            onClick={(event) => {
              if (!ready) {
                event.preventDefault();
                return;
              }

              saveLocation();
            }}
            className={`mt-8 block w-full rounded-xl px-6 py-4 text-center font-bold transition ${
              ready
                ? "bg-slate-950 text-white hover:bg-slate-800"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
          >
            Continue →
          </Link>
        </div>
      </div>
    </main>
  );
}

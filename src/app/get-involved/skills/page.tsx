"use client";

import Link from "next/link";
import { useState } from "react";
import { useOnboarding } from "../context";

const skills = [
  "Event organization",
  "Graphic design",
  "Writing",
  "Photography",
  "Data entry",
  "Research",
  "Community coordination",
  "Technology",
];

export default function Skills() {
  const { data, setSkills, reset } = useOnboarding();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<string[]>(data.skills);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function toggleSkill(skill: string) {
    setSelected((current) => {
      const next = current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill];

      setSkills(next);
      return next;
    });
  }

  async function submitVolunteer() {
    if (!name || !email || selected.length === 0) {
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/demo/volunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          state: data.state,
          lga: data.lga,
          ward: data.ward,
          availability: data.availability,
          contribution: data.contribution,
          skills: selected,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Unable to save your volunteer profile.");
        return;
      }

      setMessage("Your volunteer profile has been created.");
      reset();
    } finally {
      setSaving(false);
    }
  }

  const ready = name && email && selected.length > 0;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/get-involved/location"
          className="text-sm font-semibold text-blue-600"
        >
          ← Back
        </Link>

        <div className="mt-12">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Step 3 of 3
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
            What can you bring?
          </h1>

          <p className="mt-4 text-lg leading-7 text-slate-600">
            Select the skills or interests you would like to contribute.
          </p>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-5 sm:grid-cols-2">
              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Full name
                </span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </label>

              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </label>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {skills.map((skill) => {
                const active = selected.includes(skill);

                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-2xl border p-5 text-left font-semibold transition ${
                      active
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                        : "border-slate-200 bg-white text-slate-800 shadow-sm hover:border-blue-400"
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      {skill}
                      {active && <span>✓</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={submitVolunteer}
            disabled={!ready || saving}
            className={`mt-8 block w-full rounded-xl px-6 py-4 text-center font-bold transition ${
              ready
                ? "bg-slate-950 text-white hover:bg-slate-800"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
          >
            {saving ? "Saving Profile..." : "Create Volunteer Profile →"}
          </button>

          {message && (
            <p className="mt-4 text-center text-sm font-medium text-slate-600">
              {message}
            </p>
          )}

          {!ready && (
            <p className="mt-3 text-center text-sm text-slate-500">
              Enter your name and email and select at least one skill.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

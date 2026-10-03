"use client";

import Link from "next/link";
import { useState } from "react";

export default function CommunityOutreach() {
  const [joined, setJoined] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/opportunities"
          className="text-sm font-semibold text-blue-600"
        >
          ← Back to opportunities
        </Link>

        <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 px-6 py-10 text-white sm:px-10">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-400">
              Community activity
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Community Outreach
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              Support a local outreach activity by helping coordinators with
              community engagement and event organization.
            </p>
          </div>

          <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Activity details
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="font-semibold text-slate-800">
                    Chikun LGA · Ward 4
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Date & time</p>
                  <p className="font-semibold text-slate-800">
                    Saturday · 10:00 AM
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Coordinator</p>
                  <p className="font-semibold text-slate-800">
                    Community Coordinator
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Availability</p>
                  <p className="font-semibold text-slate-800">
                    4 spots remaining
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6">
              <h2 className="text-lg font-bold text-slate-950">
                What you'll do
              </h2>

              <ul className="mt-4 space-y-3 text-slate-600">
                <li>• Support event setup and coordination.</li>
                <li>• Assist the assigned coordinator.</li>
                <li>• Help with attendance and activity records.</li>
                <li>• Submit a completion update after the activity.</li>
              </ul>

              <button
                onClick={() => setJoined(true)}
                disabled={joined}
                className={`mt-7 w-full rounded-xl px-6 py-4 font-bold transition ${
                  joined
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-blue-600 text-white hover:bg-blue-500"
                }`}
              >
                {joined ? "✓ Activity Joined" : "Join Activity →"}
              </button>

              {joined && (
                <p className="mt-3 text-center text-sm text-slate-500">
                  Your participation has been recorded for this demo.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

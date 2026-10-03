"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type LocationSummary = {
  state: string;
  lgas: number;
  activities: number;
  volunteers: number;
};

export default function Locations() {
  const [locations, setLocations] = useState<LocationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLocations() {
      try {
        const [volunteersResponse, activitiesResponse] = await Promise.all([
          fetch("/api/volunteers"),
          fetch("/api/activities"),
        ]);

        const volunteers = await volunteersResponse.json();
        const activities = await activitiesResponse.json();

        const states = new Map<
          string,
          {
            lgas: Set<string>;
            activities: number;
            volunteers: number;
          }
        >();

        for (const volunteer of volunteers) {
          if (!volunteer.state) continue;

          if (!states.has(volunteer.state)) {
            states.set(volunteer.state, {
              lgas: new Set(),
              activities: 0,
              volunteers: 0,
            });
          }

          const entry = states.get(volunteer.state)!;

          if (volunteer.lga) {
            entry.lgas.add(volunteer.lga);
          }

          entry.volunteers += 1;
        }

        for (const activity of activities) {
          if (!activity.state) continue;

          if (!states.has(activity.state)) {
            states.set(activity.state, {
              lgas: new Set(),
              activities: 0,
              volunteers: 0,
            });
          }

          states.get(activity.state)!.activities += 1;
        }

        setLocations(
          Array.from(states.entries())
            .map(([state, data]) => ({
              state,
              lgas: data.lgas.size,
              activities: data.activities,
              volunteers: data.volunteers,
            }))
            .sort((a, b) => b.volunteers - a.volunteers),
        );
      } finally {
        setLoading(false);
      }
    }

    loadLocations();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-blue-600"
        >
          ← Dashboard
        </Link>

        <div className="mt-8">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Geographic operations
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Locations
          </h1>

          <p className="mt-2 text-slate-600">
            Monitor activities and volunteers by geographic area.
          </p>
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href="/dashboard/reports"
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
          >
            View Reports →
          </Link>
        </div>

        {loading ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
            Loading locations...
          </div>
        ) : locations.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="font-bold text-slate-950">
              No geographic data yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Volunteer and activity locations will appear here when recorded.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {locations.map((location) => (
              <div
                key={location.state}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold text-slate-950">
                  {location.state}
                </h2>

                <div className="mt-6 space-y-3 text-sm">
                  <p className="flex justify-between">
                    <span className="text-slate-500">LGAs represented</span>
                    <strong>{location.lgas}</strong>
                  </p>

                  <p className="flex justify-between">
                    <span className="text-slate-500">Activities</span>
                    <strong>{location.activities}</strong>
                  </p>

                  <p className="flex justify-between">
                    <span className="text-slate-500">Volunteers</span>
                    <strong>{location.volunteers}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Activity = {
  id: string;
  title: string;
  location: string;
  capacity: number;
  status: string;
  dateTime: string | null;
  _count?: {
    applications: number;
    assignments: number;
  };
};

export default function Opportunities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activities")
      .then((response) => response.json())
      .then((data) => {
        setActivities(
          data.filter(
            (activity: Activity) =>
              activity.status === "RECRUITING" ||
              activity.status === "ACTIVE",
          ),
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link href="/" className="text-sm font-semibold text-blue-600">
          ← Back
        </Link>

        <div className="mt-12">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Available activities
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
            Find an opportunity that fits.
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Browse activities and choose where you would like to contribute.
          </p>
        </div>

        {loading ? (
          <p className="mt-10 text-slate-500">Loading activities...</p>
        ) : activities.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <h2 className="text-xl font-bold text-slate-950">
              No activities available
            </h2>
            <p className="mt-2 text-slate-500">
              New opportunities will appear here when they are created.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {activities.map((activity) => {
              const remaining =
                activity.capacity -
                (activity._count?.applications ?? 0);

              return (
                <div
                  key={activity.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="text-xl font-bold text-slate-950">
                        {activity.title}
                      </h2>

                      <p className="mt-2 text-slate-600">
                        {activity.location}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {activity.dateTime
                          ? new Date(activity.dateTime).toLocaleString()
                          : "Flexible schedule"}{" "}
                        ·{" "}
                        {remaining > 0
                          ? `${remaining} spots remaining`
                          : "Full"}
                      </p>
                    </div>

                    <Link
                      href={`/opportunities/${activity.id}`}
                      className="rounded-xl bg-slate-950 px-5 py-3 text-center font-semibold text-white hover:bg-slate-800"
                    >
                      View Activity
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

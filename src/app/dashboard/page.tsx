"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Report = {
  totalVolunteers: number;
  totalActivities: number;
  totalAssignments: number;
  pendingAssignments: number;
  completedActivities: number;
  pendingVerification: number;
};

type Activity = {
  id: string;
  title: string;
  location: string;
  capacity: number;
  status: string;
  _count?: {
    applications: number;
    assignments: number;
  };
};

export default function Dashboard() {
  const [report, setReport] = useState<Report | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/reports").then((response) => response.json()),
      fetch("/api/activities").then((response) => response.json()),
    ])
      .then(([reportData, activityData]) => {
        setReport(reportData);
        setActivities(
          activityData.filter(
            (activity: Activity) =>
              activity.status === "RECRUITING" ||
              activity.status === "ACTIVE",
          ),
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      label: "Active Volunteers",
      value: report?.totalVolunteers ?? 0,
    },
    {
      label: "Open Activities",
      value: report?.totalActivities ?? 0,
    },
    {
      label: "Pending Assignments",
      value: report?.pendingAssignments ?? 0,
    },
    {
      label: "Completed Activities",
      value: report?.completedActivities ?? 0,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Coordinator dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Campaign Action Hub
            </h1>

            <p className="mt-2 text-slate-600">
              Monitor activities, volunteers, and assignments.
            </p>
          </div>

          <Link
            href="/"
            className="w-fit rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:border-blue-400"
          >
            View Public Site
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">
                {stat.label}
              </p>

              <p className="mt-3 text-3xl font-bold text-slate-950">
                {loading ? "—" : stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Link href="/dashboard/activities" className="rounded-xl border border-slate-200 bg-white p-4 font-semibold text-slate-800 shadow-sm hover:border-blue-400">
            Activities
          </Link>

          <Link href="/dashboard/volunteers" className="rounded-xl border border-slate-200 bg-white p-4 font-semibold text-slate-800 shadow-sm hover:border-blue-400">
            Volunteers
          </Link>

          <Link href="/dashboard/assignments" className="rounded-xl border border-slate-200 bg-white p-4 font-semibold text-slate-800 shadow-sm hover:border-blue-400">
            Assignments
          </Link>

          <Link href="/dashboard/verification" className="rounded-xl border border-slate-200 bg-white p-4 font-semibold text-slate-800 shadow-sm hover:border-blue-400">
            Verification
          </Link>

          <Link href="/dashboard/locations" className="rounded-xl border border-slate-200 bg-white p-4 font-semibold text-slate-800 shadow-sm hover:border-blue-400">
            Locations & Reports
          </Link>
        </div>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-xl font-bold text-slate-950">
              Active activities
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current activities requiring volunteer coordination.
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-8 text-slate-500">
              Loading activities...
            </div>
          ) : activities.length === 0 ? (
            <div className="px-6 py-8 text-slate-500">
              No active activities.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex flex-col justify-between gap-4 px-6 py-5 sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="font-bold text-slate-950">
                      {activity.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {activity.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">
                        {activity._count?.applications ?? 0} /{" "}
                        {activity.capacity}
                      </p>

                      <p className="text-xs text-slate-500">
                        volunteers
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

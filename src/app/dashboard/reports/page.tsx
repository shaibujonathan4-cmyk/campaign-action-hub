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

export default function Reports() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports")
      .then((response) => response.json())
      .then(setReport)
      .finally(() => setLoading(false));
  }, []);

  const completionRate =
    report && report.totalAssignments > 0
      ? Math.round(
          ((report.totalAssignments -
            report.pendingAssignments -
            report.pendingVerification) /
            report.totalAssignments) *
            100,
        )
      : 0;

  const metrics = report
    ? [
        ["Total volunteers", report.totalVolunteers],
        ["Activities created", report.totalActivities],
        ["Assignments made", report.totalAssignments],
        ["Activities completed", report.completedActivities],
        ["Pending verification", report.pendingVerification],
        ["Completion rate", `${Math.max(0, completionRate)}%`],
      ]
    : [];

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
            Operational reporting
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Reports
          </h1>

          <p className="mt-2 text-slate-600">
            Review participation, activity delivery, and verification metrics.
          </p>
        </div>

        {loading ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
            Loading report data...
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {metrics.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-3 text-3xl font-bold text-slate-950">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">
                Reporting principle
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                Reports are generated from recorded volunteer activity,
                assignments, completion updates, and verification records
                rather than manually entered summary numbers.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

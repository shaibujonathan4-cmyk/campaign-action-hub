"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Application = {
  id: string;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
    state: string | null;
    lga: string | null;
    ward: string | null;
  };
  activity: {
    id: string;
    title: string;
    location: string;
    capacity: number;
  };
};

type Assignment = {
  id: string;
  status: string;
  userId: string;
  activityId: string;
};

export default function Assignments() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function loadData() {
    setLoading(true);

    try {
      const [applicationsResponse, assignmentsResponse] = await Promise.all([
        fetch("/api/applications"),
        fetch("/api/assignments"),
      ]);

      setApplications(await applicationsResponse.json());
      setAssignments(await assignmentsResponse.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function assignVolunteer(userId: string, activityId: string) {
    const key = `${userId}-${activityId}`;

    setAssigning(key);
    setMessage("");

    try {
      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          activityId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Unable to create assignment.");
        return;
      }

      setMessage("Volunteer assigned successfully.");
      await loadData();
    } finally {
      setAssigning(null);
    }
  }

  function isAssigned(userId: string, activityId: string) {
    return assignments.some(
      (assignment) =>
        assignment.userId === userId &&
        assignment.activityId === activityId &&
        assignment.status !== "CANCELLED",
    );
  }

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
            Operations
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Assignments
          </h1>

          <p className="mt-2 text-slate-600">
            Review joined volunteers and assign them to activities.
          </p>
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
            {message}
          </div>
        )}

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-950">
              Volunteer applications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Volunteers who have joined activities and are ready for
              coordination.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
              Loading applications...
            </div>
          ) : applications.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h3 className="font-bold text-slate-950">
                No volunteer applications
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Joined volunteers will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => {
                const assigned = isAssigned(
                  application.user.id,
                  application.activity.id,
                );

                const key = `${application.user.id}-${application.activity.id}`;

                return (
                  <div
                    key={application.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                      <div>
                        <h3 className="text-lg font-bold text-slate-950">
                          {application.user.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {application.user.email}
                        </p>

                        <p className="mt-3 font-semibold text-slate-800">
                          {application.activity.title}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {application.activity.location}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {application.user.state || "No state"} ·{" "}
                          {application.user.lga || "No LGA"} ·{" "}
                          {application.user.ward || "No ward"}
                        </p>
                      </div>

                      <div>
                        {assigned ? (
                          <span className="inline-flex rounded-xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-700">
                            Assigned
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              assignVolunteer(
                                application.user.id,
                                application.activity.id,
                              )
                            }
                            disabled={assigning === key}
                            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {assigning === key
                              ? "Assigning..."
                              : "Assign Volunteer"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-950">
              Existing assignments
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {loading ? (
              <p className="text-slate-500">Loading assignments...</p>
            ) : assignments.length === 0 ? (
              <p className="text-slate-500">No assignments yet.</p>
            ) : (
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {assignment.id}
                      </p>
                      <p className="text-xs text-slate-500">
                        Volunteer: {assignment.userId} · Activity:{" "}
                        {assignment.activityId}
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      {assignment.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

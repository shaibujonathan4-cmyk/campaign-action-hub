"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Application = {
  userId: string;
  id: string;
  status: string;
  createdAt: string;
  activity: {
    id: string;
    title: string;
    location: string;
    dateTime: string | null;
    status: string;
  };
};

type Assignment = {
  userId: string;
  id: string;
  status: string;
  assignedAt: string;
  completedAt: string | null;
  activity: {
    id: string;
    title: string;
    location: string;
    dateTime: string | null;
  };
  verification?: {
    status: string;
  } | null;
};

export default function MyActivities() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivities() {
      try {
        const volunteerId = localStorage.getItem(
          "campaign-action-hub-volunteer-id",
        );

        if (!volunteerId) {
          setLoading(false);
          return;
        }

        const volunteerResponse = await fetch(
          `/api/current-volunteer?userId=${encodeURIComponent(volunteerId)}`,
        );

        if (!volunteerResponse.ok) {
          localStorage.removeItem("campaign-action-hub-volunteer-id");
          setLoading(false);
          return;
        }

        const volunteer = await volunteerResponse.json();

        const [applicationsResponse, assignmentsResponse] = await Promise.all([
          fetch("/api/applications"),
          fetch("/api/assignments"),
        ]);

        const allApplications = await applicationsResponse.json();
        const allAssignments = await assignmentsResponse.json();

        setApplications(
          allApplications.filter(
            (application: Application) =>
              application.userId === volunteer.id,
          ),
        );

        setAssignments(
          allAssignments.filter(
            (assignment: Assignment) =>
              assignment.userId === volunteer.id,
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, []);

  function getStatus(activityId: string, applicationStatus: string) {
    const assignment = assignments.find(
      (item) => item.activity.id === activityId,
    );

    if (assignment?.verification?.status === "VERIFIED") {
      return {
        label: "Verified",
        style: "bg-emerald-100 text-emerald-700",
      };
    }

    if (assignment?.status === "COMPLETED") {
      return {
        label: "Completed",
        style: "bg-emerald-100 text-emerald-700",
      };
    }

    if (assignment?.status === "ACTIVE") {
      return {
        label: "Active",
        style: "bg-blue-100 text-blue-700",
      };
    }

    if (assignment?.status === "ASSIGNED") {
      return {
        label: "Assigned",
        style: "bg-violet-100 text-violet-700",
      };
    }

    if (applicationStatus === "JOINED") {
      return {
        label: "Joined",
        style: "bg-blue-100 text-blue-700",
      };
    }

    return {
      label: applicationStatus,
      style: "bg-slate-100 text-slate-600",
    };
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/" className="text-sm font-semibold text-blue-600">
          ← Back home
        </Link>

        <div className="mt-12">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Volunteer dashboard
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
            My Activities
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Track activities you have joined, assignments, and verification.
          </p>
        </div>

        {loading ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
            Loading your activities...
          </div>
        ) : applications.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="font-bold text-slate-950">
              You have not joined an activity yet.
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Browse available opportunities to get started.
            </p>

            <Link
              href="/opportunities"
              className="mt-5 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Browse Opportunities
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {applications.map((application) => {
              const status = getStatus(
                application.activity.id,
                application.status,
              );

              const assignment = assignments.find(
                (item) => item.activity.id === application.activity.id,
              );

              return (
                <div
                  key={application.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="text-xl font-bold text-slate-950">
                        {application.activity.title}
                      </h2>

                      <p className="mt-2 text-slate-600">
                        {application.activity.location}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {application.activity.dateTime
                          ? new Date(
                              application.activity.dateTime,
                            ).toLocaleString()
                          : "Flexible schedule"}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${status.style}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <p className="text-sm font-semibold text-slate-700">
                      {status.label === "Verified"
                        ? "Activity verified"
                        : assignment
                          ? "Assignment status"
                          : "Next step"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {status.label === "Verified"
                        ? "Your completed activity has been verified by a coordinator."
                        : assignment?.status === "ASSIGNED"
                          ? "Your assignment is confirmed. Follow the coordinator's instructions."
                          : assignment?.status === "COMPLETED"
                            ? "Activity completed and awaiting final verification."
                            : "Your participation has been recorded. Wait for coordinator instructions and assignment."}
                    </p>
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

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Activity = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  state: string | null;
  lga: string | null;
  ward: string | null;
  dateTime: string | null;
  capacity: number;
  status: string;
  _count?: {
    applications: number;
    assignments: number;
  };
};

export default function ActivityDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/activities")
      .then((response) => response.json())
      .then((data: Activity[]) => {
        setActivity(data.find((item) => item.id === id) ?? null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-slate-500">Loading activity...</p>
        </div>
      </main>
    );
  }

  async function joinActivity() {
    setJoining(true);
    setMessage("");

    try {
      const volunteerId = localStorage.getItem(
        "campaign-action-hub-volunteer-id",
      );

      if (!volunteerId) {
        setMessage("Please complete the volunteer profile first.");
        return;
      }

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: volunteerId,
          activityId: activity?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Unable to join activity.");
        return;
      }

      setHasJoined(true);
      setMessage("Your participation has been recorded.");
    } finally {
      setJoining(false);
    }
  }

  if (!activity) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/opportunities"
            className="text-sm font-semibold text-blue-600"
          >
            ← Back to opportunities
          </Link>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8">
            <h1 className="text-2xl font-bold text-slate-950">
              Activity not found
            </h1>
          </div>
        </div>
      </main>
    );
  }

  const joined = activity._count?.applications ?? 0;
  const remaining = activity.capacity - joined;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/opportunities"
          className="text-sm font-semibold text-blue-600"
        >
          ← Back to opportunities
        </Link>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Activity
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
            {activity.title}
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            {activity.description ||
              "Contribute your time and skills to this organized activity."}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Location</p>
              <p className="mt-1 font-semibold text-slate-950">
                {activity.location}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Schedule</p>
              <p className="mt-1 font-semibold text-slate-950">
                {activity.dateTime
                  ? new Date(activity.dateTime).toLocaleString()
                  : "Flexible schedule"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Capacity</p>
              <p className="mt-1 font-semibold text-slate-950">
                {activity.capacity} volunteers
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Availability</p>
              <p className="mt-1 font-semibold text-slate-950">
                {remaining > 0
                  ? `${remaining} spots remaining`
                  : "Activity full"}
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <p className="text-sm text-slate-500">
              Status:{" "}
              <span className="font-semibold text-slate-950">
                {activity.status}
              </span>
            </p>

            <button
              onClick={joinActivity}
              disabled={remaining <= 0 || joining || hasJoined}
              className="mt-5 w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {hasJoined
                ? "Activity Joined"
                : joining
                  ? "Joining..."
                  : remaining > 0
                    ? "Join Activity"
                    : "Activity Full"}
            </button>

            {message && (
              <p className="mt-3 text-center text-sm text-slate-600">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

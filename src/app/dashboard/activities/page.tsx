"use client";

import { FormEvent, useEffect, useState } from "react";

type Activity = {
  id: string;
  title: string;
  state: string | null;
  lga: string | null;
  ward: string | null;
  location: string;
  capacity: number;
  status: string;
  _count?: {
    applications: number;
    assignments: number;
  };
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [title, setTitle] = useState("");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [ward, setWard] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("10");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadActivities() {
    const response = await fetch("/api/activities");
    const data = await response.json();
    setActivities(data);
    setLoading(false);
  }

  useEffect(() => {
    loadActivities();
  }, []);

  async function createActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          state,
          lga,
          ward,
          location,
          capacity: Number(capacity),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Unable to create activity.");
        return;
      }

      setTitle("");
      setState("");
      setLga("");
      setWard("");
      setLocation("");
      setCapacity("10");
      setMessage("Activity created successfully.");

      await loadActivities();
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Coordinator
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            Activities
          </h1>

          <p className="mt-3 text-slate-600">
            Create and manage activities using recorded database data.
          </p>
        </div>

        <form
          onSubmit={createActivity}
          className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-slate-950">
            Create activity
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Activity title"
              required
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              value={state}
              onChange={(event) => setState(event.target.value)}
              placeholder="State"
              required
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              value={lga}
              onChange={(event) => setLga(event.target.value)}
              placeholder="LGA"
              required
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              value={ward}
              onChange={(event) => setWard(event.target.value)}
              placeholder="Ward"
              required
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Specific location / venue"
              required
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              value={capacity}
              onChange={(event) => setCapacity(event.target.value)}
              type="number"
              min="1"
              placeholder="Capacity"
              required
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-5 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Activity"}
          </button>

          {message && (
            <p className="mt-4 text-sm font-medium text-slate-600">
              {message}
            </p>
          )}
        </form>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-950">
            Recorded activities
          </h2>

          {loading ? (
            <p className="mt-5 text-slate-500">Loading activities...</p>
          ) : activities.length === 0 ? (
            <p className="mt-5 text-slate-500">
              No activities have been created yet.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">
                        {activity.title}
                      </h3>

                      <p className="mt-1 text-slate-600">
                        {activity.location}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {activity.state} · {activity.lga} · {activity.ward}
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        Capacity: {activity.capacity} · Status:{" "}
                        {activity.status}
                      </p>
                    </div>

                    <div className="text-sm text-slate-500">
                      {activity._count?.applications ?? 0} joined ·{" "}
                      {activity._count?.assignments ?? 0} assigned
                    </div>
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

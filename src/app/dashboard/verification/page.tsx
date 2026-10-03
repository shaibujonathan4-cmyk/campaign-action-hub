"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Verification = {
  id: string;
  status: string;
  notes: string | null;
  submittedAt: string;
  assignment: {
    id: string;
    status: string;
    user: {
      name: string;
      email: string;
    };
    activity: {
      title: string;
      location: string;
    };
  };
};

export default function Verification() {
  const [records, setRecords] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function loadRecords() {
    setLoading(true);

    try {
      const response = await fetch("/api/verification");
      setRecords(await response.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  async function verify(id: string, status: "VERIFIED" | "REJECTED") {
    setProcessing(id);
    setMessage("");

    try {
      const response = await fetch("/api/verification", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Unable to update verification.");
        return;
      }

      setMessage(
        status === "VERIFIED"
          ? "Activity verified successfully."
          : "Verification rejected.",
      );

      await loadRecords();
    } finally {
      setProcessing(null);
    }
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
            Activity verification
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Verification
          </h1>

          <p className="mt-2 text-slate-600">
            Review volunteer completion updates and verify completed
            activities.
          </p>
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
            {message}
          </div>
        )}

        <div className="mt-8 space-y-4">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
              Loading verification records...
            </div>
          ) : records.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="font-bold text-slate-950">
                No verification records
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Completed activities submitted for review will appear here.
              </p>
            </div>
          ) : (
            records.map((record) => {
              const pending = record.status === "PENDING";

              return (
                <div
                  key={record.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                    <div>
                      <h2 className="font-bold text-slate-950">
                        {record.assignment.user.name}
                      </h2>

                      <p className="mt-1 text-slate-700">
                        {record.assignment.activity.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {record.assignment.activity.location}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        Submitted{" "}
                        {new Date(record.submittedAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          record.status === "VERIFIED"
                            ? "bg-emerald-100 text-emerald-700"
                            : record.status === "REJECTED"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {record.status}
                      </span>

                      {pending && (
                        <>
                          <button
                            onClick={() => verify(record.id, "VERIFIED")}
                            disabled={processing === record.id}
                            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60"
                          >
                            {processing === record.id
                              ? "Updating..."
                              : "Verify"}
                          </button>

                          <button
                            onClick={() => verify(record.id, "REJECTED")}
                            disabled={processing === record.id}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-red-300 hover:text-red-600 disabled:opacity-60"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}

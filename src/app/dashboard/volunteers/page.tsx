"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Volunteer = {
  id: string;
  name: string;
  email: string;
  state: string | null;
  lga: string | null;
  ward: string | null;
  skills: {
    skill: {
      name: string;
    };
  }[];
  applications: {
    status: string;
    activity: {
      title: string;
    };
  }[];
  assignments: {
    status: string;
    activity: {
      title: string;
    };
  }[];
};

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/volunteers")
      .then((response) => response.json())
      .then(setVolunteers)
      .finally(() => setLoading(false));
  }, []);

  function getStatus(volunteer: Volunteer) {
    const assignment = volunteer.assignments[0];

    if (assignment?.status === "COMPLETED") return "Completed";
    if (assignment?.status === "ACTIVE") return "Active";
    if (assignment?.status === "ASSIGNED") return "Assigned";
    if (assignment?.status === "PENDING") return "Pending";

    if (volunteer.applications.length > 0) return "Joined";

    return "Available";
  }

  function getStatusStyle(status: string) {
    if (status === "Completed") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status === "Active" || status === "Assigned") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Joined" || status === "Pending") {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-slate-100 text-slate-600";
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
            Volunteer management
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Volunteers
          </h1>

          <p className="mt-2 text-slate-600">
            View volunteer profiles, skills, locations, and activity status.
          </p>
        </div>

        {loading ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
            Loading volunteers...
          </div>
        ) : volunteers.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="font-bold text-slate-950">
              No volunteers registered
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Volunteers will appear here when they join the system.
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden border-b border-slate-100 bg-slate-50 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 md:grid md:grid-cols-5 md:gap-4">
              <span>Volunteer</span>
              <span>Location</span>
              <span>Skills</span>
              <span>Activity</span>
              <span>Status</span>
            </div>

            <div className="divide-y divide-slate-100">
              {volunteers.map((volunteer) => {
                const status = getStatus(volunteer);

                const assignment = volunteer.assignments[0];
                const application = volunteer.applications[0];

                const activity =
                  assignment?.activity.title ||
                  application?.activity.title ||
                  "No activity yet";

                const location = [
                  volunteer.lga,
                  volunteer.ward,
                ]
                  .filter(Boolean)
                  .join(" · ");

                const skills = volunteer.skills
                  .map((item) => item.skill.name)
                  .join(" · ");

                return (
                  <div
                    key={volunteer.id}
                    className="grid gap-4 px-6 py-5 md:grid-cols-5 md:items-center"
                  >
                    <div>
                      <p className="font-bold text-slate-950">
                        {volunteer.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {volunteer.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-700">
                        {location || volunteer.state || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-700">
                        {skills || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {activity}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                          status,
                        )}`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

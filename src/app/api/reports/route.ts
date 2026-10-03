import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [
    totalVolunteers,
    totalActivities,
    totalAssignments,
    pendingAssignments,
    completedActivities,
    pendingVerification,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "VOLUNTEER" } }),
    prisma.activity.count(),
    prisma.assignment.count(),
    prisma.assignment.count({ where: { status: "PENDING" } }),
    prisma.activity.count({ where: { status: "COMPLETED" } }),
    prisma.verification.count({ where: { status: "PENDING" } }),
  ]);

  return NextResponse.json({
    totalVolunteers,
    totalActivities,
    totalAssignments,
    pendingAssignments,
    completedActivities,
    pendingVerification,
  });
}

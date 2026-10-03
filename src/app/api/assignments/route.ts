import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const assignments = await prisma.assignment.findMany({
    include: {
      user: true,
      activity: true,
      verification: true,
    },
    orderBy: { assignedAt: "desc" },
  });

  return NextResponse.json(assignments);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.userId || !body.activityId) {
    return NextResponse.json(
      { error: "userId and activityId are required" },
      { status: 400 },
    );
  }

  const existing = await prisma.assignment.findFirst({
    where: {
      userId: body.userId,
      activityId: body.activityId,
      status: {
        not: "CANCELLED",
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Volunteer is already assigned to this activity" },
      { status: 409 },
    );
  }

  const assignment = await prisma.assignment.create({
    data: {
      userId: body.userId,
      activityId: body.activityId,
      status: "ASSIGNED",
    },
    include: {
      user: true,
      activity: true,
    },
  });

  return NextResponse.json(assignment, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  if (!body.assignmentId || !body.status) {
    return NextResponse.json(
      { error: "assignmentId and status are required" },
      { status: 400 },
    );
  }

  const allowedStatuses = [
    "PENDING",
    "ASSIGNED",
    "ACTIVE",
    "COMPLETED",
    "CANCELLED",
  ];

  if (!allowedStatuses.includes(body.status)) {
    return NextResponse.json(
      { error: "Invalid assignment status" },
      { status: 400 },
    );
  }

  const assignment = await prisma.assignment.update({
    where: {
      id: body.assignmentId,
    },
    data: {
      status: body.status,
      completedAt:
        body.status === "COMPLETED" ? new Date() : null,
    },
    include: {
      user: true,
      activity: true,
    },
  });

  return NextResponse.json(assignment);
}

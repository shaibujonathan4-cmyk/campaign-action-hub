import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const records = await prisma.verification.findMany({
    include: {
      assignment: {
        include: {
          user: true,
          activity: true,
        },
      },
      verifiedBy: true,
    },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json(records);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.assignmentId || !body.activityId) {
    return NextResponse.json(
      { error: "assignmentId and activityId are required" },
      { status: 400 },
    );
  }

  const existing = await prisma.verification.findUnique({
    where: {
      assignmentId: body.assignmentId,
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Verification record already exists" },
      { status: 409 },
    );
  }

  const record = await prisma.verification.create({
    data: {
      assignmentId: body.assignmentId,
      activityId: body.activityId,
      status: "PENDING",
      notes: body.notes ?? null,
    },
  });

  return NextResponse.json(record, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  if (!body.id || !body.status) {
    return NextResponse.json(
      { error: "id and status are required" },
      { status: 400 },
    );
  }

  if (!["VERIFIED", "REJECTED"].includes(body.status)) {
    return NextResponse.json(
      { error: "Invalid verification status" },
      { status: 400 },
    );
  }

  const record = await prisma.verification.update({
    where: {
      id: body.id,
    },
    data: {
      status: body.status,
      verifiedAt: new Date(),
      notes: body.notes ?? undefined,
    },
  });

  if (body.status === "VERIFIED") {
    await prisma.assignment.update({
      where: {
        id: record.assignmentId,
      },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });
  }

  return NextResponse.json(record);
}

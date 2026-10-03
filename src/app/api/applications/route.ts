import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const applications = await prisma.application.findMany({
    include: {
      user: true,
      activity: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(applications);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.userId || !body.activityId) {
    return NextResponse.json(
      { error: "userId and activityId are required" },
      { status: 400 },
    );
  }

  const existing = await prisma.application.findUnique({
    where: {
      userId_activityId: {
        userId: body.userId,
        activityId: body.activityId,
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Volunteer has already joined this activity" },
      { status: 409 },
    );
  }

  const application = await prisma.application.create({
    data: {
      userId: body.userId,
      activityId: body.activityId,
      status: "JOINED",
    },
    include: {
      user: true,
      activity: true,
    },
  });

  return NextResponse.json(application, { status: 201 });
}

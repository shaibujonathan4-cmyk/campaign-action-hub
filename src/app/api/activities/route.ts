import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const activities = await prisma.activity.findMany({
    include: {
      coordinator: true,
      _count: {
        select: {
          applications: true,
          assignments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(activities);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (
    !body.title ||
    !body.location ||
    !body.state ||
    !body.lga ||
    !body.ward ||
    !body.capacity
  ) {
    return NextResponse.json(
      { error: "Title, location, state, LGA, ward, and capacity are required." },
      { status: 400 },
    );
  }

  const capacity = Number(body.capacity);

  if (!Number.isInteger(capacity) || capacity < 1) {
    return NextResponse.json(
      { error: "Capacity must be a positive whole number." },
      { status: 400 },
    );
  }

  const activity = await prisma.activity.create({
    data: {
      title: body.title,
      description: body.description ?? null,
      location: body.location,
      state: body.state,
      lga: body.lga,
      ward: body.ward,
      dateTime: body.dateTime ? new Date(body.dateTime) : null,
      capacity,
      status: "RECRUITING",
    },
  });

  return NextResponse.json(activity, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  if (!body.id) {
    return NextResponse.json(
      { error: "Activity id is required." },
      { status: 400 },
    );
  }

  const activity = await prisma.activity.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title ?? undefined,
      description: body.description ?? undefined,
      location: body.location ?? undefined,
      state: body.state ?? undefined,
      lga: body.lga ?? undefined,
      ward: body.ward ?? undefined,
      dateTime: body.dateTime
        ? new Date(body.dateTime)
        : undefined,
      capacity:
        body.capacity !== undefined
          ? Number(body.capacity)
          : undefined,
      status: body.status ?? undefined,
    },
  });

  return NextResponse.json(activity);
}

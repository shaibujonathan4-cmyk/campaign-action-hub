import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const volunteers = await prisma.user.findMany({
    where: { role: "VOLUNTEER" },
    include: {
      skills: {
        include: { skill: true },
      },
      applications: {
        include: { activity: true },
      },
      assignments: {
        include: { activity: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(volunteers);
}

export async function POST(request: Request) {
  const body = await request.json();

  const volunteer = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone ?? null,
      role: "VOLUNTEER",
      state: body.state ?? null,
      lga: body.lga ?? null,
      ward: body.ward ?? null,
      availability: body.availability ?? null,
    },
  });

  return NextResponse.json(volunteer, { status: 201 });
}

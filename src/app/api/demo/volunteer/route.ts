import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const email = "demo.volunteer@campaign-action-hub.local";

  const volunteer = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Demo Volunteer",
      email,
      role: "VOLUNTEER",
      state: "Kaduna",
      lga: "Chikun",
      ward: "Ward 4",
      availability: "Weekends",
    },
  });

  return NextResponse.json(volunteer);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (
    !body.name ||
    !body.email ||
    !body.state ||
    !body.lga ||
    !body.ward ||
    !body.availability ||
    !body.skills?.length
  ) {
    return NextResponse.json(
      {
        error:
          "Name, email, location, availability, and at least one skill are required.",
      },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (existing) {
    return NextResponse.json(existing);
  }

  const volunteer = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone ?? null,
      role: "VOLUNTEER",
      state: body.state,
      lga: body.lga,
      ward: body.ward,
      availability: body.availability,
    },
  });

  for (const skillName of body.skills) {
    const skill = await prisma.skill.upsert({
      where: {
        name: skillName,
      },
      update: {},
      create: {
        name: skillName,
      },
    });

    await prisma.userSkill.create({
      data: {
        userId: volunteer.id,
        skillId: skill.id,
      },
    });
  }

  return NextResponse.json(volunteer, { status: 201 });
}

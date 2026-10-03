import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const userId = new URL(request.url).searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId is required" },
      { status: 400 },
    );
  }

  const volunteer = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
    },
  });

  if (!volunteer || volunteer.role !== "VOLUNTEER") {
    return NextResponse.json(
      { error: "Volunteer not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(volunteer);
}

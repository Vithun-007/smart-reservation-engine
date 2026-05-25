import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {

  try {

    const { id } =
      await context.params;

    console.log("CONFIRM ID:", id);

    const reservation =
      await prisma.reservation.findUnique({
        where: { id },
      });

    console.log(
      "FOUND RESERVATION:",
      reservation
    );

    if (!reservation) {

      return NextResponse.json(
        {
          error:
            "Reservation not found",
        },
        {
          status: 404,
        }
      );
    }

    if (
      reservation.status !==
      "PENDING"
    ) {

      return NextResponse.json(
        {
          error:
            "Reservation already processed",
        },
        {
          status: 400,
        }
      );
    }

    if (
      reservation.expiresAt <
      new Date()
    ) {

      return NextResponse.json(
        {
          error:
            "Reservation expired",
        },
        {
          status: 410,
        }
      );
    }

    await prisma.inventory.update({
      where: {
        id:
          reservation.inventoryId,
      },
      data: {
        totalStock: {
          decrement:
            reservation.quantity,
        },
        reservedStock: {
          decrement:
            reservation.quantity,
        },
      },
    });

    await prisma.reservation.update({
      where: {
        id:
          reservation.id,
      },
      data: {
        status:
          "CONFIRMED",
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Confirm failed",
      },
      {
        status: 500,
      }
    );
  }
}
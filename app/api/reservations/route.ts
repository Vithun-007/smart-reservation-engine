import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  const body = await req.json();

  const { productId, quantity } = body;

  try {

    const reservation =
      await prisma.$transaction(
        async (tx) => {

          const inventories =
            await tx.inventory.findMany({
              where: {
                productId,
              },

              include: {
                warehouse: true,
              },

              orderBy: {
                totalStock: "desc",
              },
            });

          const inventory =
            inventories.find(
              (inv) =>
                inv.totalStock -
                  inv.reservedStock >=
                quantity
            );

          if (!inventory) {

            return NextResponse.json(
              {
                error:
                  "Not enough stock available",
              },
              {
                status: 409,
              }
            );
          }

          await tx.$queryRaw`
            SELECT * FROM "Inventory"
            WHERE id = ${inventory.id}
            FOR UPDATE
          `;

          const latestInventory =
            await tx.inventory.findUnique({
              where: {
                id: inventory.id,
              },
            });

          if (
            !latestInventory ||
            latestInventory.totalStock -
              latestInventory.reservedStock <
              quantity
          ) {

            return NextResponse.json(
              {
                error:
                  "Stock conflict detected",
              },
              {
                status: 409,
              }
            );
          }

          await tx.inventory.update({
            where: {
              id: inventory.id,
            },

            data: {
              reservedStock: {
                increment: quantity,
              },
            },
          });

          const newReservation =
            await tx.reservation.create({
              data: {
                inventoryId:
                  inventory.id,

                quantity,

                status: "PENDING",

                expiresAt:
                  new Date(
                    Date.now() +
                      10 *
                        60 *
                        1000
                  ),
              },
            });

          return {
            ...newReservation,
            warehouse:
              inventory.warehouse.name,
          };
        }
      );

    return NextResponse.json(
      reservation
    );

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Reservation failed",
      },
      {
        status: 500,
      }
    );
  }
}
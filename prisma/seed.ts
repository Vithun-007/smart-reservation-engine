import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  const warehouse1 =
    await prisma.warehouse.create({
      data: {
        name: "Chennai Warehouse",
        city: "Chennai",
      },
    });

  const warehouse2 =
    await prisma.warehouse.create({
      data: {
        name: "Bangalore Warehouse",
        city: "Bangalore",
      },
    });

  const warehouse3 =
    await prisma.warehouse.create({
      data: {
        name: "Mumbai Warehouse",
        city: "Mumbai",
      },
    });

  const products = await prisma.product.createMany({
    data: [
      {
        name: "iPhone 16 Pro",
        price: 129999,
      },
      {
        name: "MacBook Pro M4",
        price: 249999,
      },
      {
        name: "AirPods Pro",
        price: 24999,
      },
      {
        name: "Samsung S25 Ultra",
        price: 119999,
      },
      {
        name: "Playstation 5",
        price: 54999,
      },
      {
        name: "iPad Air M3",
        price: 69999,
      },
    ],
  });

  const allProducts =
    await prisma.product.findMany();

  for (const product of allProducts) {

    await prisma.inventory.createMany({
      data: [
        {
          productId: product.id,
          warehouseId: warehouse1.id,
          totalStock: Math.floor(Math.random() * 15) + 5,
        },
        {
          productId: product.id,
          warehouseId: warehouse2.id,
          totalStock: Math.floor(Math.random() * 15) + 5,
        },
        {
          productId: product.id,
          warehouseId: warehouse3.id,
          totalStock: Math.floor(Math.random() * 15) + 5,
        },
      ],
    });
  }

  console.log("Database Seeded");
}

main();
"use client";

import {
  Search,
  Package,
  AlertTriangle,
  Warehouse,
  Activity,
} from "lucide-react";

import { toast } from "sonner";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

const productImages: any = {
  "iPhone 16 Pro":
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569",

  "MacBook Pro M4":
    "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",

  "AirPods Pro":
    "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f37",

  "Samsung S25 Ultra":
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",

  "Playstation 5":
    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",

  "iPad Air M3":
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
};

export default function Home() {

  const [products, setProducts] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  async function fetchProducts() {

    const res = await fetch(
      "/api/products"
    );

    const data = await res.json();

    setProducts(data);

    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function reserve(
    productId: string
  ) {

    try {

      const res = await fetch(
        "/api/reservations",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            productId,
            quantity: 1,
          }),
        }
      );

      const data =
        await res.json();

      console.log(
        "NEW RESERVATION:",
        data
      );

      if (res.ok) {

        toast.success(
          "Inventory Reserved Successfully"
        );

        window.location.href =
          `/reservation/${data.id}`;

      } else {

        toast.error(
          data.error ||
            "Reservation failed"
        );
      }

    } catch (error) {

      console.log(error);

      toast.error(
        "Reservation failed"
      );
    }
  }

  const filteredProducts =
    useMemo(() => {

      return products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [products, search]);

  const totalInventory =
    products.reduce(
      (acc, product) =>
        acc +
        product.inventories.reduce(
          (
            sum: number,
            inv: any
          ) =>
            sum +
            inv.totalStock,
          0
        ),
      0
    );

  const reservedUnits =
    products.reduce(
      (acc, product) =>
        acc +
        product.inventories.reduce(
          (
            sum: number,
            inv: any
          ) =>
            sum +
            inv.reservedStock,
          0
        ),
      0
    );

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="border-b border-slate-800 bg-slate-950 sticky top-0 z-50 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold">
              Smart Inventory Engine
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              Distributed Reservation Platform
            </p>

          </div>

          <div className="flex items-center gap-3 bg-green-500/20 border border-green-500 px-4 py-2 rounded-xl">

            <Activity size={18} />

            <span className="text-green-400">
              System Operational
            </span>

          </div>

        </div>

      </div>

      <div className="max-w-7xl mx-auto p-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

            <Package className="mb-4" />

            <p className="text-slate-400">
              Products
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {products.length}
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

            <Warehouse className="mb-4" />

            <p className="text-slate-400">
              Warehouses
            </p>

            <h2 className="text-4xl font-bold mt-2">
              3
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

            <Package className="mb-4" />

            <p className="text-slate-400">
              Total Inventory
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {totalInventory}
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

            <AlertTriangle className="mb-4 text-orange-400" />

            <p className="text-slate-400">
              Reserved Units
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {reservedUnits}
            </h2>

          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-10 flex items-center gap-4">

          <Search className="text-slate-400" />

          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="bg-transparent outline-none w-full text-lg"
          />

        </div>

        {loading ? (

          <div className="text-center text-2xl py-20">
            Loading Inventory...
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {filteredProducts.map(
              (product) => {

                const totalAvailable =
                  product.inventories.reduce(
                    (
                      acc: number,
                      inv: any
                    ) =>
                      acc +
                      (
                        inv.totalStock -
                        inv.reservedStock
                      ),
                    0
                  );

                const lowStock =
                  totalAvailable < 8;

                return (
                  <div
                    key={
                      product.id
                    }
                    className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500 transition-all duration-300 hover:scale-[1.02]"
                  >

                    <img
                      src={
                        productImages[
                          product.name
                        ]
                      }
                      className="h-56 w-full object-cover"
                    />

                    <div className="p-6">

                      <div className="flex justify-between items-start">

                        <div>

                          <h2 className="text-2xl font-bold">
                            {
                              product.name
                            }
                          </h2>

                          <p className="text-slate-400 mt-2">
                            ₹
                            {product.price.toLocaleString()}
                          </p>

                        </div>

                        {lowStock && (

                          <div className="bg-orange-500/20 border border-orange-500 text-orange-400 px-3 py-1 rounded-lg text-sm">
                            Low Stock
                          </div>

                        )}

                      </div>

                      <div className="mt-6 space-y-3">

                        <div className="flex justify-between">

                          <span className="text-slate-400">
                            Available
                          </span>

                          <span>
                            {
                              totalAvailable
                            }
                          </span>

                        </div>

                        <div className="flex justify-between">

                          <span className="text-slate-400">
                            Warehouses
                          </span>

                          <span>
                            {
                              product.inventories
                                .length
                            }
                          </span>

                        </div>

                        <div className="flex justify-between">

                          <span className="text-slate-400">
                            Reserved
                          </span>

                          <span>
                            {product.inventories.reduce(
                              (
                                acc: number,
                                inv: any
                              ) =>
                                acc +
                                inv.reservedStock,
                              0
                            )}
                          </span>

                        </div>

                      </div>

                      <div className="mt-6">

                        <h3 className="text-sm text-slate-400 mb-3">
                          Warehouse Distribution
                        </h3>

                        <div className="space-y-2">

                          {product.inventories.map(
                            (
                              inv: any
                            ) => (

                              <div
                                key={
                                  inv.id
                                }
                                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 flex justify-between text-sm"
                              >

                                <span>
                                  {
                                    inv
                                      .warehouse
                                      .name
                                  }
                                </span>

                                <span>
                                  {
                                    inv.totalStock -
                                    inv.reservedStock
                                  }
                                </span>

                              </div>
                            )
                          )}

                        </div>

                      </div>

                      <button
                        onClick={() =>
                          reserve(
                            product.id
                          )
                        }
                        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 py-4 rounded-2xl font-semibold"
                      >
                        Reserve Inventory
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        )}

      </div>

    </main>
  );
}
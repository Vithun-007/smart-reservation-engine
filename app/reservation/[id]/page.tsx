"use client";

import { use, useEffect, useState } from "react";

export default function ReservationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = use(params);

  const [timeLeft, setTimeLeft] =
    useState(600);

  const [status, setStatus] =
    useState("ACTIVE");

  useEffect(() => {

    const interval = setInterval(() => {

      setTimeLeft((prev) => {

        if (prev <= 1) {

          clearInterval(interval);

          setStatus("EXPIRED");

          return 0;
        }

        return prev - 1;
      });

    }, 1000);

    return () => clearInterval(interval);

  }, []);

  async function confirmReservation() {

    if (status !== "ACTIVE") return;

    const res = await fetch(
      `/api/reservations/${id}/confirm`,
      {
        method: "POST",
      }
    );

    const data = await res.json();

    if (res.ok) {

      setStatus("CONFIRMED");

    } else {

      alert(data.error);
    }
  }

  async function cancelReservation() {

    if (status !== "ACTIVE") return;

    const res = await fetch(
      `/api/reservations/${id}/release`,
      {
        method: "POST",
      }
    );

    const data = await res.json();

    if (res.ok) {

      setStatus("CANCELLED");

    } else {

      alert(data.error);
    }
  }

  const minutes =
    Math.floor(timeLeft / 60);

  const seconds =
    timeLeft % 60;

  const progress =
    (timeLeft / 600) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-8">

      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-5xl font-bold">
              Reservation Checkout
            </h1>

            <p className="text-slate-400 mt-3">
              Secure Distributed Inventory Hold
            </p>

          </div>

          <div
            className={`px-4 py-2 rounded-xl border ${
              status === "CONFIRMED"
                ? "bg-green-500/20 text-green-400 border-green-500"
                : status === "CANCELLED"
                ? "bg-red-500/20 text-red-400 border-red-500"
                : status === "EXPIRED"
                ? "bg-orange-500/20 text-orange-400 border-orange-500"
                : "bg-blue-500/20 text-blue-400 border-blue-500"
            }`}
          >
            {status}
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8">

            <h2 className="text-2xl font-bold mb-8">
              Reservation Details
            </h2>

            <div className="space-y-6">

              <div className="flex justify-between border-b border-slate-800 pb-4">

                <span className="text-slate-400">
                  Reservation ID
                </span>

                <span className="font-mono text-sm">
                  {id}
                </span>

              </div>

              <div className="flex justify-between border-b border-slate-800 pb-4">

                <span className="text-slate-400">
                  Inventory Allocation
                </span>

                <span>
                  Chennai Warehouse
                </span>

              </div>

              <div className="flex justify-between border-b border-slate-800 pb-4">

                <span className="text-slate-400">
                  Reservation Type
                </span>

                <span>
                  Distributed Lock
                </span>

              </div>

              <div className="flex justify-between border-b border-slate-800 pb-4">

                <span className="text-slate-400">
                  Status
                </span>

                <span>
                  {status}
                </span>

              </div>

            </div>

            <div className="mt-10">

              <h3 className="text-xl font-bold mb-4">
                Reservation Timer
              </h3>

              <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">

                <div
                  className="h-full bg-blue-500 transition-all duration-1000"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

              <p className="mt-4 text-3xl font-bold">

                {minutes}
                :
                {seconds
                  .toString()
                  .padStart(2, "0")}

              </p>

            </div>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

            <h2 className="text-2xl font-bold mb-6">
              Actions
            </h2>

            <div className="space-y-4">

              {status === "ACTIVE" && (

                <>
                  <button
                    onClick={confirmReservation}
                    className="w-full bg-green-600 hover:bg-green-700 py-4 rounded-2xl font-semibold transition-all duration-300"
                  >
                    Confirm Reservation
                  </button>

                  <button
                    onClick={cancelReservation}
                    className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-2xl font-semibold transition-all duration-300"
                  >
                    Release Inventory
                  </button>
                </>

              )}

              {status === "CONFIRMED" && (

                <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-2xl text-center">
                  Reservation Successfully Confirmed
                </div>

              )}

              {status === "CANCELLED" && (

                <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-2xl text-center">
                  Inventory Released Successfully
                </div>

              )}

              {status === "EXPIRED" && (

                <div className="bg-orange-500/20 border border-orange-500 text-orange-400 p-4 rounded-2xl text-center">
                  Reservation Expired
                </div>

              )}

            </div>

            <div className="mt-10 bg-slate-950 rounded-2xl p-5 border border-slate-800">

              <h3 className="font-bold mb-4">
                System Insights
              </h3>

              <div className="space-y-3 text-sm text-slate-400">

                <p>
                  • Distributed lock acquired
                </p>

                <p>
                  • Inventory hold active
                </p>

                <p>
                  • Concurrent safe reservation
                </p>

                <p>
                  • Auto-expiry enabled
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
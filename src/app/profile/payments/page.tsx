'use client';

export default function PaymentsPage() {
  return (
    <div className="container mx-auto py-16 max-w-2xl space-y-8">

      <h1 className="text-2xl font-bold">
        Escrow Payment Settings
      </h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">

        <div className="flex justify-between">
          <span>FameSwap Balance</span>
          <span className="font-semibold text-green-600">
            125.50 AZN
          </span>
        </div>

        <div className="border-t pt-4 space-y-4">

          <div className="flex justify-between items-center">
            <span>PayPal</span>
            <button className="text-blue-600 font-semibold">
              Update
            </button>
          </div>

          <div className="flex justify-between items-center">
            <span>Bank Transfer (Wise)</span>
            <button className="text-blue-600 font-semibold">
              Add
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
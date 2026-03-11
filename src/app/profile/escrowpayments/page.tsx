'use client'

import { useState } from 'react'
import { appConfig } from '../../../consts'
import { useAuth } from '../../../context/AuthContext'

export default function PaymentsPage() {
  const [method, setMethod] = useState("PAYPAL")
  const [paypalEmail, setPaypalEmail] = useState("")
  const [bankDetails, setBankDetails] = useState("")
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {

    setLoading(true)

    const {token} = useAuth()

    const data = {
      method,
      paypalEmail,
      bankDetails
    }

    try {

      const res = await fetch(`${appConfig.api_url}/pay-profile/payment-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      const result = await res.json()

      if (res.ok) {
        alert("Payment profile updated successfully")
      } else {
        alert(result.message || "Something went wrong")
      }

    } catch (error) {
      console.error(error)
      alert("Server error")
    }

    setLoading(false)
  }

  return (
    <div className="container mx-auto py-16 max-w-3xl">

      <h1 className="text-2xl font-bold mb-8">
        Escrow Payment Profiles
      </h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">

        <div className="space-y-3">

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="BALANCE"
              checked={method === "BALANCE"}
              onChange={() => setMethod("BALANCE")}
            />
            ACCOUNTmarket Balance
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="PAYPAL"
              checked={method === "PAYPAL"}
              onChange={() => setMethod("PAYPAL")}
            />
            Paypal
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="BANK"
              checked={method === "BANK"}
              onChange={() => setMethod("BANK")}
            />
            Bank Transfer (Sent by Wise.com)
          </label>

        </div>

        {method === "PAYPAL" && (
          <div className="space-y-2">
            <label className="font-medium">Paypal Email</label>

            <input
              type="email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        )}

        {method === "BANK" && (
          <div className="space-y-3">

            <div className="flex items-center gap-3">
              <span className="font-medium">Bank Account Details</span>

              <a href="#" className="text-blue-600 text-sm">
                More Info
              </a>
            </div>

            <p className="text-sm text-gray-600">
              Wise.com account email OR
              <br />
              US: (Routing, Account number, First Name, Last Name & Full Address with postal code)
              <br />
              Non-US: (IBAN, BIC, SWIFT, Account number, IFSC, First Name, Last Name & Full Address with postal code)
            </p>

            <textarea
              value={bankDetails}
              onChange={(e) => setBankDetails(e.target.value)}
              className="w-full border rounded-lg p-3"
              rows={5}
              placeholder="Enter your Wise email or bank details..."
            />

          </div>
        )}

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Update"}
        </button>

      </div>

    </div>
  )
}
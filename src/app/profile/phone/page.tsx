'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";

export default function PhonePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.phone) {
      setPhone(user.phone);
    }
  }, [user]);

  const phoneRegex = /^\+994(50|51|55|70|77|10)\d{7}$/;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^[0-9+]*$/.test(value)) {
      setPhone(value);
    }
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      setOtp(value);
    }
  };

  const handleSendOTP = async () => {

    if (!phoneRegex.test(phone)) {
      setMessage("Telefon nömrəsini düzgün daxil edin. Məs: +994501234567");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await api.post("/users/sent-otp", {
        newPhone: phone,
      });

      setStep("otp");
      setMessage("Verification code sent successfully.");

    } catch (err: any) {
      setMessage(
        err?.response?.data?.message || "Failed to send verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {

    if (!/^\d{6}$/.test(otp)) {
      setMessage("OTP code must be 6 digits.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await api.post("/users/verify-phone", {
        code: otp,
      });

      await refreshUser();

      setMessage("Phone verified successfully!");

      setTimeout(() => {
        router.push("/profile");
      }, 1500);

    } catch (err: any) {
      setMessage(
        err?.response?.data?.message || "Invalid or expired code."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md space-y-6">

        <h1 className="text-2xl font-bold text-center">
          Verify your mobile phone number
        </h1>

        {step === "phone" && (
          <>
            <input
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+994501234567"
              maxLength={13}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <input
              value={otp}
              onChange={handleOTPChange}
              placeholder="Enter OTP code"
              maxLength={6}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              {loading ? "Verifying..." : "Verify Phone"}
            </button>
          </>
        )}

        {message && (
          <p className="text-center text-sm text-red-500">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}
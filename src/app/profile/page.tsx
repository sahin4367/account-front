'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";

export default function ProfilePage() {
  const { isAuthenticated, loading, user, logout, refreshUser } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    isVerifiedPhone: false,
  });

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        isVerifiedPhone: user.isVerifiedPhone || false,
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Yüklənir...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.push("/login");
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleUpdate = async () => {

    if (form.phone !== user.phone) {
      alert("Telefon nömrəsini dəyişmək üçün əvvəlcə verify etməlisiniz.");
      router.push("/profile/phone");
      return;
    }

    try {
      await api.put(`/users/update/${user.id}`, {
        username: form.username,
        address: form.address,
      });

      alert("User updated successfully!");

      await refreshUser();

    } catch (error: any) {
      alert(error?.response?.data?.message || "Update failed");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm("Hesabı silmək istədiyinizə əminsiniz?");
    if (!confirmDelete) return;

    try {

      await api.delete(`/users/delete/${user.id}`);

      alert("Account deleted successfully");

      logout();
      router.push("/");

    } catch (error: any) {
      alert(error?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <div className="w-64 bg-white shadow-md p-6 space-y-4">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
            {user.username?.charAt(0).toUpperCase()}
          </div>
        </div>

        <button className="w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg">
          Account Details
        </button>

        <button
          onClick={() => router.push("/profile/phone")}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
        >
          Phone Verify  
        </button>

        <button
        onClick={() => router.push("/profile/escrowpayments")}
        className="w-full text-left px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
        >
        Payment Profiles
        </button>

        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
        >
          Logout
        </button>
        
      </div>

      <div className="flex-1 p-12">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        <div className="bg-white p-8 rounded-2xl shadow space-y-6 max-w-2xl">

          <div>
            <label className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email address
            </label>
            <input
              name="email"
              value={form.email}
              disabled
              className="w-full border rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Phone
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
            {!user.isVerifiedPhone && (
              <p className="text-sm text-red-500 mt-1">
                Phone not verified
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 resize-none"
              rows={3}
            />
          </div>

          <div className="pt-4 space-y-3">

            <button
              onClick={handleUpdate}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Update
            </button>

            <button
              onClick={handleDeleteAccount}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              Delete Account
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
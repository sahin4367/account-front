'use client';

import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center text-gray-400">
        Yüklənir...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Login olunmayıb</h1>
        <p className="text-gray-500">Profilə baxmaq üçün əvvəlcə daxil olun</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 max-w-4xl">
      <h1 className="text-3xl font-extrabold mb-8">Profilim</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">

        {/* Profil şəkli */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xl font-semibold">
              {user?.username?.[0]?.toUpperCase()}
            </span>
          </div>
        </div>

        <div>
          <span className="font-semibold">Username:</span> {user?.username}
        </div>

        <div>
          <span className="font-semibold">Email:</span> {user?.email}
        </div>

        <div>
          <span className="font-semibold">Phone:</span> {user?.phone}
        </div>

        <div>
          <span className="font-semibold">Address:</span> {user?.address}
        </div>

        {/* Update button */}
        <div className="mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Update Profile
          </button>
        </div>

        {/* Delete button */}
        <div className="mt-4">
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
}
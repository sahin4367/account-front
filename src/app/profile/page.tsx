'use client';

import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { isAuthenticated, loading, user } = useAuth();

  // ⏳ auth localStorage-dan oxunana qədər
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
        <div className="flex justify-center mb-4">
          {/* Profil şəkli */}
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-xl font-semibold">S</span>
            )}
          </div>
        </div>

        <div>
          <span className="font-semibold">Username:</span> {user?.username}
        </div>

        <div>
          <span className="font-semibold">Email:</span> {user?.email}
        </div>

        <div>
          <span className="font-semibold">Country:</span> {user?.country}
        </div>

        <div>
          <span className="font-semibold">City:</span> {user?.city}
        </div>

        <div>
          <span className="font-semibold">Date Registered:</span> {new Date(user?.dateRegistered).toLocaleDateString()}
        </div>

        {/* Sosial media links */}
        <div className="mt-4">
          <h3 className="font-semibold">Sosial Media</h3>
          <div className="flex gap-4 mt-2">
            {user?.socialMedia?.map((platform, index) => (
              <a key={index} href={platform.url} target="_blank" className="text-blue-500 hover:underline">
                {platform.name}
              </a>
            ))}
          </div>
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

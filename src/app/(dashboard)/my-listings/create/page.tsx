"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyYoutubePage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);


  function normalizeYoutubeInput(input: string): string | null {
  const value = input.trim();

  if (value.startsWith("@")) return value;
  
  if (value.startsWith("UC")) return value; 

  const handleMatch = value.match(/youtube\.com\/@([A-Za-z0-9_.]+)/);
  if (handleMatch) return `@${handleMatch[1]}`;

  const channelMatch = value.match(/channel\/(UC[A-Za-z0-9_-]+)/);
  if (channelMatch) return channelMatch[1];

  return null;
}
  const handleVerify = async () => {
  const normalized = normalizeYoutubeInput(input);

  if (!normalized) {
    alert("Invalid YouTube username or channel ID");
    return;
  }

  router.push(
    `/dashboard/my-listings/create/details?platformId=${normalized}`
  );
};

  return (
    <section className="container mx-auto px-4 py-16 max-w-xl">
      <h1 className="text-3xl font-extrabold mb-4">
        Add YouTube Listing
      </h1>

      <p className="text-gray-500 mb-8">
        Don’t forget to set your account public!
        Try username, channel ID or URL
      </p>

      <label className="block mb-2 font-semibold">
        YouTube Username / Channel ID / URL
      </label>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="youtube username"
        className="w-full border rounded-xl px-4 py-3 mb-6 outline-none"
      />

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl
                  font-bold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>
    </section>
  );
}

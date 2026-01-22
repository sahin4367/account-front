"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateListingDetails() {
  const router = useRouter();
  const params = useSearchParams();

  const platformId = params.get("platformId");

  const [form, setForm] = useState({
    description: "",
    price: "",
    followers: "",
    views: "",
    image: "",
  });

  const handleSubmit = async () => {
    const body = {
      platformId,
      description: form.description,
      price: Number(form.price),
      followers: Number(form.followers),
      views: Number(form.views),
      image: form.image,
      status: "ACTIVE",
    };

    const res = await fetch(
      "http://localhost:8008/api/v1/listings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: Bearer TOKEN
        },
        body: JSON.stringify(body),
      }
    );

    if (res.ok) {
      router.push("dashboard/my-listings");
    }
  };

  return (
    <section className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-3xl font-extrabold mb-8">
        Listing Details
      </h1>

      <div className="space-y-4">
        <input
          placeholder="Description"
          className="input"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
        <input
          placeholder="Price (AZN)"
          type="number"
          className="input"
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />
        <input
          placeholder="Followers"
          type="number"
          className="input"
          onChange={(e) =>
            setForm({ ...form, followers: e.target.value })
          }
        />
        <input
          placeholder="Views"
          type="number"
          className="input"
          onChange={(e) =>
            setForm({ ...form, views: e.target.value })
          }
        />
        <input
          placeholder="Image URL"
          className="input"
          onChange={(e) =>
            setForm({ ...form, image: e.target.value })
          }
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-4
                     rounded-xl font-bold hover:bg-blue-700"
        >
          Create Listing
        </button>
      </div>
    </section>
  );
}

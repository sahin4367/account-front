// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useState } from "react";
// import { appConfig } from "../../../../../consts";

// export default function CreateListingDetails() {
//   const router = useRouter();
//   const params = useSearchParams();

//   const platformId = params.get("platformId");

//   const [form, setForm] = useState({
//     description: "",
//     price: "",
//     followers: "",
//     views: "",
//     image: "",
//   });

//   const handleSubmit = async () => {
//     const body = {
//       platformId,
//       description: form.description,
//       price: Number(form.price),
//       followers: Number(form.followers),
//       views: Number(form.views),
//       image: form.image,
//       status: "ACTIVE",
//     };

//     const res = await fetch(
//       `${appConfig.api_url}/listings`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           // Authorization: Bearer TOKEN
//         },
//         body: JSON.stringify(body),
//       }
//     );

//     if (res.ok) {
//       router.push("dashboard/my-listings");
//     }
//   };

//   return (
//     <section className="container mx-auto px-4 py-16 max-w-2xl">
//       <h1 className="text-3xl font-extrabold mb-8">
//         Listing Details
//       </h1>

//       <div className="space-y-4">
//         <input
//           placeholder="Description"
//           className="input"
//           onChange={(e) =>
//             setForm({ ...form, description: e.target.value })
//           }
//         />
//         <input
//           placeholder="Price (AZN)"
//           type="number"
//           className="input"
//           onChange={(e) =>
//             setForm({ ...form, price: e.target.value })
//           }
//         />
//         <input
//           placeholder="Followers"
//           type="number"
//           className="input"
//           onChange={(e) =>
//             setForm({ ...form, followers: e.target.value })
//           }
//         />
//         <input
//           placeholder="Views"
//           type="number"
//           className="input"
//           onChange={(e) =>
//             setForm({ ...form, views: e.target.value })
//           }
//         />
//         <input
//           placeholder="Image URL"
//           className="input"
//           onChange={(e) =>
//             setForm({ ...form, image: e.target.value })
//           }
//         />

//         <button
//           onClick={handleSubmit}
//           className="w-full bg-blue-600 text-white py-4
//                      rounded-xl font-bold hover:bg-blue-700"
//         >
//           Create Listing
//         </button>
//       </div>
//     </section>
//   );
// }


"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { appConfig } from "../../../../../consts";

function CreateListingForm() {
  const router = useRouter();
  const params = useSearchParams();
  const platformId = params.get("platformId");

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    description: "",
    price: "",
    followers: "",
    views: "",
    image: "",
  });

  const handleSubmit = async () => {
    if (!form.description || !form.price) {
      alert("Zəhmət olmasa təsviri və qiyməti doldurun!");
      return;
    }

    setLoading(true);
    const body = {
      platformId,
      description: form.description,
      price: Number(form.price),
      followers: Number(form.followers),
      views: Number(form.views),
      image: form.image,
      status: "ACTIVE",
    };

    try {
      const res = await fetch(`${appConfig.api_url}/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.push("/dashboard/my-listings");
      } else {
        const errorData = await res.json();
        alert(`Xəta: ${errorData.message || "Uğursuz oldu"}`);
      }
    } catch (error) {
      console.error("Xəta baş verdi:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-3xl font-extrabold mb-2">Listing Details</h1>
      <p className="text-gray-500 mb-8 font-medium">
        Platform ID: <span className="text-blue-600 font-bold">{platformId}</span>
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Təsvir</label>
          <textarea
            placeholder="Kanal haqqında məlumat yazın (min. 10 simvol)"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 min-h-[100px]"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Qiymət (AZN)</label>
            <input
              type="number"
              placeholder="Məs: 50"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">İzləyici Sayı</label>
            <input
              type="number"
              placeholder="Məs: 1000"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              onChange={(e) => setForm({ ...form, followers: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Baxış Sayı</label>
          <input
            type="number"
            placeholder="Ümumi baxış"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            onChange={(e) => setForm({ ...form, views: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Şəkil URL (Opsional)</label>
          <input
            placeholder="https://..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Yaradılır..." : "Elanı Paylaş"}
        </button>
      </div>
    </section>
  );
}

export default function CreateListingDetails() {
  return (
    <Suspense fallback={<div className="text-center p-10">Yüklənir...</div>}>
      <CreateListingForm />
    </Suspense>
  );
}
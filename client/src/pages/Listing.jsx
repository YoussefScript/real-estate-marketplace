import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Listing() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/listing/get/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Listing not found");
        setListing(data);
      } catch (err) {
        setError(err.message || "Could not load listing");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading)
    return <div className="p-6 text-center text-slate-600">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!listing) return null;

  return (
    <main className="p-4 max-w-6xl mx-auto py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-stone-200">
          <img
            src={listing.imageUrls?.[activeImage]}
            alt={listing.name}
            className="w-full h-[420px] object-cover rounded-xl"
          />
          <div className="grid grid-cols-4 gap-2 mt-4">
            {listing.imageUrls?.map((image, index) => (
              <button
                key={image + index}
                type="button"
                onClick={() => setActiveImage(index)}
                className="overflow-hidden rounded-lg border border-stone-200 transition-all duration-200"
              >
                <img
                  src={image}
                  alt={`${listing.name}-${index}`}
                  className={`w-full h-20 object-cover ${activeImage === index ? "opacity-100 ring-2 ring-stone-700" : "opacity-80"}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6 bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-700 font-semibold">
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </p>
            <h1 className="text-3xl font-bold mt-2 text-stone-900">
              {listing.name}
            </h1>
          </div>

          <div className="border-t border-stone-200 pt-4">
            <p className="text-lg text-stone-600">{listing.address}</p>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <span className="text-3xl font-bold text-stone-900">
                ${listing.offer ? listing.discountPrice : listing.regularPrice}
              </span>
              {listing.offer && (
                <span className="text-base text-stone-500 line-through">
                  ${listing.regularPrice}
                </span>
              )}
              {listing.type === "rent" && (
                <span className="text-sm text-stone-500">/ month</span>
              )}
            </div>
          </div>

          <p className="text-stone-700 leading-7">{listing.description}</p>

          <div className="flex flex-wrap gap-3 text-sm text-stone-600">
            <span className="bg-stone-100 px-3 py-1.5 rounded-full">
              {listing.bedrooms} Beds
            </span>
            <span className="bg-stone-100 px-3 py-1.5 rounded-full">
              {listing.bathrooms} Baths
            </span>
            <span className="bg-stone-100 px-3 py-1.5 rounded-full">
              {listing.parking ? "Parking" : "No Parking"}
            </span>
            <span className="bg-stone-100 px-3 py-1.5 rounded-full">
              {listing.furnished ? "Furnished" : "Unfurnished"}
            </span>
          </div>

          <div className="border-t border-stone-200 pt-4">
            <p className="text-sm uppercase tracking-[0.18em] text-stone-500 mb-2">
              Contact landlord
            </p>
            <div className="whitespace-pre-line text-base text-stone-700 leading-7">
              {listing.contactInfo ||
                "Landlord contact details will be added here."}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

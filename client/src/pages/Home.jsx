import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listing/get?limit=4");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch data");
        }

        setOfferListings(data.filter((listing) => listing.offer).slice(0, 4));
        setRentListings(
          data.filter((listing) => listing.type === "rent").slice(0, 4),
        );
        setSaleListings(
          data.filter((listing) => listing.type === "sale").slice(0, 4),
        );
      } catch (error) {
        console.error("Failed to fetch home listings", error);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto py-8">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-stone-800 via-stone-700 to-emerald-900 text-white p-8 md:p-12 my-6 shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.12),_transparent_35%)]" />
        <div className="relative max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200 mb-3">
            Prime living
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Find a place that feels like home.
          </h1>
          <p className="text-stone-200 text-lg">
            Explore handpicked homes, modern apartments, and investment-ready
            spaces in the best neighborhoods.
          </p>
        </div>
      </section>

      <section className="my-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-stone-900">
            Recent offers
          </h2>
          <Link
            to="/search?offer=true"
            className="text-sm font-medium text-stone-700 hover:text-emerald-700 transition-colors"
          >
            Show more
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {offerListings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="my-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-stone-900">
            Places for rent
          </h2>
          <Link
            to="/search?type=rent"
            className="text-sm font-medium text-stone-700 hover:text-emerald-700 transition-colors"
          >
            Show more
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {rentListings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="my-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-stone-900">
            Places for sale
          </h2>
          <Link
            to="/search?type=sale"
            className="text-sm font-medium text-stone-700 hover:text-emerald-700 transition-colors"
          >
            Show more
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {saleListings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}

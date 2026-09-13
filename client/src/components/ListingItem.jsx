import { Link } from "react-router-dom";

export default function ListingItem({ listing }) {
  return (
    <div className="group bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      <Link to={`/listing/${listing._id}`} className="block overflow-hidden">
        <img
          src={
            listing.imageUrls?.[0] ||
            "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80"
          }
          alt={listing.name}
          className="h-[260px] sm:h-[220px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <p className="truncate text-lg font-semibold text-stone-900">
            {listing.name}
          </p>
          {listing.offer && (
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
              Offer
            </span>
          )}
        </div>

        <p className="text-sm text-stone-600 line-clamp-2 min-h-[40px]">
          {listing.description}
        </p>
        <p className="text-sm text-stone-500">{listing.address}</p>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-stone-200">
          <p className="text-lg font-semibold text-stone-900">
            ${listing.offer ? listing.discountPrice : listing.regularPrice}
            {listing.type === "rent" && (
              <span className="text-sm text-stone-500 font-normal">
                {" "}
                / month
              </span>
            )}
          </p>
          <div className="flex gap-2 text-xs text-stone-600">
            <span>{listing.bedrooms} bd</span>
            <span>{listing.bathrooms} ba</span>
          </div>
        </div>
      </div>
    </div>
  );
}

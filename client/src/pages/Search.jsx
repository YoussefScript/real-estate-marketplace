import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: "",
    type: "all",
    offer: false,
    sort: "created_at",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("searchTerm") || "";
    const type = urlParams.get("type") || "all";
    const offer = urlParams.get("offer") === "true";
    const sort = urlParams.get("sort") || "created_at";

    setFilters({ searchTerm, type, offer, sort });

    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams();
        if (searchTerm) query.set("searchTerm", searchTerm);
        if (type && type !== "all") query.set("type", type);
        if (offer) query.set("offer", "true");
        query.set("sort", sort);

        const res = await fetch(`/api/listing/get?${query.toString()}`);
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Could not fetch listings");
        setListings(data);
      } catch (err) {
        setError(err.message || "Failed to fetch listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (filters.searchTerm) query.set("searchTerm", filters.searchTerm);
    if (filters.type !== "all") query.set("type", filters.type);
    if (filters.offer) query.set("offer", "true");
    if (filters.sort) query.set("sort", filters.sort);
    navigate(`/search?${query.toString()}`);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-6 my-7">
        <aside className="lg:w-[300px] bg-white border border-stone-200 rounded-2xl p-5 shadow-sm h-fit">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="searchTerm"
                className="font-medium text-stone-700"
              >
                Search
              </label>
              <input
                id="searchTerm"
                type="text"
                value={filters.searchTerm}
                onChange={handleChange}
                placeholder="Search by title or city"
                className="border border-stone-200 rounded-xl p-3 focus:outline-none focus:border-stone-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="type" className="font-medium text-stone-700">
                Type
              </label>
              <select
                id="type"
                value={filters.type}
                onChange={handleChange}
                className="border border-stone-200 rounded-xl p-3 focus:outline-none focus:border-stone-400"
              >
                <option value="all">All</option>
                <option value="rent">Rent</option>
                <option value="sale">Sale</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-stone-700">
              <input
                id="offer"
                type="checkbox"
                checked={filters.offer}
                onChange={handleChange}
              />
              Show only offers
            </label>

            <div className="flex flex-col gap-2">
              <label htmlFor="sort" className="font-medium text-stone-700">
                Sort
              </label>
              <select
                id="sort"
                value={filters.sort}
                onChange={handleChange}
                className="border border-stone-200 rounded-xl p-3 focus:outline-none focus:border-stone-400"
              >
                <option value="created_at">Newest</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-stone-800 text-white rounded-xl p-3 font-medium hover:bg-stone-700 transition-colors"
            >
              Apply filters
            </button>
          </form>
        </aside>

        <div className="flex-1">
          <h1 className="text-3xl font-semibold mb-5 text-stone-900">
            Listings
          </h1>
          {loading ? (
            <p className="text-stone-600">Loading listings...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : listings.length === 0 ? (
            <p className="text-stone-600">No listings match your filters.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

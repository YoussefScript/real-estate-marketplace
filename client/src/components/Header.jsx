import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const query = urlParams.toString();
    navigate(`/search?${query}`);
  };

  return (
    <header className="bg-white/90 backdrop-blur border-b border-stone-200 shadow-sm sticky top-0 z-20">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 gap-4">
        <Link to="/" className="shrink-0">
          <h1 className="font-bold text-sm sm:text-xl flex items-center">
            <span className="text-stone-700">Prime</span>
            <span className="text-emerald-700 ml-1">Estate</span>
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="hidden sm:flex items-center gap-2 bg-stone-100 border border-stone-200 rounded-full px-3 py-2 shadow-inner w-full max-w-md"
        >
          <FaSearch className="text-stone-500 text-sm" />
          <input
            type="text"
            placeholder="Search homes..."
            className="bg-transparent focus:outline-none w-full text-stone-700 placeholder:text-stone-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className="hidden md:inline text-sm font-medium text-stone-700 hover:text-emerald-700 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hidden md:inline text-sm font-medium text-stone-700 hover:text-emerald-700 transition-colors"
          >
            About
          </Link>
          <Link
            to="/search"
            className="hidden md:inline text-sm font-medium text-stone-700 hover:text-emerald-700 transition-colors"
          >
            Search
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-9 w-9 object-cover border-2 border-stone-200 shadow-sm"
                src={
                  currentUser.avatar ||
                  "https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill,g_face,r_max/sample.jpg"
                }
                alt="profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill,g_face,r_max/sample.jpg";
                }}
              />
            ) : (
              <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-stone-700 hover:text-emerald-700 transition-colors">
                Sign in
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

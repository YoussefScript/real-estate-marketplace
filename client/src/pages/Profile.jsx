import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  signInSuccess,
  signOutSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } =
    useSelector((state) => state.user) || {};
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        password: "",
        avatar: currentUser.avatar || "",
      });

      const fetchUserListings = async () => {
        try {
          const res = await fetch(`/api/listing/user/${currentUser._id}`);
          const data = await res.json();
          if (res.ok) {
            setUserListings(data);
          }
        } catch (error) {
          console.error("Failed to load user listings", error);
        }
      };

      fetchUserListings();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const openCloudinaryWidget = () => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName) {
      alert(
        "VITE_CLOUDINARY_CLOUD_NAME is missing. Check client/.env in the Vite project root.",
      );
      return;
    }

    if (!uploadPreset) {
      alert(
        "VITE_CLOUDINARY_UPLOAD_PRESET is missing. Create an unsigned preset in Cloudinary and match the exact name in client/.env.",
      );
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await response.json();

        if (!response.ok) {
          const cloudinaryMessage =
            data?.error?.message || JSON.stringify(data);
          throw new Error(`Cloudinary upload failed: ${cloudinaryMessage}`);
        }

        const uploadedUrl = data.secure_url;
        setFormData((prev) => ({ ...prev, avatar: uploadedUrl }));
        dispatch(
          signInSuccess({ ...(currentUser || {}), avatar: uploadedUrl }),
        );
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        alert(error.message || "Image upload failed.");
      }
    };

    input.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?._id) {
      dispatch(updateUserFailure("Please sign in to update your profile."));
      return;
    }

    try {
      dispatch(updateUserStart());

      const payload = { ...formData };
      if (!payload.password) {
        delete payload.password;
      }

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to update profile");
      }

      dispatch(updateUserSuccess(data));
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      dispatch(updateUserFailure(err.message || "Something went wrong"));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
      dispatch(signOutSuccess());
      navigate("/sign-in");
    } catch (err) {
      dispatch(updateUserFailure(err.message || "Failed to sign out"));
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser?._id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to delete account");
      }

      dispatch(signOutSuccess());
      navigate("/sign-up");
    } catch (err) {
      dispatch(updateUserFailure(err.message || "Failed to delete account"));
    }
  };

  const handleDeleteListing = async (listingId) => {
    const confirmed = window.confirm("Delete this listing?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to delete listing");
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId),
      );
    } catch (error) {
      alert(error.message || "Could not delete listing");
    }
  };

  return (
    <div className="p-3 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <img
              className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
              src={
                formData.avatar ||
                currentUser?.avatar ||
                "https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill,g_face,r_max/sample.jpg"
              }
              alt="profile"
              onClick={openCloudinaryWidget}
            />
            <input
              id="username"
              type="text"
              placeholder="username"
              className="border p-3 rounded-lg"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              id="email"
              type="email"
              placeholder="email"
              className="border p-3 rounded-lg"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              id="password"
              type="password"
              placeholder="password"
              className="border p-3 rounded-lg"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              disabled={loading}
              className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-80 disabled:opacity-80"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </form>
          {error && <p className="text-red-500 mt-5">{error}</p>}
          <div className="flex justify-between mt-5">
            <span
              className="text-red-700 cursor-pointer hover:underline"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </span>
            <span
              className="text-red-700 cursor-pointer hover:underline"
              onClick={handleSignOut}
            >
              Sign Out
            </span>
          </div>

          <div className="mt-6">
            <Link to="/create-listing">
              <button className="w-full bg-green-600 text-white rounded-lg p-3 uppercase font-semibold hover:opacity-90">
                Create Listing
              </button>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">My Listings</h2>
          {userListings.length === 0 ? (
            <p className="text-slate-600">You have no listings yet.</p>
          ) : (
            <div className="space-y-4">
              {userListings.map((listing) => (
                <div
                  key={listing._id}
                  className="border rounded-lg p-3 flex gap-3"
                >
                  <img
                    src={listing.imageUrls?.[0]}
                    alt={listing.name}
                    className="w-28 h-28 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-700">
                      {listing.name}
                    </p>
                    <p className="text-sm text-slate-600">{listing.address}</p>
                    <p className="text-sm text-slate-600">
                      $
                      {listing.offer
                        ? listing.discountPrice
                        : listing.regularPrice}
                    </p>
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() =>
                          navigate(`/update-listing/${listing._id}`)
                        }
                        className="bg-slate-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteListing(listing._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

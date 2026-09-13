import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const initialState = {
  name: "",
  description: "",
  address: "",
  contactInfo: "",
  type: "rent",
  beds: 1,
  baths: 1,
  regularPrice: 0,
  discountPrice: 0,
  parking: false,
  furnished: false,
  offer: false,
  images: [],
};

export default function CreateListing() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(initialState);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Could not load listing");
        }

        setFormData({
          name: data.name || "",
          description: data.description || "",
          address: data.address || "",
          contactInfo: data.contactInfo || "",
          type: data.type || "rent",
          beds: data.bedrooms || 1,
          baths: data.bathrooms || 1,
          regularPrice: data.regularPrice || 0,
          discountPrice: data.discountPrice || 0,
          parking: Boolean(data.parking),
          furnished: Boolean(data.furnished),
          offer: Boolean(data.offer),
          images: data.imageUrls || [],
        });
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [id]: checked,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const uploadImages = async (files) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error(
        "Cloudinary env is missing. Check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in client/.env",
      );
    }

    const uploadedUrls = [];

    for (const file of files) {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: form,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        const message = data?.error?.message || JSON.stringify(data);
        throw new Error(`Cloudinary upload failed: ${message}`);
      }

      uploadedUrls.push(data.secure_url);
    }

    return uploadedUrls;
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      setUploading(true);
      const urls = await uploadImages(files.slice(0, 6));
      setFormData((prev) => ({
        ...prev,
        images: urls,
      }));
    } catch (err) {
      setError(err.message || "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        type: formData.type,
        bedrooms: Number(formData.beds),
        bathrooms: Number(formData.baths),
        regularPrice: Number(formData.regularPrice),
        discountPrice: Number(formData.discountPrice || 0),
        imageUrls: formData.images,
      };

      delete payload.beds;
      delete payload.baths;
      delete payload.images;

      const url = isEditMode
        ? `/api/listing/update/${id}`
        : "/api/listing/create";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Could not save listing");
      }

      navigate("/profile");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-x-8"
      >
        <div className="space-y-4 md:col-span-1">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-medium text-slate-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="border border-slate-300 rounded-lg p-3 outline-none focus:border-slate-500"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="border border-slate-300 rounded-lg p-3 outline-none focus:border-slate-500"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="address" className="font-medium text-slate-700">
              Address
            </label>
            <input
              id="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className="border border-slate-300 rounded-lg p-3 outline-none focus:border-slate-500"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="contactInfo" className="font-medium text-slate-700">
              Landlord contact info
            </label>
            <textarea
              id="contactInfo"
              rows="4"
              value={formData.contactInfo}
              onChange={handleChange}
              placeholder="Example: Call or WhatsApp: +1 555 123 4567\nEmail: owner@example.com\nBest time to contact: evenings"
              className="border border-slate-300 rounded-lg p-3 outline-none focus:border-slate-500"
            />
          </div>

          <div className="flex flex-wrap gap-4 mt-2">
            <label className="flex items-center gap-2 text-slate-700">
              <input
                id="sale"
                type="checkbox"
                checked={formData.type === "sale"}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, type: "sale" }))
                }
              />
              Sell
            </label>
            <label className="flex items-center gap-2 text-slate-700">
              <input
                id="rent"
                type="checkbox"
                checked={formData.type === "rent"}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, type: "rent" }))
                }
              />
              Rent
            </label>
            <label className="flex items-center gap-2 text-slate-700">
              <input
                id="parking"
                type="checkbox"
                checked={formData.parking}
                onChange={handleChange}
              />
              Parking spot
            </label>
            <label className="flex items-center gap-2 text-slate-700">
              <input
                id="furnished"
                type="checkbox"
                checked={formData.furnished}
                onChange={handleChange}
              />
              Furnished
            </label>
          </div>

          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                id="beds"
                type="number"
                min="1"
                max="10"
                value={formData.beds}
                onChange={handleChange}
                className="w-20 border border-slate-300 rounded-lg p-2 outline-none focus:border-slate-500"
              />
              <span className="text-slate-700">Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="baths"
                type="number"
                min="1"
                max="10"
                value={formData.baths}
                onChange={handleChange}
                className="w-20 border border-slate-300 rounded-lg p-2 outline-none focus:border-slate-500"
              />
              <span className="text-slate-700">Baths</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                id="regularPrice"
                type="number"
                min="0"
                value={formData.regularPrice}
                onChange={handleChange}
                className="w-32 border border-slate-300 rounded-lg p-2 outline-none focus:border-slate-500"
              />
              <span className="text-slate-700">Regular price</span>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  id="discountPrice"
                  type="number"
                  min="0"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="w-32 border border-slate-300 rounded-lg p-2 outline-none focus:border-slate-500"
                />
                <span className="text-slate-700">Discount price</span>
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-slate-700 mt-1">
            <input
              id="offer"
              type="checkbox"
              checked={formData.offer}
              onChange={handleChange}
            />
            Offer
          </label>
        </div>

        <div className="space-y-4 md:col-span-1">
          <div className="text-sm text-slate-600 mb-2">
            Images: The first image will be the cover (max 6)
          </div>

          <label className="flex items-center justify-between gap-3 bg-slate-100 border border-slate-300 rounded-xl p-3 cursor-pointer">
            <span className="text-slate-700 text-sm font-medium overflow-hidden text-ellipsis">
              {formData.images.length
                ? `${formData.images.length} image(s) selected`
                : "Choose files"}
            </span>
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-xs font-semibold uppercase">
              {uploading ? "Uploading..." : "Upload"}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {formData.images.map((img, index) => (
                <img
                  key={img + index}
                  src={img}
                  alt={`preview-${index}`}
                  className="w-full h-24 object-cover rounded-lg border border-slate-200"
                />
              ))}
            </div>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-slate-700 text-white py-3 px-4 rounded-lg uppercase font-semibold hover:opacity-90 disabled:opacity-70"
          >
            {loading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Listing"
                : "Create Listing"}
          </button>
        </div>
      </form>
    </main>
  );
}

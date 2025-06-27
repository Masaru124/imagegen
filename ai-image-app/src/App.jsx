import React, { useState } from "react";

export default function AIImageGenerator() {
  const [formData, setFormData] = useState({
    mood: "",
    style: "",
    location: "",
    time: "",
    elements: "",
  });

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const canGenerate =
    formData.mood &&
    formData.style &&
    formData.location &&
    formData.time &&
    !loading;

  const generateImage = async () => {
    setLoading(true);
    setImageUrl("");
    try {
      const response = await fetch("http://localhost:8000/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.image_url) {
        setImageUrl(data.image_url); // This is a base64 data URL now
      } else {
        alert("No image returned");
      }
    } catch (error) {
      alert("Failed to generate image");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        AI Image Generator
      </h1>

      <div className="space-y-4">
        {/* ... input fields unchanged ... */}
        <div>
          <label htmlFor="mood" className="block font-medium mb-1">
            Mood <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="mood"
            name="mood"
            value={formData.mood}
            onChange={handleChange}
            placeholder="e.g. mysterious"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="style" className="block font-medium mb-1">
            Style <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="style"
            name="style"
            value={formData.style}
            onChange={handleChange}
            placeholder="e.g. cyberpunk"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block font-medium mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. underground city"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="time" className="block font-medium mb-1">
            Time <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="e.g. night"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="elements" className="block font-medium mb-1">
            Elements (comma separated)
          </label>
          <input
            type="text"
            id="elements"
            name="elements"
            value={formData.elements}
            onChange={handleChange}
            placeholder="e.g. neon lights, robots, fog"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        onClick={generateImage}
        disabled={!canGenerate}
        className={`mt-6 w-full py-3 rounded-md text-white font-semibold ${
          canGenerate
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {imageUrl && (
        <div className="mt-8">
          <img
            src={imageUrl}
            alt="Generated"
            className="w-full rounded-md shadow-md"
          />
        </div>
      )}
    </div>
  );
}

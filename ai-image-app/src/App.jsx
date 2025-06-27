import { useState } from "react";
import axios from "axios";

function App() {
  const [inputs, setInputs] = useState({
    mood: "",
    style: "",
    location: "",
    time: "",
    elements: "",
  });
  const [refinedPrompt, setRefinedPrompt] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoadingPrompt(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/refine-prompt",
        inputs
      );
      setRefinedPrompt(res.data.refined_prompt);
    } catch (err) {
      console.error(err);
      alert("Failed to refine prompt.");
    }
    setLoadingPrompt(false);
  };

  const generateImage = async () => {
    setLoadingImage(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/generate-image", {
        prompt: refinedPrompt,
      });
      setImageURL(res.data.image_url);
    } catch (err) {
      console.error(err);
      alert("Image generation failed.");
    }
    setLoadingImage(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4 font-sans">
      <h1 className="text-3xl font-bold text-center mb-6">
        🧠 AI Image Generator
      </h1>

      {["mood", "style", "location", "time", "elements"].map((field) => (
        <input
          key={field}
          name={field}
          value={inputs[field]}
          onChange={handleChange}
          placeholder={field[0].toUpperCase() + field.slice(1)}
          className="block w-full border p-2 rounded mb-2"
        />
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        {loadingPrompt ? "Refining..." : "Generate Prompt"}
      </button>

      {refinedPrompt && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="font-semibold">🎨 Refined Prompt:</p>
          <p>{refinedPrompt}</p>
        </div>
      )}

      {refinedPrompt && (
        <button
          onClick={generateImage}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full mt-2"
        >
          {loadingImage ? "Generating Image..." : "Generate Image"}
        </button>
      )}

      {imageURL && (
        <div className="mt-4">
          <p className="font-semibold">🖼️ Generated Image:</p>
          <img src={imageURL} alt="Generated" className="rounded mt-2" />
          <a
            href={imageURL}
            download
            className="text-blue-600 underline block mt-2"
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
}

export default App;

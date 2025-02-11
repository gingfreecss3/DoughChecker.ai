import React, { useState, useRef, ChangeEvent } from "react";

interface Props {
  onImageProcess: (data: { roundness: number; image: string }) => void;
  setError: (error: string | null) => void;
}

export default function ImageUpload({ onImageProcess, setError }: Props) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Analysis failed");
        return;
      }

      const data = await response.json();
      onImageProcess(data);
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        id="imageInput"
        ref={fileInputRef}
      />
      <label
        htmlFor="imageInput"
        className="block w-full p-6 text-center bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition duration-200 shadow-md"
      >
        {loading ? "Processing..." : "Drag & drop your dough image, or click here to upload"}
      </label>
    </div>
  );
}
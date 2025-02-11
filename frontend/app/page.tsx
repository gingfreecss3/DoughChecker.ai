"use client";
import React, { useState } from "react";
import Header from "../components/Header";
import ImageUpload from "../components/ImageUpload";
import RoundnessDisplay from "../components/RoundnessDisplay";

export default function Home() {
  const [roundness, setRoundness] = useState<number | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageProcess = (data: { roundness: number; image: string }) => {
    setRoundness(data.roundness);
    setProcessedImage(data.image);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto p-4 flex-grow">
        <ImageUpload onImageProcess={handleImageProcess} setError={setError} />
        {error && (
          <p className="text-red-500 mt-2 text-center">
            Error: {error}
          </p>
        )}
        {roundness !== null && processedImage !== null && (
          <RoundnessDisplay
            score={roundness}
            processedImage={`data:image/jpeg;base64,${processedImage}`}
          />
        )}
      </main>
      <footer className="text-center p-4 text-gray-600">
        &copy; {new Date().getFullYear()} DoughChecker.ai. All rights reserved.
      </footer>
    </div>
  );
}
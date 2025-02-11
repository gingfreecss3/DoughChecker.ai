import React from "react";

interface Props {
  score: number;
  processedImage: string;
}

export default function RoundnessDisplay({ score, processedImage }: Props) {
  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={processedImage}
          alt="Processed dough"
          className="w-full object-cover"
        />
        <div className="p-4">
          <p className="text-xl font-bold text-center text-gray-800">
            Roundness Score: {score}%
          </p>
        </div>
      </div>
    </div>
  );
}
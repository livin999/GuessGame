import React from "react";
import { motion } from "framer-motion";

interface FeedbackIndicatorProps {
  proximity: number; // 0-100 where 100 is closest to the target
  guessResult?: "too-high" | "too-low" | "correct" | null;
  isPlaying?: boolean;
}

const FeedbackIndicator = ({
  proximity = 0,
  guessResult = null,
  isPlaying = false,
}: FeedbackIndicatorProps) => {
  // Calculate color based on proximity (red for cold, green for hot)
  const getColor = () => {
    if (guessResult === "correct") return "bg-green-500";

    // Calculate color gradient with 10 transitions from red (cold) to green (hot)
    const segment = Math.floor(proximity / 10); // Determine which of the 10 segments (0-9)

    // Calculate the base colors for each segment
    const redValues = [255, 255, 255, 255, 255, 230, 204, 153, 102, 51, 0];
    const greenValues = [0, 51, 102, 153, 204, 230, 255, 255, 255, 255, 255];

    const red = redValues[segment];
    const green = greenValues[segment];

    return `rgb(${red}, ${green}, 0)`;
  };

  // Get message based on guess result
  const getMessage = () => {
    if (guessResult === "correct") return "Correct!";
    if (guessResult === "too-high") return "Too High";
    if (guessResult === "too-low") return "Too Low";
    return "Make a guess...";
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center space-y-4">
        {/* Message display */}
        <div className="text-xl font-bold text-center">{getMessage()}</div>

        {/* Proximity indicator */}
        <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: getColor() }}
            initial={{ width: "0%" }}
            animate={{ width: `${proximity}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Hot/Cold text indicator */}
        <div className="flex justify-between w-full text-sm">
          <span className="text-red-600 font-medium">Cold</span>
          <span className="text-green-600 font-medium">Hot</span>
        </div>

        {/* Audio playing indicator */}
        {isPlaying && (
          <motion.div
            className="mt-2 flex space-x-1 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-sm text-gray-600">Playing sound...</span>
            <motion.div
              className="w-2 h-2 bg-gray-600 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FeedbackIndicator;

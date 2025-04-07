import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GuessInputProps {
  maxRange: number;
  onSubmitGuess: (guess: number) => void;
  isPlaying: boolean;
  gameWon: boolean;
}

const GuessInput = ({
  maxRange,
  onSubmitGuess,
  isPlaying,
  gameWon,
}: GuessInputProps) => {
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentGuess(e.target.value);
    setError("");
  };

  const handleSubmit = () => {
    // Validate input
    const guessNumber = parseInt(currentGuess, 10);
    if (isNaN(guessNumber) || guessNumber < 1 || guessNumber > maxRange) {
      setError(`Please enter a valid number between 1 and ${maxRange}`);
      return;
    }

    // Submit the guess
    onSubmitGuess(guessNumber);

    // Clear input for next guess
    setCurrentGuess("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isPlaying && !gameWon && currentGuess) {
      handleSubmit();
    }
  };

  return (
    <>
      <div className="flex space-x-2">
        <Input
          type="number"
          placeholder="Enter your guess"
          value={currentGuess}
          onChange={handleGuessChange}
          onKeyDown={handleKeyDown}
          min={1}
          max={maxRange}
          disabled={isPlaying || gameWon}
          className="flex-1"
        />
        <Button
          onClick={handleSubmit}
          disabled={isPlaying || gameWon || !currentGuess}
        >
          {isPlaying ? "Playing..." : "Submit"}
        </Button>
      </div>
      {error && <div className="text-destructive text-sm">{error}</div>}
    </>
  );
};

export default GuessInput;

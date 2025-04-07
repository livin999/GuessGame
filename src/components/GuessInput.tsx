import React, { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GuessInputProps {
  maxRange: number;
  onSubmitGuess: (guess: string) => void;
  isPlaying: boolean;
  gameWon: boolean;
  error: string;
  setError: (error: string) => void;
}

const GuessInput = ({
  maxRange,
  onSubmitGuess,
  isPlaying,
  gameWon,
  error,
  setError,
}: GuessInputProps) => {
  const [currentGuess, setCurrentGuess] = useState<string>("");

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentGuess(e.target.value);
    setError("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentGuess && !isPlaying && !gameWon) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    onSubmitGuess(currentGuess);
    setCurrentGuess("");
  };

  return (
    <div>
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
    </div>
  );
};

export default GuessInput;

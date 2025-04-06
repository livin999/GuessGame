import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FeedbackIndicator from "./FeedbackIndicator";

interface GuessEntry {
  value: number;
  proximity: number; // 0-100 where 100 is closest
  isHigh: boolean;
  isCorrect: boolean;
}

interface GameContainerProps {
  maxRange: number;
}

const GameContainer = ({ maxRange = 1000 }: GameContainerProps) => {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [guessHistory, setGuessHistory] = useState<GuessEntry[]>([]);
  const [attempts, setAttempts] = useState<number>(0);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [proximity, setProximity] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioContext = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);

  // Initialize the game
  useEffect(() => {
    startNewGame();
    // Initialize audio context
    try {
      audioContext.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    } catch (e) {
      console.error("Web Audio API is not supported in this browser");
    }

    return () => {
      // Clean up audio resources
      if (oscillator.current) {
        oscillator.current.stop();
        oscillator.current.disconnect();
      }
      if (audioContext.current && audioContext.current.state !== "closed") {
        audioContext.current.close();
      }
    };
  }, []);

  // Restart game when range changes
  useEffect(() => {
    startNewGame();
  }, [maxRange]);

  const startNewGame = () => {
    const newTarget = Math.floor(Math.random() * maxRange) + 1;
    setTargetNumber(newTarget);
    setCurrentGuess("");
    setGuessHistory([]);
    setAttempts(0);
    setGameWon(false);
    setProximity(0);
    setError("");
    console.log("New target number:", newTarget); // For debugging
  };

  const calculateProximity = (guess: number): number => {
    // Calculate how close the guess is to the target (0-100)
    const distance = Math.abs(guess - targetNumber);
    const maxDistance = maxRange; // Maximum possible distance
    return 100 - Math.min(100, (distance / maxDistance) * 100);
  };

  const playFeedbackSound = (proximityValue: number, isCorrect: boolean) => {
    setIsPlaying(true);

    // Choose the appropriate chicken sound based on proximity and correctness
    let soundUrl = "";

    if (isCorrect) {
      // Cock-a-doodle-doo for correct answer
      soundUrl =
        "https://assets.mixkit.co/active_storage/sfx/2522/2522-preview.mp3";
    } else if (proximityValue > 70) {
      // Chasing chicken sound when close
      soundUrl =
        "https://assets.mixkit.co/active_storage/sfx/2518/2518-preview.mp3";
    } else {
      // Normal chicken sound when far
      soundUrl =
        "https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3";
    }

    // Play the selected sound
    const audio = new Audio(soundUrl);
    audio.play();

    // Stop the sound after 3 seconds
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }, 3000);

    // Also reset playing state after sound finishes naturally (if before 3 seconds)
    audio.onended = () => {
      setIsPlaying(false);
    };
  };

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentGuess(e.target.value);
    setError("");
  };

  const handleSubmitGuess = () => {
    // Validate input
    const guessNumber = parseInt(currentGuess, 10);
    if (isNaN(guessNumber) || guessNumber < 1 || guessNumber > maxRange) {
      setError(`Please enter a valid number between 1 and ${maxRange}`);
      return;
    }

    // Increment attempts
    setAttempts((prev) => prev + 1);

    // Check if guess is correct
    const isCorrect = guessNumber === targetNumber;
    const isHigh = guessNumber > targetNumber;
    const proximityValue = calculateProximity(guessNumber);
    setProximity(proximityValue);

    // Add to history
    const newEntry: GuessEntry = {
      value: guessNumber,
      proximity: proximityValue,
      isHigh,
      isCorrect,
    };

    setGuessHistory((prev) => [newEntry, ...prev]);

    // Play feedback sound
    playFeedbackSound(proximityValue, isCorrect);

    // Check for win condition
    if (isCorrect) {
      setGameWon(true);
    } else {
      // Clear input for next guess
      setCurrentGuess("");
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-background shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {gameWon
            ? "🎉 Congratulations! You found the number!"
            : "Guess the Number"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center text-muted-foreground">
          {gameWon
            ? `You found the number ${targetNumber} in ${attempts} attempts!`
            : `I'm thinking of a number between 1 and ${maxRange}. Can you guess it?`}
        </div>

        {!gameWon && (
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Enter your guess"
              value={currentGuess}
              onChange={handleGuessChange}
              min={1}
              max={maxRange}
              disabled={isPlaying || gameWon}
              className="flex-1"
            />
            <Button
              onClick={handleSubmitGuess}
              disabled={isPlaying || gameWon || !currentGuess}
            >
              {isPlaying ? "Playing..." : "Submit"}
            </Button>
          </div>
        )}

        {error && <div className="text-destructive text-sm">{error}</div>}

        {attempts > 0 && (
          <FeedbackIndicator
            proximity={proximity}
            isHigh={guessHistory.length > 0 ? guessHistory[0].isHigh : false}
            isCorrect={gameWon}
            isPlaying={isPlaying}
          />
        )}

        <div className="text-sm text-muted-foreground text-center">
          Attempts: {attempts}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={startNewGame} variant="outline" className="w-full">
          {gameWon ? "Play Again" : "New Game"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GameContainer;

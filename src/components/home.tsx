import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import GameContainer from "./GameContainer";

export default function Home() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedRange, setSelectedRange] = useState<number>(10);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-100 to-slate-200 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto">
        <Card className="w-full shadow-lg border-2 border-slate-200 bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">
              Audio-Guided Number Guessing Game
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Try to guess the secret number using audio cues!
            </CardDescription>
            <Button
              variant="ghost"
              className="mt-2"
              onClick={() => setShowInstructions(!showInstructions)}
            >
              {showInstructions ? "Hide Instructions" : "Show Instructions"}
            </Button>
            {showInstructions && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg text-left">
                <h3 className="font-semibold mb-2">How to Play:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    The game has selected a random number between 1 and{" "}
                    {selectedRange}
                  </li>
                  <li>
                    Enter your guess in the input field and click "Submit"
                  </li>
                  <li>
                    Listen to the audio feedback -{" "}
                    <strong>louder sounds</strong> mean you're getting closer!
                  </li>
                  <li>
                    Watch the visual indicator to see if you're hot or cold
                  </li>
                  <li>
                    Your previous guesses will be shown in the history list
                  </li>
                  <li>Try to find the number in as few attempts as possible</li>
                </ul>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Select Difficulty:</h3>
              <RadioGroup
                value={selectedRange.toString()}
                onValueChange={(value) => setSelectedRange(parseInt(value))}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10" id="range-10" />
                  <Label htmlFor="range-10">Easy (1-10)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="100" id="range-100" />
                  <Label htmlFor="range-100">Medium (1-100)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1000" id="range-1000" />
                  <Label htmlFor="range-1000">Hard (1-1000)</Label>
                </div>
              </RadioGroup>
            </div>
            <GameContainer maxRange={selectedRange} />
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-slate-500">
              Created with React, Tailwind CSS, and ShadCN UI components
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

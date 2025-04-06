import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface GuessHistoryProps {
  guesses: Array<{
    value: number;
    result: "high" | "low" | "correct";
    proximity: number; // 0-100 where 100 is closest to the target
  }>;
}

const GuessHistory = ({ guesses = [] }: GuessHistoryProps) => {
  // Default background color for the component
  const bgColor = "bg-background";

  return (
    <Card className={`w-full max-w-[500px] h-[300px] ${bgColor}`}>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3">Guess History</h3>
        {guesses.length === 0 ? (
          <div className="flex items-center justify-center h-[220px] text-muted-foreground">
            No guesses yet. Start guessing!
          </div>
        ) : (
          <ScrollArea className="h-[220px] w-full pr-4">
            <div className="space-y-2">
              {guesses.map((guess, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-md border animate-in fade-in-50 duration-300"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{guess.value}</span>
                    <Badge
                      variant={
                        guess.result === "correct"
                          ? "default"
                          : guess.result === "high"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {guess.result === "correct"
                        ? "Correct!"
                        : guess.result === "high"
                          ? "Too High"
                          : "Too Low"}
                    </Badge>
                  </div>
                  <div
                    className="w-16 h-2 rounded-full bg-slate-200 overflow-hidden"
                    title={`${guess.proximity}% close to target`}
                  >
                    <div
                      className={`h-full ${
                        guess.result === "correct"
                          ? "bg-green-500"
                          : guess.proximity > 75
                            ? "bg-red-500"
                            : guess.proximity > 50
                              ? "bg-orange-400"
                              : guess.proximity > 25
                                ? "bg-yellow-400"
                                : "bg-blue-400"
                      }`}
                      style={{ width: `${guess.proximity}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default GuessHistory;

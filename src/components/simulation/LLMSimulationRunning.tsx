"use client";

import { useEffect, useState } from "react";
import { Sparkles, Users, MessageSquare, Clock, CheckCircle } from "lucide-react";
import { llmSimulationApi } from "@/lib/llm-simulation-api";

interface LLMSimulationRunningProps {
  simulationId: string | null;
  onComplete: () => void;
}

const STEPS = [
  { id: 1, name: "Parsing brief", icon: FileText },
  { id: 2, name: "Generating personas", icon: Users },
  { id: 3, name: "Running debates", icon: MessageSquare },
  { id: 4, name: "Synthesizing report", icon: Sparkles },
];

export function LLMSimulationRunning({ simulationId, onComplete }: LLMSimulationRunningProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");
  const [debateProgress, setDebateProgress] = useState<{ round: number; total: number } | null>(null);

  useEffect(() => {
    if (!simulationId) return;

    const pollStatus = async () => {
      try {
        const statusResponse = await llmSimulationApi.getResults(simulationId);

        if (statusResponse) {
          // Simulation complete
          setCurrentStep(4);
          setProgress(100);
          setStatus("Complete!");
          setTimeout(onComplete, 500);
          return;
        }
      } catch (error) {
        // May still be running, continue polling
      }

      // Update progress based on current step
      const pollInterval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < 4) {
            const newProgress = (prev / 4) * 100;
            setProgress(newProgress);
            return prev + 1;
          }
          return prev;
        });
      }, 3000);

      return () => clearInterval(pollInterval);
    };

    pollStatus();
  }, [simulationId, onComplete]);

  return (
    <div className="max-w-2xl mx-auto py-12">
      {/* Progress Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
          <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
        </div>
        <h2 className="text-2xl font-serif font-bold mb-2">
          Running LLM Simulation
        </h2>
        <p className="text-gray-600">
          AI agents are debating your product idea...
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">{status}</span>
          <span className="text-gray-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                isCurrent
                  ? "bg-purple-50 border border-purple-200"
                  : isCompleted
                  ? "bg-gray-50"
                  : "bg-gray-50 opacity-50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isCurrent
                    ? "bg-purple-600 text-white animate-pulse"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium">{step.name}</div>
                {isCurrent && step.id === 3 && debateProgress && (
                  <div className="text-sm text-gray-500">
                    Round {debateProgress.round} of {debateProgress.total}
                  </div>
                )}
              </div>
              {isCurrent && (
                <Clock className="w-5 h-5 text-purple-600 animate-spin" />
              )}
            </div>
          );
        })}
      </div>

      {/* Live Debate Feed (placeholder) */}
      {currentStep === 3 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Live Debate Feed
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="p-3 bg-white rounded border border-gray-200">
              <span className="text-purple-600 font-medium">Meeting Fatigue Manager:</span>{" "}
              "This would save me hours every week, but I'm concerned about another tool to manage..."
            </div>
            <div className="p-3 bg-white rounded border border-gray-200">
              <span className="text-indigo-600 font-medium">Engineering Skeptic:</span>{" "}
              "We already have transcription covered. What's the actual differentiation here?"
            </div>
            <div className="p-3 bg-white rounded border border-gray-200">
              <span className="text-green-600 font-medium">Sales Power User:</span>{" "}
              "If it integrates with Salesforce, I'm in. Otherwise, it's just another nice-to-have."
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Placeholder icon component
function FileText() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

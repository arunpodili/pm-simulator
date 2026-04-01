"use client";

import { useState, useEffect } from "react";
import { Loader2, Users, Clock, Activity, Brain } from "lucide-react";

interface SimulationRunningProps {
  simulationId: string | null;
  onComplete: () => void;
}

const SIMULATION_STEPS = [
  { label: "Generating Personas", description: "Creating 1,000+ diverse user profiles" },
  { label: "Building Social Graph", description: "Mapping connections between agents" },
  { label: "Simulating Day 1-30", description: "Discovery and signup phase" },
  { label: "Simulating Day 31-60", description: "Activation and engagement phase" },
  { label: "Simulating Day 61-90", description: "Retention and churn analysis" },
  { label: "Calculating Metrics", description: "NPS, CLV, and cohort analysis" },
  { label: "Finalizing Results", description: "Compiling predictions and insights" },
];

export function SimulationRunning({ simulationId, onComplete }: SimulationRunningProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [funFactIndex, setFunFactIndex] = useState(0);

  const funFacts = [
    "Each agent has unique personality traits and memory",
    "Agents influence each other through the social graph",
    "Simulating 1,000 users is like predicting a small town's behavior",
    "Early adopters behave differently than late majority",
    "Churn prediction accuracy increases with more agents",
    "The simulation uses Rogers' diffusion of innovations theory",
    "Price sensitivity varies by adoption archetype",
    "Viral effects emerge naturally from agent interactions",
  ];

  useEffect(() => {
    // Rotate fun facts
    const factInterval = setInterval(() => {
      setFunFactIndex((prev) => (prev + 1) % funFacts.length);
    }, 4000);

    // Simulate progress (in real implementation, would poll API)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 3;
      });
    }, 500);

    // Update current step based on progress
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        const newStep = Math.floor((progress / 100) * SIMULATION_STEPS.length);
        return Math.min(newStep, SIMULATION_STEPS.length - 1);
      });
    }, 1000);

    return () => {
      clearInterval(factInterval);
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [progress]);

  return (
    <div className="max-w-2xl mx-auto py-20">
      {/* Visual Animation */}
      <div className="relative w-48 h-48 mx-auto mb-12">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />

        {/* Progress ring */}
        <div
          className="absolute inset-0 border-4 border-black rounded-full transition-all duration-500"
          style={{
            clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)`,
            transform: "rotate(-90deg)",
          }}
        />

        {/* Center content */}
        <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center">
          <Brain className="w-12 h-12 text-black mb-2 animate-pulse" />
          <div className="text-3xl font-bold">{Math.round(progress)}%</div>
        </div>

        {/* Orbiting dots */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-black rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 60 + progress * 3.6}deg) translateX(90px) translateY(-50%)`,
              opacity: progress > (i / 6) * 100 ? 1 : 0.2,
              transition: "opacity 0.3s",
            }}
          />
        ))}
      </div>

      {/* Status Text */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-bold mb-2">
          {SIMULATION_STEPS[currentStep]?.label || "Processing..."}
        </h2>
        <p className="text-gray-600">
          {SIMULATION_STEPS[currentStep]?.description || "Please wait..."}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-200 rounded-full h-2 mb-8 overflow-hidden">
        <div
          className="bg-black h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-2 mb-12">
        {SIMULATION_STEPS.map((step, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              index === currentStep
                ? "bg-black text-white"
                : index < currentStep
                ? "bg-gray-100"
                : "bg-gray-50 text-gray-400"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                index < currentStep
                  ? "bg-green-500 text-white"
                  : index === currentStep
                  ? "bg-white text-black"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>
            <span className="font-medium">{step.label}</span>
            {index === currentStep && (
              <Loader2 className="w-4 h-4 animate-spin ml-auto" />
            )}
          </div>
        ))}
      </div>

      {/* Fun Fact */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
        <div className="text-sm text-blue-600 font-medium mb-1">Did you know?</div>
        <p className="text-blue-800 animate-fadeIn">{funFacts[funFactIndex]}</p>
      </div>

      {/* Simulation ID */}
      {simulationId && (
        <div className="mt-8 text-center text-sm text-gray-500">
          Simulation ID: {simulationId}
        </div>
      )}
    </div>
  );
}

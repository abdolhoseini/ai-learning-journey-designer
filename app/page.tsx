"use client";

import { useState } from "react";

type LearningJourneyResult = {
  businessNeedSummary: string;
  audienceProfile: string;
  identifiedSkillGap: string;
  learningObjectives: string[];
  learningJourney: {
    stage: string;
    purpose: string;
    activity: string;
  }[];
  assessmentApproach: string;
  behaviourChangeGoal: string;
  impactMetrics: string[];
};

export default function Home() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [showResult, setShowResult] = useState(false);

  const [businessNeed, setBusinessNeed] = useState("");
  const [audience, setAudience] = useState("");
  const [currentLevel, setCurrentLevel] = useState("");
  const [desiredSkill, setDesiredSkill] = useState("");
  const [constraints, setConstraints] = useState("");

  const [result, setResult] = useState<LearningJourneyResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const questions = [
    {
      title: "What business need are you trying to address?",
      description:
        "Describe the business problem or opportunity before thinking about the training solution.",
      value: businessNeed,
      setValue: setBusinessNeed,
      placeholder:
        "Example: Our marketing teams across EMEA need to use generative AI more effectively and responsibly in their daily work.",
    },
    {
      title: "Who are the learners?",
      description:
        "Describe the target audience, including roles, functions, regions or other relevant characteristics.",
      value: audience,
      setValue: setAudience,
      placeholder:
        "Example: Marketing professionals across EMEA working in content, campaign management and digital marketing roles.",
    },
    {
      title: "What is their current level?",
      description:
        "Describe what learners can currently do and where their knowledge or performance gaps appear.",
      value: currentLevel,
      setValue: setCurrentLevel,
      placeholder:
        "Example: Most employees have used basic AI tools but have limited experience applying them consistently in real work.",
    },
    {
      title: "What skill or behaviour should improve?",
      description:
        "Define what learners should be able to do differently after the learning experience.",
      value: desiredSkill,
      setValue: setDesiredSkill,
      placeholder:
        "Example: Use generative AI effectively, critically and responsibly in daily marketing activities.",
    },
    {
      title: "What constraints should the learning design consider?",
      description:
        "Add practical constraints such as available time, delivery format, geography or business requirements.",
      value: constraints,
      setValue: setConstraints,
      placeholder:
        "Example: Maximum 3 hours total learning time, blended delivery, suitable for multiple EMEA markets.",
    },
  ];

  async function generateLearningJourney() {
    try {
      setIsGenerating(true);
      setError("");

      const response = await fetch("/api/generate-learning-journey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessNeed,
          audience,
          currentLevel,
          desiredSkill,
          constraints,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to generate learning journey.");
      }

      setResult(data);
      setShowResult(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating the learning journey."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  if (!started) {
    return (
      <main className="min-h-screen bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-500">
            AI Learning Journey Designer
          </p>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Turn a business need into a structured learning journey.
          </h1>

          <p className="mb-10 max-w-2xl text-lg leading-8 text-gray-600">
            Define your audience, identify the skill gap, and generate a
            learner-centred learning journey focused on application and
            measurable impact.
          </p>

          <button
            onClick={() => setStarted(true)}
            className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Start Designing
          </button>
        </div>
      </main>
    );
  }

  if (showResult && result) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-500">
            Learning Design Output
          </p>

          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Your Learning Journey
          </h1>

          <p className="mb-10 max-w-3xl text-lg leading-8 text-gray-600">
            A structured learning design generated from the business need,
            learner profile, skill gap and practical constraints you provided.
          </p>

          <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-500">
              Learning Design Approach
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                "Skills-based",
                "Learner-centred",
                "Application-focused",
                "Behaviour-focused",
                "Impact-oriented",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700"
                >
                  {item}
                </span>
              ))}
            </div>

            <p className="mt-5 max-w-3xl leading-7 text-gray-600">
              This learning journey is designed to move beyond knowledge
              transfer by focusing on practical skill application, workplace
              behaviour and measurable learning impact.
            </p>
          </div>

          <div className="grid gap-6">
            <ResultCard
              title="Business Need Summary"
              content={result.businessNeedSummary}
            />

            <ResultCard
              title="Audience Profile"
              content={result.audienceProfile}
            />

            <ResultCard
              title="Identified Skill Gap"
              content={result.identifiedSkillGap}
            />

            <ResultCard
              title="Learning Objectives"
              content={result.learningObjectives
                .map((item, index) => `${index + 1}. ${item}`)
                .join("\n")}
            />

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                Learning Journey
              </h2>

              <div className="space-y-5">
                {result.learningJourney.map((item, index) => (
                  <div
                    key={`${item.stage}-${index}`}
                    className="relative rounded-2xl border border-gray-200 bg-gray-50 p-6"
                  >
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                        {index + 1}
                      </div>

                      <div>
                        <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
                          Stage {index + 1}
                        </p>

                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.stage}
                        </h3>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl bg-white p-4">
                        <p className="mb-1 text-sm font-semibold text-gray-900">
                          Purpose
                        </p>
                        <p className="leading-7 text-gray-600">
                          {item.purpose}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white p-4">
                        <p className="mb-1 text-sm font-semibold text-gray-900">
                          Activity
                        </p>
                        <p className="leading-7 text-gray-600">
                          {item.activity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <ResultCard
              title="Assessment Approach"
              content={result.assessmentApproach}
            />

            <ResultCard
              title="Behaviour Change Goal"
              content={result.behaviourChangeGoal}
            />

            <ResultCard
              title="Impact Metrics"
              content={result.impactMetrics
                .map((item) => `• ${item}`)
                .join("\n")}
            />
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => setShowResult(false)}
              className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Edit Inputs
            </button>

            <button
              onClick={() => {
                setStarted(false);
                setStep(1);
                setShowResult(false);
                setBusinessNeed("");
                setAudience("");
                setCurrentLevel("");
                setDesiredSkill("");
                setConstraints("");
                setResult(null);
                setError("");
              }}
              className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Start New Design
            </button>
          </div>
        </div>
      </main>
    );
  }

  const currentQuestion = questions[step - 1];

  function handleBack() {
    if (step === 1) {
      setStarted(false);
    } else {
      setStep(step - 1);
    }
  }

  function handleContinue() {
    if (step < 5) {
      setStep(step + 1);
    } else {
      generateLearningJourney();
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-500">
            Step {step} of 5
          </p>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className={`h-1.5 flex-1 rounded-full ${
                  item <= step ? "bg-black" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          {currentQuestion.title}
        </h1>

        <p className="mb-8 text-lg leading-8 text-gray-600">
          {currentQuestion.description}
        </p>

        <textarea
          value={currentQuestion.value}
          onChange={(e) => currentQuestion.setValue(e.target.value)}
          placeholder={currentQuestion.placeholder}
          className="min-h-48 w-full rounded-2xl border border-gray-300 bg-white p-5 text-lg text-gray-900 outline-none transition focus:border-black"
        />

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={isGenerating}
            className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-40"
          >
            Back
          </button>

          <button
            onClick={handleContinue}
            disabled={!currentQuestion.value.trim() || isGenerating}
            className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isGenerating
              ? "Generating..."
              : step < 5
              ? "Continue"
              : "Generate Learning Journey"}
          </button>
        </div>
      </div>
    </main>
  );
}

function ResultCard({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold text-gray-900">{title}</h2>
      <p className="whitespace-pre-line leading-7 text-gray-600">{content}</p>
    </section>
  );
}
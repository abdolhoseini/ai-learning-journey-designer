 "use client";

import { useState } from "react";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [showResult, setShowResult] = useState(false);

  const [businessNeed, setBusinessNeed] = useState("");
  const [audience, setAudience] = useState("");
  const [currentLevel, setCurrentLevel] = useState("");
  const [desiredSkill, setDesiredSkill] = useState("");
  const [constraints, setConstraints] = useState("");

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

  if (showResult) {
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
            A structured learning design based on the business need, learner
            profile, skill gap and practical constraints you provided.
          </p>

          <div className="grid gap-6">
            <ResultCard
              title="Business Need Summary"
              content={businessNeed}
            />

            <ResultCard
              title="Audience Profile"
              content={audience}
            />

            <ResultCard
              title="Identified Skill Gap"
              content={`Current state: ${currentLevel}\n\nDesired state: ${desiredSkill}`}
            />

            <ResultCard
              title="Learning Objectives"
              content={`1. Understand the key concepts related to the target skill.\n2. Apply the skill in realistic workplace scenarios.\n3. Evaluate quality and effectiveness of their own application.\n4. Use the skill consistently in day-to-day work.`}
            />

            <ResultCard
              title="Learning Journey"
              content={`1. Awareness and context\n2. Core knowledge\n3. Guided practice\n4. Real-world application\n5. Reflection and reinforcement`}
            />

            <ResultCard
              title="Assessment Approach"
              content={`Use scenario-based assessment, practical exercises and a workplace application task rather than relying only on knowledge quizzes.`}
            />

            <ResultCard
              title="Behaviour Change Goal"
              content={`Learners should demonstrate the target skill consistently in real work and be able to explain when and how to apply it effectively.`}
            />

            <ResultCard
              title="Impact Metrics"
              content={`• Completion and participation\n• Assessment performance\n• Self-reported confidence\n• Workplace application after 30 days\n• Manager or stakeholder feedback\n• Early indicators of improved task quality or efficiency`}
            />

            <ResultCard
              title="Constraints Considered"
              content={constraints}
            />
          </div>

          <div className="mt-10 flex gap-4">
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
      setShowResult(true);
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

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Back
          </button>

          <button
            onClick={handleContinue}
            disabled={!currentQuestion.value.trim()}
            className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {step < 5 ? "Continue" : "Generate Learning Journey"}
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
 import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      businessNeed,
      audience,
      currentLevel,
      desiredSkill,
      constraints,
    } = body;

    if (
      !businessNeed ||
      !audience ||
      !currentLevel ||
      !desiredSkill ||
      !constraints
    ) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key is not configured." },
        { status: 500 }
      );
    }

    const prompt = `
You are an expert Learning Experience Designer and Instructional Designer.

Your task is to design a concise, practical, learner-centred learning journey based only on the information provided by the user.

Business need:
${businessNeed}

Target audience:
${audience}

Current level:
${currentLevel}

Desired skill or behaviour:
${desiredSkill}

Constraints:
${constraints}

IMPORTANT QUALITY RULES:

- Do not invent context, job roles, business priorities, learner characteristics, locations, experience levels, or constraints that were not provided.
- If an input is numeric-only, extremely vague, ambiguous, meaningless, or insufficient to support a reliable learning design, do not guess what it means.
- If information is insufficient, explicitly state that the input is too vague and identify what needs clarification.
- Separate clearly what is directly supported by the user's input from what is an instructional design recommendation.
- Prefer cautious, evidence-aware phrasing over unsupported assumptions.
- Do not transform random numbers into fictional business meaning.
- Do not pretend to know organizational context that was not provided.

The learning design should:
- focus on skills application and behaviour change, not only knowledge transfer
- follow adult learning principles
- use practical workplace scenarios where appropriate
- be suitable for corporate learning
- consider accessibility, inclusivity and learner experience
- remain concise and practical
- avoid unnecessary jargon

Return ONLY valid JSON using exactly this structure:

{
  "businessNeedSummary": "string",
  "audienceProfile": "string",
  "identifiedSkillGap": "string",
  "learningObjectives": [
    "string"
  ],
  "learningJourney": [
    {
      "stage": "string",
      "purpose": "string",
      "activity": "string"
    }
  ],
  "assessmentApproach": "string",
  "behaviourChangeGoal": "string",
  "impactMetrics": [
    "string"
  ]
}
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "AI Learning Journey Designer",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.2,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("OpenRouter API error:", errorText);

      return NextResponse.json(
        {
          error: "Failed to generate learning journey.",
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    const text = data?.choices?.[0]?.message?.content ?? "";

    if (!text) {
      return NextResponse.json(
        { error: "OpenRouter returned an empty response." },
        { status: 500 }
      );
    }

    let cleanedText = text.trim();

    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();
    }

    let result;

    try {
      result = JSON.parse(cleanedText);
    } catch {
      console.error("Invalid JSON from OpenRouter:", text);

      return NextResponse.json(
        {
          error: "OpenRouter returned invalid JSON.",
          raw: text,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Generate learning journey error:", error);

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
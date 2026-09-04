 import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("BODY RECEIVED:", body);

    const {
      businessNeed,
      audience,
      currentLevel,
      desiredSkill,
      constraints,
    } = body;

    console.log({
      businessNeed,
      audience,
      currentLevel,
      desiredSkill,
      constraints,
    });

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

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Anthropic API key is not configured." },
        { status: 500 }
      );
    }

    const prompt = `
You are an expert Learning Experience Designer and Instructional Designer.

Design a concise, practical, learner-centred learning journey based on the information below.

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

The learning design must:
- focus on skills application and behaviour change, not only knowledge transfer
- follow adult learning principles
- use practical workplace scenarios where appropriate
- be suitable for corporate learning
- consider accessibility, inclusivity and learner experience
- avoid inventing facts that are not supported by the user's inputs

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

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Anthropic API error:", errorText);

      return NextResponse.json(
        {
          error: "Failed to generate learning journey.",
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    const text =
      data?.content?.[0]?.type === "text"
        ? data.content[0].text
        : "";

    if (!text) {
      return NextResponse.json(
        { error: "Claude returned an empty response." },
        { status: 500 }
      );
    }

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      console.error("Invalid JSON from Claude:", text);

      return NextResponse.json(
        {
          error: "Claude returned invalid JSON.",
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
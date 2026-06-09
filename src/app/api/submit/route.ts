import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getRecommendation } from "@/lib/recommend";
import { generateExplanation } from "@/lib/ai";
import { sendRecommendationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, qualification, experience, profession, careerGoal } = body;

    if (!name || !email || !qualification || !experience || !profession || !careerGoal) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // 1. Rules engine decides WHICH credential (deterministic, instant, free).
    const { recommendation, reason } = getRecommendation(
      qualification,
      experience,
      profession,
      careerGoal
    );

    // 2. AI writes a personalised explanation (free OpenRouter model),
    //    falling back to the rules-based reason if unavailable.
    const { reason: explanation, aiGenerated } = await generateExplanation(
      { name, qualification, experience, profession, careerGoal },
      recommendation,
      reason
    );

    // 3. Persist the submission.
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("submissions")
      .insert([
        {
          name,
          email,
          qualification,
          experience,
          profession,
          career_goal: careerGoal,
          recommendation,
          recommendation_reason: explanation,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to save submission." }, { status: 500 });
    }

    // 4. Fire off a confirmation email (non-blocking failure).
    const emailResult = await sendRecommendationEmail({
      to: email,
      name,
      recommendation,
      reason: explanation,
    });

    return NextResponse.json(
      { submission: data, aiGenerated, emailSent: emailResult.sent },
      { status: 201 }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

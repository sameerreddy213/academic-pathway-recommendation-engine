import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getRecommendation } from "@/lib/recommend";

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

    const { recommendation, reason } = getRecommendation(
      qualification,
      experience,
      profession,
      careerGoal
    );

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
          recommendation_reason: reason,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to save submission." }, { status: 500 });
    }

    return NextResponse.json({ submission: data }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

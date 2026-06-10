export type RecommendationResult = {
  recommendation: "Certification Program" | "DBA" | "PhD" | "Honorary Doctorate";
  reason: string;
};

const QUALIFICATION_RANK: Record<string, number> = {
  "High School / 12th": 1,
  Diploma: 2,
  "Bachelor's Degree": 3,
  "Master's Degree": 4,
  PhD: 5,
};

const EXPERIENCE_YEARS: Record<string, number> = {
  "0-1 years": 0.5,
  "2-4 years": 3,
  "5-9 years": 7,
  "10-14 years": 12,
  "15+ years": 20,
};

const RESEARCH_KEYWORDS = ["research", "academic", "teach", "professor", "scientist", "phd", "faculty"];
// NB: no bare "leadership" here — it would false-match "thought leadership",
// which is a recognition signal, not a business-degree signal.
const BUSINESS_KEYWORDS = ["business", "manag", "execut", "entrepren", "founder", "director", "ceo", "cfo", "coo", "finance", "consult"];
const UPSKILL_KEYWORDS = ["skill", "learn", "switch", "transition", "upskill", "career change", "new field"];
const RECOGNITION_KEYWORDS = ["recogni", "legacy", "impact", "influence", "thought leader", "expert", "authority"];

function matchesKeywords(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

function score(
  qualRank: number,
  expYears: number,
  profession: string,
  careerGoal: string
): Record<RecommendationResult["recommendation"], number> {
  const scores: Record<RecommendationResult["recommendation"], number> = {
    "Certification Program": 0,
    DBA: 0,
    PhD: 0,
    "Honorary Doctorate": 0,
  };

  // --- Certification Program ---
  if (expYears <= 3) scores["Certification Program"] += 3;
  if (qualRank <= 3) scores["Certification Program"] += 2;
  if (matchesKeywords(careerGoal, UPSKILL_KEYWORDS)) scores["Certification Program"] += 3;
  if (matchesKeywords(profession, UPSKILL_KEYWORDS)) scores["Certification Program"] += 1;

  // --- DBA ---
  if (expYears >= 5) scores["DBA"] += 3;
  if (expYears >= 10) scores["DBA"] += 2;
  if (qualRank >= 3) scores["DBA"] += 2;
  if (matchesKeywords(careerGoal, BUSINESS_KEYWORDS)) scores["DBA"] += 4;
  if (matchesKeywords(profession, BUSINESS_KEYWORDS)) scores["DBA"] += 3;

  // --- PhD ---
  if (qualRank >= 4) scores["PhD"] += 3;
  if (matchesKeywords(careerGoal, RESEARCH_KEYWORDS)) scores["PhD"] += 5;
  if (matchesKeywords(profession, RESEARCH_KEYWORDS)) scores["PhD"] += 3;
  if (expYears <= 10) scores["PhD"] += 1;

  // --- Honorary Doctorate ---
  if (expYears >= 15) scores["Honorary Doctorate"] += 5;
  if (expYears >= 10) scores["Honorary Doctorate"] += 2;
  if (matchesKeywords(careerGoal, RECOGNITION_KEYWORDS)) scores["Honorary Doctorate"] += 6;
  if (matchesKeywords(profession, RECOGNITION_KEYWORDS)) scores["Honorary Doctorate"] += 2;
  if (qualRank >= 3) scores["Honorary Doctorate"] += 1;

  return scores;
}

const REASONS: Record<
  RecommendationResult["recommendation"],
  (q: string, e: string, p: string, g: string) => string
> = {
  "Certification Program": (_, e, p, g) =>
    `With ${e} of experience${p ? ` as a ${p}` : ""}, a targeted certification program will rapidly validate your skills and help you ${g.toLowerCase() || "advance your career"} efficiently.`,
  DBA: (_, e, p, g) =>
    `Your ${e} of experience${p ? ` in ${p}` : ""} combined with your goal to ${g.toLowerCase() || "grow professionally"} makes a Doctor of Business Administration the ideal credential to unlock executive leadership opportunities.`,
  PhD: (q, e, p, g) =>
    `Your ${q} background${p ? ` and work as a ${p}` : ""} position you well for a PhD, which will deepen your expertise and enable you to ${g.toLowerCase() || "make a meaningful research contribution"}.`,
  "Honorary Doctorate": (_, e, p, g) =>
    `With ${e} of experience${p ? ` as a ${p}` : ""}, your career accomplishments and ambition to ${g.toLowerCase() || "make a lasting impact"} align perfectly with recognition through an Honorary Doctorate.`,
};

export function getRecommendation(
  qualification: string,
  experience: string,
  profession: string,
  careerGoal: string
): RecommendationResult {
  const qualRank = QUALIFICATION_RANK[qualification] ?? 3;
  const expYears = EXPERIENCE_YEARS[experience] ?? 3;

  const scores = score(qualRank, expYears, profession, careerGoal);

  const best = (
    Object.entries(scores) as [RecommendationResult["recommendation"], number][]
  ).reduce((a, b) => (b[1] > a[1] ? b : a))[0];

  return {
    recommendation: best,
    reason: REASONS[best](qualification, experience, profession, careerGoal),
  };
}

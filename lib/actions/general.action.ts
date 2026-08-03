"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { createAdminClient } from "@/lib/supabase/server";
import { feedbackSchema } from "@/constants";

// The Gemini model is configurable via env var so it can be swapped later
// without a code change. Falls back to the model used previously.
const FEEDBACK_MODEL = process.env.GEMINI_FEEDBACK_MODEL ?? "gemini-2.0-flash-001";

interface InterviewRow {
  id: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  questions: string[];
  finalized: boolean;
  user_id: string;
  created_at: string;
}

interface FeedbackRow {
  id: string;
  interview_id: string;
  user_id: string;
  total_score: number;
  category_scores: Feedback["categoryScores"];
  strengths: string[];
  areas_for_improvement: string[];
  final_assessment: string;
  created_at: string;
}

function mapInterview(row: InterviewRow): Interview {
  return {
    id: row.id,
    role: row.role,
    level: row.level,
    type: row.type,
    techstack: row.techstack,
    questions: row.questions,
    finalized: row.finalized,
    userId: row.user_id,
    createdAt: row.created_at,
  };
}

function mapFeedback(row: FeedbackRow): Feedback {
  return {
    id: row.id,
    interviewId: row.interview_id,
    totalScore: row.total_score,
    categoryScores: row.category_scores,
    strengths: row.strengths,
    areasForImprovement: row.areas_for_improvement,
    finalAssessment: row.final_assessment,
    createdAt: row.created_at,
  };
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript } = params;
  const supabase = createAdminClient();

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google(FEEDBACK_MODEL, {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const { data, error } = await supabase
      .from("interview_feedback")
      .upsert(
        {
          interview_id: interviewId,
          user_id: userId,
          total_score: object.totalScore,
          category_scores: object.categoryScores,
          strengths: object.strengths,
          areas_for_improvement: object.areasForImprovement,
          final_assessment: object.finalAssessment,
        },
        { onConflict: "interview_id,user_id" }
      )
      .select("id")
      .single();

    if (error) throw error;

    return { success: true, feedbackId: data.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("interviews")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  return mapInterview(data as InterviewRow);
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("interview_feedback")
    .select("*")
    .eq("interview_id", interviewId)
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  return mapFeedback(data as FeedbackRow);
}

// Other users' finalized interviews (available to take).
export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  // Guard against the original bug: an undefined/missing userId (e.g. no
  // session yet) previously caused a hard query error. Return an empty
  // result instead of querying with an invalid filter.
  if (!userId) return [];

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("interviews")
    .select("*")
    .eq("finalized", true)
    .neq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return null;

  return (data as InterviewRow[]).map(mapInterview);
}

// The current user's own interviews.
export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  if (!userId) return [];

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("interviews")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return null;

  return (data as InterviewRow[]).map(mapInterview);
}

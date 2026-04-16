"use client";

import { useState, useEffect, use } from "react";
import InfoTip from "@/components/InfoTip";

interface Question {
  id: string;
  question_id: string;
  question_text: string;
  description: string | null;
  category: string;
  capability: string | null;
  is_required: boolean;
  sort_order: number;
}

interface Answer {
  question_id: string;
  score: number | null;
  comment: string | null;
  flag: string | null;
}

export default function RespondPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [memberName, setMemberName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [responseStatus, setResponseStatus] = useState("");

  useEffect(() => {
    fetch(`/api/readiness/respond/${token}`)
      .then((r) => {
        if (!r.ok) throw new Error("Invalid link");
        return r.json();
      })
      .then((data) => {
        setMemberName(data.member.name);
        setQuestions(data.questions);
        setResponseStatus(data.response.status);
        if (data.response.status === "completed") setCompleted(true);
        // Load existing answers
        const existing: Record<string, Answer> = {};
        (data.answers || []).forEach((a: Answer & { question_id: string }) => {
          existing[a.question_id] = a;
        });
        setAnswers(existing);
        setLoading(false);
      })
      .catch(() => {
        setError("This link is invalid or has expired.");
        setLoading(false);
      });
  }, [token]);

  function setScore(questionId: string, score: number) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], question_id: questionId, score, flag: null },
    }));
  }

  function setFlag(questionId: string, flag: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        question_id: questionId,
        flag: prev[questionId]?.flag === flag ? null : flag,
      },
    }));
  }

  function setComment(questionId: string, comment: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], question_id: questionId, comment },
    }));
  }

  async function saveProgress() {
    setSaving(true);
    const answerList = Object.values(answers).filter((a) => a.score != null || a.flag != null || a.comment);
    await fetch(`/api/readiness/respond/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: answerList }),
    });
    setSaving(false);
  }

  async function handleSubmit() {
    setSaving(true);
    const answerList = Object.values(answers).filter((a) => a.score != null || a.flag != null || a.comment);
    await fetch(`/api/readiness/respond/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: answerList, complete: true }),
    });
    setCompleted(true);
    setSaving(false);
  }

  const answeredCount = Object.values(answers).filter((a) => a.score != null || a.flag === "not_applicable").length;
  const progress = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray">
      <p className="text-dark/40">Loading questionnaire...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray">
      <div className="bg-white rounded-lg border border-light-gray p-8 max-w-md text-center">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    </div>
  );

  if (completed) return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray">
      <div className="bg-white rounded-lg border border-light-gray p-8 max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto mb-4">
          &#10003;
        </div>
        <h1 className="text-xl font-bold mb-2">Thank You!</h1>
        <p className="text-sm text-dark/50">
          Your responses have been recorded. You can close this page.
        </p>
      </div>
    </div>
  );

  // Group questions by category
  const CATEGORY_LABELS: Record<string, string> = {
    dora_capability: "AI Readiness Capabilities",
    ai_policy: "AI Policy & Governance",
    role_specific: "Role-Specific Questions",
    workflow: "Workflow & Methodology",
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <div className="bg-primary text-white py-6 px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold">AI Readiness Assessment</h1>
          <p className="text-white/70 text-sm mt-1">
            Hi {memberName} — please answer each question on a 1-5 scale.
            <span className="ml-1 text-white/50 text-xs">1 = Strongly Disagree / Not at All &middot; 5 = Strongly Agree / Fully</span>
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="sticky top-0 bg-white border-b border-light-gray z-10">
        <div className="max-w-2xl mx-auto px-8 py-3 flex items-center justify-between">
          <span className="text-xs text-dark/50">{answeredCount}/{questions.length} answered</span>
          <div className="w-48 bg-light-gray rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <button onClick={saveProgress} disabled={saving} className="text-xs text-primary hover:underline disabled:opacity-50">
            {saving ? "Saving..." : "Save Progress"}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-6 space-y-6">
        {questions.map((q, i) => {
          const answer = answers[q.question_id];
          return (
            <div key={q.id} className="bg-white rounded-lg border border-light-gray p-5">
              <div className="flex items-start gap-3">
                <span className="text-xs text-dark/30 font-mono">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">{q.question_text}</p>
                  {q.description && <p className="text-xs text-dark/40 mb-3">{q.description}</p>}

                  {/* Likert scale */}
                  <div className="flex gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button key={score} onClick={() => setScore(q.question_id, score)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          answer?.score === score
                            ? "bg-primary text-white"
                            : "bg-light-gray text-dark/60 hover:bg-primary/10"
                        }`}>
                        {score}
                      </button>
                    ))}
                    <div className="flex items-center text-[10px] text-dark/30 ml-2">
                      <span>1 = Low</span>
                      <span className="mx-2">|</span>
                      <span>5 = High</span>
                    </div>
                  </div>

                  {/* Flags */}
                  <div className="flex gap-2 mb-2">
                    <button onClick={() => setFlag(q.question_id, "unclear")}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                        answer?.flag === "unclear"
                          ? "bg-amber-50 border-amber-300 text-amber-700"
                          : "border-light-gray text-dark/30 hover:border-amber-200"
                      }`}>
                      Flag as unclear
                    </button>
                    <button onClick={() => setFlag(q.question_id, "not_applicable")}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                        answer?.flag === "not_applicable"
                          ? "bg-gray-100 border-gray-300 text-gray-700"
                          : "border-light-gray text-dark/30 hover:border-gray-200"
                      }`}>
                      Not applicable to my role
                    </button>
                    <InfoTip text="Use 'Flag as unclear' if the question is confusing. Use 'Not applicable' if it doesn't relate to your work — it won't count against the score." />
                  </div>

                  {/* Comment */}
                  <input type="text" placeholder="Optional comment..."
                    value={answer?.comment || ""}
                    onChange={(e) => setComment(q.question_id, e.target.value)}
                    className="w-full border border-light-gray rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30" />
                </div>
              </div>
            </div>
          );
        })}

        <div className="text-center py-6">
          <button onClick={handleSubmit} disabled={saving || answeredCount === 0}
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50">
            {saving ? "Submitting..." : "Submit Responses"}
          </button>
          <p className="text-xs text-dark/30 mt-2">You can save progress and return later using the same link.</p>
        </div>
      </div>
    </div>
  );
}

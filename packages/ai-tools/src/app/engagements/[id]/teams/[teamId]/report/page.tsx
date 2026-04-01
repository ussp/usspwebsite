"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import BeforeAfterCard from "@/components/BeforeAfterCard";
import ImprovementBadge from "@/components/ImprovementBadge";
import RadarChart from "@/components/RadarChart";
import ResearchCitationCard from "@/components/ResearchCitationCard";
import type { TransformationReport } from "@ussp-platform/core";

export default function ReportPage() {
  const { teamId } = useParams<{ id: string; teamId: string }>();
  const [report, setReport] = useState<TransformationReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/reports/${teamId}`)
      .then(async (r) => {
        if (!r.ok) {
          const data = await r.json();
          setError(data.error || "Failed to load report");
          return;
        }
        setReport(await r.json());
      })
      .finally(() => setLoading(false));
  }, [teamId]);

  if (loading) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6">
          <p className="text-dark/40">Generating report...</p>
        </main>
      </>
    );
  }

  if (error || !report) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6">
          <div className="bg-white rounded-lg border border-light-gray p-8 text-center">
            <p className="text-dark/60">{error || "Report not available"}</p>
            <p className="text-xs text-dark/40 mt-2">
              Both baseline and post-training assessments must be completed to generate a report.
            </p>
          </div>
        </main>
      </>
    );
  }

  const doraCat = report.categories.find((c) => c.category === "dora");
  const scrumCat = report.categories.find((c) => c.category === "scrum");
  const spaceCat = report.categories.find((c) => c.category === "space");
  const devexCat = report.categories.find((c) => c.category === "devex");

  // SPACE radar data
  const spaceLabels = spaceCat?.deltas.map((d) => d.label) || [];
  const spaceBaseline = spaceCat?.deltas.map((d) => d.baseline_value) || [];
  const spacePost = spaceCat?.deltas.map((d) => d.post_value) || [];

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{report.team_name} - AI Transformation Report</h1>
          <p className="text-sm text-dark/50 mt-1">
            Client: {report.client_name} &middot; {report.engagement_name}
          </p>
          <p className="text-xs text-dark/40 mt-1">
            Baseline: {new Date(report.baseline_period.start).toLocaleDateString()} - {new Date(report.baseline_period.end).toLocaleDateString()}
            {" "}&middot;{" "}
            Post-Training: {new Date(report.post_period.start).toLocaleDateString()} - {new Date(report.post_period.end).toLocaleDateString()}
          </p>
        </div>

        {/* Overall score */}
        <div className="bg-white rounded-lg border border-light-gray p-6 mb-6">
          <div className="flex items-center gap-4 mb-3">
            <h2 className="text-lg font-semibold">Overall Improvement</h2>
            <ImprovementBadge value={report.overall_improvement_pct} size="lg" />
          </div>
          <div className="w-full bg-light-gray rounded-full h-3 mb-3">
            <div
              className="bg-primary rounded-full h-3 transition-all"
              style={{ width: `${Math.min(Math.max(report.overall_improvement_pct, 0), 100)}%` }}
            />
          </div>
          <p className="text-sm text-dark/60">{report.benchmark_context}</p>
        </div>

        {/* DORA Metrics */}
        {doraCat && doraCat.deltas.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">
              DORA Metrics
              <span className="text-sm font-normal text-dark/40 ml-2">
                Avg: <ImprovementBadge value={doraCat.avg_improvement_pct} size="sm" />
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doraCat.deltas.map((d) => (
                <BeforeAfterCard
                  key={d.metric_name}
                  label={d.label}
                  baselineValue={d.baseline_value}
                  postValue={d.post_value}
                  improvementPct={d.improvement_pct}
                  unit={d.unit}
                  direction={d.direction}
                />
              ))}
            </div>
          </div>
        )}

        {/* Scrum Metrics */}
        {scrumCat && scrumCat.deltas.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">
              Scrum Metrics
              <span className="text-sm font-normal text-dark/40 ml-2">
                Avg: <ImprovementBadge value={scrumCat.avg_improvement_pct} size="sm" />
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scrumCat.deltas.map((d) => (
                <BeforeAfterCard
                  key={d.metric_name}
                  label={d.label}
                  baselineValue={d.baseline_value}
                  postValue={d.post_value}
                  improvementPct={d.improvement_pct}
                  unit={d.unit}
                  direction={d.direction}
                />
              ))}
            </div>
          </div>
        )}

        {/* SPACE Radar + DevEx */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {spaceCat && spaceLabels.length > 0 && (
            <div className="bg-white rounded-lg border border-light-gray p-5">
              <h2 className="text-lg font-semibold mb-4">
                SPACE Survey
                <span className="text-sm font-normal text-dark/40 ml-2">
                  Avg: <ImprovementBadge value={spaceCat.avg_improvement_pct} size="sm" />
                </span>
              </h2>
              <RadarChart
                labels={spaceLabels}
                baselineValues={spaceBaseline}
                postValues={spacePost}
                maxValue={5}
                size={280}
              />
            </div>
          )}

          {devexCat && devexCat.deltas.length > 0 && (
            <div className="bg-white rounded-lg border border-light-gray p-5">
              <h2 className="text-lg font-semibold mb-4">
                Developer Experience
                <span className="text-sm font-normal text-dark/40 ml-2">
                  Avg: <ImprovementBadge value={devexCat.avg_improvement_pct} size="sm" />
                </span>
              </h2>
              <div className="space-y-4">
                {devexCat.deltas.map((d) => (
                  <div key={d.metric_name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{d.label}</span>
                      <ImprovementBadge value={d.improvement_pct} size="sm" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-light-gray rounded-full h-2">
                        <div
                          className="bg-gray-400 rounded-full h-2"
                          style={{ width: `${(d.baseline_value / 5) * 100}%` }}
                        />
                      </div>
                      <div className="flex-1 bg-light-gray rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2"
                          style={{ width: `${(d.post_value / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-dark/40 mt-0.5">
                      <span>Baseline: {d.baseline_value.toFixed(1)}</span>
                      <span>Post: {d.post_value.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Research benchmarks */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Research Context</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {report.benchmarks.map((b, i) => (
              <ResearchCitationCard
                key={i}
                source={b.source}
                finding={b.finding}
                year={b.year}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

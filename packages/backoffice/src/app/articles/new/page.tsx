"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [contentType, setContentType] = useState<"blog_post" | "case_study">(
    "blog_post"
  );
  const [linkedinCopied, setLinkedinCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const title = String(form.get("title"));
    const tagsRaw = String(form.get("tags") || "");

    const body: Record<string, unknown> = {
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      excerpt: form.get("excerpt") || null,
      body: form.get("body"),
      content_type: contentType,
      author: form.get("author") || null,
      featured_image_url: form.get("featured_image_url") || null,
      tags: tagsRaw
        ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      status: form.get("status") || "draft",
      published_at:
        form.get("status") === "published"
          ? form.get("published_at") || new Date().toISOString()
          : null,
      meta_title: form.get("meta_title") || null,
      meta_description: form.get("meta_description") || null,
      meta_keywords: form.get("meta_keywords") || null,
    };

    if (contentType === "case_study") {
      const csData: Record<string, string> = {};
      const cn = form.get("cs_client_name");
      const ind = form.get("cs_industry");
      const ch = form.get("cs_challenge");
      const sol = form.get("cs_solution");
      const res = form.get("cs_result");
      if (cn) csData.client_name = String(cn);
      if (ind) csData.industry = String(ind);
      if (ch) csData.challenge = String(ch);
      if (sol) csData.solution = String(sol);
      if (res) csData.result = String(res);
      if (Object.keys(csData).length > 0) {
        body.case_study_data = csData;
      }
    }

    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/articles");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create article");
      setSaving(false);
    }
  }

  function copyForLinkedIn(e: React.MouseEvent) {
    e.preventDefault();
    const form = (e.target as HTMLElement).closest("form");
    if (!form) return;
    const fd = new FormData(form);
    const title = fd.get("title") || "New Article";
    const excerpt = fd.get("excerpt") || "";
    const tagsRaw = String(fd.get("tags") || "");
    const hashtags = tagsRaw
      ? tagsRaw
          .split(",")
          .map((t) => `#${t.trim().replace(/\s+/g, "")}`)
          .filter((t) => t !== "#")
          .join(" ")
      : "";

    const slug = String(title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const post = `${title}\n\n${excerpt}\n\nhttps://www.ussp.co/insights/${slug}\n\n${hashtags}`.trim();
    navigator.clipboard.writeText(post);
    setLinkedinCopied(true);
    setTimeout(() => setLinkedinCopied(false), 2000);
  }

  const inputClass =
    "w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <h2 className="text-xl font-bold mb-6">New Article</h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-light-gray p-6 max-w-3xl space-y-5"
        >
          {error && (
            <p className="text-sm text-danger bg-danger/10 p-3 rounded-lg">
              {error}
            </p>
          )}

          {/* Content type selector */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Content Type *
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setContentType("blog_post")}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  contentType === "blog_post"
                    ? "bg-primary text-white"
                    : "bg-light-gray text-dark/70 hover:bg-dark/10"
                }`}
              >
                Blog Post
              </button>
              <button
                type="button"
                onClick={() => setContentType("case_study")}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  contentType === "case_study"
                    ? "bg-primary text-white"
                    : "bg-light-gray text-dark/70 hover:bg-dark/10"
                }`}
              >
                Case Study
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input name="title" required className={inputClass} />
          </div>

          {/* Author + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input
                name="author"
                placeholder="e.g. USSP Team"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select name="status" className={inputClass}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Published date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Published Date
            </label>
            <input type="datetime-local" name="published_at" className={inputClass} />
            <p className="text-xs text-dark/40 mt-1">
              Leave blank to use current date when publishing.
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium mb-1">Excerpt</label>
            <textarea
              name="excerpt"
              rows={2}
              placeholder="Short summary for article cards and social sharing"
              className={inputClass}
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Body (Markdown) *
            </label>
            <textarea
              name="body"
              required
              rows={16}
              placeholder="Write your article content in Markdown..."
              className={`${inputClass} font-mono`}
            />
            <p className="text-xs text-dark/40 mt-1">
              Supports: ## headings, ### subheadings, - bullet lists, paragraph
              breaks (blank line).
            </p>
          </div>

          {/* Featured image */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Featured Image URL
            </label>
            <input
              name="featured_image_url"
              type="url"
              placeholder="https://..."
              className={inputClass}
            />
            <p className="text-xs text-dark/40 mt-1">
              Recommended: 1200x627px for optimal LinkedIn/social sharing
              previews.
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <input
              name="tags"
              placeholder="AI, Healthcare, Staffing (comma-separated)"
              className={inputClass}
            />
          </div>

          {/* Case study fields (conditional) */}
          {contentType === "case_study" && (
            <fieldset className="border border-primary/20 rounded-lg p-4 space-y-4">
              <legend className="text-sm font-medium text-primary px-2">
                Case Study Details
              </legend>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Client Name
                  </label>
                  <input name="cs_client_name" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Industry
                  </label>
                  <input
                    name="cs_industry"
                    placeholder="e.g. Healthcare, Government"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Challenge
                </label>
                <textarea
                  name="cs_challenge"
                  rows={2}
                  placeholder="What problem did the client face?"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Solution
                </label>
                <textarea
                  name="cs_solution"
                  rows={2}
                  placeholder="What did USSP deliver?"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Result
                </label>
                <textarea
                  name="cs_result"
                  rows={2}
                  placeholder="What measurable outcome was achieved?"
                  className={inputClass}
                />
              </div>
            </fieldset>
          )}

          {/* SEO fields */}
          <fieldset className="border border-dark/10 rounded-lg p-4 space-y-4">
            <legend className="text-sm font-medium text-dark/60 px-2">
              SEO Settings
            </legend>
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Title
              </label>
              <input
                name="meta_title"
                placeholder="Custom SEO title (defaults to article title)"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Description
              </label>
              <textarea
                name="meta_description"
                rows={2}
                placeholder="Custom meta description for search engines (max 160 chars)"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Keywords
              </label>
              <input
                name="meta_keywords"
                placeholder="SEO keywords (comma-separated)"
                className={inputClass}
              />
            </div>
          </fieldset>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Article"}
            </button>
            <button
              type="button"
              onClick={copyForLinkedIn}
              className="px-4 py-2 bg-[#0A66C2] text-white text-sm rounded-lg hover:bg-[#004182] transition-colors"
            >
              {linkedinCopied ? "Copied!" : "Copy for LinkedIn"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm rounded-lg border border-light-gray hover:bg-light-gray transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

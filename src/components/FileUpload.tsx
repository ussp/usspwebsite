"use client";

import { useState, useRef, useCallback } from "react";

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

interface FileUploadProps {
  onUploaded: (path: string, fileName: string) => void;
}

export default function FileUpload({ onUploaded }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (file: File): string | null => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return "Only PDF, DOC, and DOCX files are allowed.";
    }
    if (file.size > MAX_SIZE) {
      return "File must be under 5MB.";
    }
    return null;
  };

  const upload = useCallback(async (file: File) => {
    const validationError = validate(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);
    setFileName(file.name);

    try {
      // Get signed upload URL
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const { signedUrl, token, path } = await res.json();

      // Upload to Supabase Storage via signed URL
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
          "x-upsert": "true",
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload file");
      }

      // Suppress unused variable warning - token is returned by API but not needed for PUT
      void token;

      onUploaded(path, file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setFileName(null);
    } finally {
      setUploading(false);
    }
  }, [onUploaded]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : fileName && !error
            ? "border-green-300 bg-green-50"
            : "border-dark/20 hover:border-primary/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          className="hidden"
        />

        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm text-dark/60 font-[family-name:var(--font-montserrat)]">
              Uploading {fileName}...
            </span>
          </div>
        ) : fileName && !error ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-green-800 font-[family-name:var(--font-montserrat)]">
              {fileName}
            </span>
          </div>
        ) : (
          <div>
            <svg className="w-8 h-8 mx-auto text-dark/30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-dark/60 font-[family-name:var(--font-montserrat)]">
              Drag & drop your resume, or <span className="text-primary underline">browse</span>
            </p>
            <p className="text-xs text-dark/40 mt-1 font-[family-name:var(--font-montserrat)]">
              PDF, DOC, or DOCX (max 5MB)
            </p>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 font-[family-name:var(--font-montserrat)]">
          {error}
        </p>
      )}
    </div>
  );
}

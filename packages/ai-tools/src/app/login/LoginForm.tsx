"use client";

import { signIn } from "next-auth/react";

interface LoginFormProps {
  tenantName: string;
  tagline: string | null;
  primaryColor: string | null;
  isOwner: boolean;
}

const isMicrosoft = process.env.NEXT_PUBLIC_AUTH_PROVIDER === "microsoft";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 21 21">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

export default function LoginForm({
  tenantName,
  tagline,
  primaryColor,
  isOwner,
}: LoginFormProps) {
  const providerId = isMicrosoft ? "microsoft-entra-id" : "google";
  const providerLabel = isMicrosoft
    ? "Sign in with Microsoft"
    : "Sign in with Google";

  return (
    <div className="min-h-screen flex items-center justify-center bg-near-black">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center">
        <h1 className="text-xl font-bold mb-1">AI Transformation Monitor</h1>
        <p className="text-sm text-dark/60 mb-2">by {tenantName}</p>
        {tagline && (
          <p
            className="text-[11px] uppercase tracking-wider font-semibold mb-3"
            style={primaryColor ? { color: primaryColor } : undefined}
          >
            {tagline}
          </p>
        )}
        <p className="text-xs text-dark/40 mb-8">
          Assess AI readiness, monitor transformation, govern with confidence.
        </p>
        <button
          onClick={() => signIn(providerId, { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-light-gray hover:bg-light-gray transition-colors text-sm font-medium"
        >
          {isMicrosoft ? <MicrosoftIcon /> : <GoogleIcon />}
          {providerLabel}
        </button>
        <p className="text-xs text-dark/40 mt-6">
          Access restricted to authorized {tenantName} users
        </p>
        {!isOwner && (
          <p className="text-[10px] text-dark/30 mt-4">
            Built on the USSP AI Transformation Platform
          </p>
        )}
      </div>
    </div>
  );
}

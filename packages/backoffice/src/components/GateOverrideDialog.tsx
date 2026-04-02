"use client";

interface GateResult {
  passed: boolean;
  gate: string;
  message: string;
  missingItems: string[];
}

interface GateOverrideDialogProps {
  gates: GateResult[];
  onConfirm: () => void;
  onCancel: () => void;
  canOverride: boolean;
  advancing: boolean;
}

export default function GateOverrideDialog({
  gates,
  onConfirm,
  onCancel,
  canOverride,
  advancing,
}: GateOverrideDialogProps) {
  const failedGates = gates.filter((g) => !g.passed);
  if (failedGates.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Missing Requirements</h3>
            <p className="text-sm text-dark/50">Documents are needed before advancing</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {failedGates.map((gate) => (
            <div
              key={gate.gate}
              className="p-3 bg-amber-50 border border-amber-200 rounded-lg"
            >
              <p className="text-sm font-medium text-amber-800">{gate.message}</p>
              {gate.missingItems.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {gate.missingItems.map((item) => (
                    <span
                      key={item}
                      className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={advancing}
            className="px-4 py-2 text-sm border border-light-gray rounded-lg hover:bg-light-gray transition-colors disabled:opacity-50"
          >
            Go Back
          </button>
          {canOverride && (
            <button
              onClick={onConfirm}
              disabled={advancing}
              className="px-4 py-2 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
            >
              {advancing ? "Advancing..." : "Advance Anyway"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

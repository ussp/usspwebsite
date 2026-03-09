"use client";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  destructive = false,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-dark/70 mt-2">{message}</p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-light-gray hover:bg-light-gray transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm rounded-lg text-white transition-colors ${
              destructive
                ? "bg-danger hover:bg-danger/90"
                : "bg-primary hover:bg-primary-dark"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

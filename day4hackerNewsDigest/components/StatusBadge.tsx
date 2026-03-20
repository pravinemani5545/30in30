import type { DigestStatus } from "@/types";

const statusStyles: Record<DigestStatus, { bg: string; text: string; label: string }> = {
  sent: { bg: "bg-success/15", text: "text-success", label: "Sent" },
  pending: { bg: "bg-amber/15", text: "text-amber", label: "Pending" },
  sending: { bg: "bg-amber/15", text: "text-amber", label: "Sending" },
  failed: { bg: "bg-error/15", text: "text-error", label: "Failed" },
};

export default function StatusBadge({ status }: { status: DigestStatus }) {
  const style = statusStyles[status];
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}

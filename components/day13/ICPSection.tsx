"use client";

interface ICPSectionProps {
  title: string;
  borderColor: string;
  children: React.ReactNode;
}

export function ICPSection({ title, borderColor, children }: ICPSectionProps) {
  return (
    <div
      className="rounded-md p-4"
      style={{
        backgroundColor: "var(--surface)",
        borderLeft: `3px solid ${borderColor}`,
      }}
    >
      <h3
        className="text-[11px] font-bold uppercase tracking-[0.1em] mb-3"
        style={{ color: borderColor }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

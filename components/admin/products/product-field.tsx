"use client";

interface ProductFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}

export function ProductField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: ProductFieldProps) {
  return (
    <div>
      <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-body"
      />
    </div>
  );
}

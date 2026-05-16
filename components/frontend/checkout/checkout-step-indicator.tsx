const STEPS = ["Shipping", "Payment", "Review"];

interface CheckoutStepIndicatorProps {
  step: number;
}

export function CheckoutStepIndicator({ step }: CheckoutStepIndicatorProps) {
  return (
    <div className="mb-10 flex items-center gap-3 overflow-x-auto">
      {STEPS.map((label, index) => (
        <div key={label} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-label font-bold transition-colors ${
                index <= step ? "text-white" : "bg-muted text-muted-foreground"
              }`}
              style={index <= step ? { background: "var(--brand-primary)" } : {}}
            >
              {index < step ? "✓" : index + 1}
            </div>
            <span
              className={`text-sm font-label font-medium ${
                index === step ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          </div>
          {index < STEPS.length - 1 && <div className="h-px w-16 bg-border" />}
        </div>
      ))}
    </div>
  );
}

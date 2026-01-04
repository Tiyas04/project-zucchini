interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  error?: string;
  required?: boolean;
  className?: string;
  readonly?: boolean;
  disabled?: boolean;
}

export default function RadioGroup({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  className = "",
  readonly = false,
  disabled = false,
}: RadioGroupProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium font-inria text-white mb-2">
        {label} {required && <span className="asterisk-icon">*</span>}
      </label>
      <div className="flex gap-3">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <div key={option.value} className="flex flex-col items-center gap-2">
              <label
                className={`
                  relative flex items-center justify-center cursor-pointer
                  w-6 h-6 rounded-lg transition-all duration-200
                  ${
                    isSelected
                      ? "border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                      : "border border-gray-500/60 hover:border-gray-400"
                  }
                  ${readonly || disabled ? "opacity-50 cursor-not-allowed" : ""}
                  bg-white/10
                `}
              >
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={readonly || disabled}
                  className="sr-only"
                />
                {/* Custom radio indicator */}
                {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
              </label>
              <span className="text-white text-sm font-medium">{option.label}</span>
            </div>
          );
        })}
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

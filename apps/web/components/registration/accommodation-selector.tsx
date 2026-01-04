import RadioGroup from "@/components/ui/radio-group";

interface AccommodationSelectorProps {
  wantsAccommodation: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
}

export default function AccommodationSelector({
  wantsAccommodation,
  onToggle,
  disabled = false,
}: AccommodationSelectorProps) {
  return (
    <div className="flex flex-col gap-2 items-start">
      <RadioGroup
        label="Accommodation Preference"
        name="accommodation"
        value={wantsAccommodation ? "required" : "not-required"}
        onChange={(value) => onToggle(value === "required")}
        options={[
          { value: "not-required", label: "Not Required" },
          { value: "required", label: "Required" },
        ]}
        required
        disabled={disabled}
      />
      <div className="text-xs text-white/60 flex gap-2 flex-col">
        <span>With Accomodation : ₹849</span>
        <span>Without Accomodation : ₹1099</span>
      </div>
    </div>
  );
}

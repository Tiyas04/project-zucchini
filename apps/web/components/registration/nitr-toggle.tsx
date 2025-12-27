interface NitrToggleProps {
  isNitrStudent: boolean;
  onToggle: (checked: boolean) => void;
}

export default function NitrToggle({ isNitrStudent, onToggle }: NitrToggleProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isNitrStudent}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
        />
        <span className="ml-2 text-sm font-semibold text-blue-900">I am from NIT Rourkela</span>
      </label>
      {isNitrStudent && (
        <p className="mt-2 text-xs text-blue-700">
          Your college information will be auto-filled and you won't need to pay registration fees.
        </p>
      )}
    </div>
  );
}

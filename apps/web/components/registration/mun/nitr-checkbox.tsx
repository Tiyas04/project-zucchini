interface NitrCheckboxProps {
  isNitrStudent: boolean;
  setIsNitrStudent: (value: boolean) => void;
  lockNitrStatus: boolean;
  stepTitle?: string;
  hideCommitteeChoice: boolean;
  portfolioMatrixUrl?: string;
}

export function NitrCheckbox({
  isNitrStudent,
  setIsNitrStudent,
  lockNitrStatus,
  stepTitle,
  hideCommitteeChoice,
  portfolioMatrixUrl,
}: NitrCheckboxProps) {
  return (
    <div className="space-y-3">
      {portfolioMatrixUrl && (
        <div className="text-center">
          <a
            href={portfolioMatrixUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline underline-offset-4 text-lg font-medium transition-colors"
          >
            View Portfolio Matrix
          </a>
        </div>
      )}

      <div className="border-2 border-white/40 rounded-[13px] p-3 bg-white/25 backdrop-blur-[9.25px]">
        <label
          className={`flex items-center ${lockNitrStatus ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          <input
            type="checkbox"
            checked={isNitrStudent}
            onChange={(e) => {
              if (!lockNitrStatus) {
                setIsNitrStudent(e.target.checked);
              }
            }}
            disabled={lockNitrStatus}
            className={`w-4 h-4 accent-white focus:ring-white/50 rounded ${lockNitrStatus ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          <span className={`ml-2 text-sm font-semibold text-white`}>
            {stepTitle ? `Is ${stepTitle} from NIT Rourkela?` : "I am from NIT Rourkela"}
          </span>
        </label>
        {lockNitrStatus && (
          <p className="mt-1.5 text-xs text-white/90">
            {isNitrStudent
              ? "The team leader is from NIT Rourkela, so all teammates must also be from NIT Rourkela."
              : "The team leader is not from NIT Rourkela, so no teammates can be from NIT Rourkela. You can be from any other college."}
          </p>
        )}
        {!lockNitrStatus && isNitrStudent && (
          <p className="mt-1.5 text-xs text-white/90">
            College information will be auto-filled and locked.
            {!hideCommitteeChoice && " You won't need to pay registration fees."}
          </p>
        )}
      </div>
    </div>
  );
}

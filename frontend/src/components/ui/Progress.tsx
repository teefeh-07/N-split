// Progress UI Component

interface ProgressProps {
  value: number;
  max?: number;
  showLabel?: boolean;
}

export function Progress({ value, max = 100, showLabel = false }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full">
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm text-gray-600 mt-1">{percentage.toFixed(0)}%</span>
      )}
    </div>
  );
}

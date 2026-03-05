interface LoadingProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeStyles = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-3",
};

export function Loading({ size = "md", label = "読み込み中..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8">
      <div
        className={`animate-spin rounded-full border-primary-500 border-t-transparent ${sizeStyles[size]}`}
      />
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  );
}

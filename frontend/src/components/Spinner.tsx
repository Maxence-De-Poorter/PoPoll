interface SpinnerProps {
  label?: string;
}

export default function Spinner({ label = "Chargement…" }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center gap-3 p-4 text-gray-600">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      <span>{label}</span>
    </div>
  );
}

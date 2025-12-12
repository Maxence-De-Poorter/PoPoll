type AlertVariant = "error" | "info" | "success";

interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
}

const styles: Record<AlertVariant, string> = {
  error: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  success: "bg-green-50 text-green-700 border-green-200",
};

export default function Alert({ variant = "info", children }: AlertProps) {
  return (
    <div className={`p-3 mb-4 rounded-lg border ${styles[variant]}`}>
      {children}
    </div>
  );
}

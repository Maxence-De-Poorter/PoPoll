interface OptionInputProps {
  value: string;
  index: number;
  onChange: (newValue: string) => void;
}

export default function OptionInput({ value, index, onChange }: OptionInputProps) {
  return (
    <input
      className="w-full p-2 mb-2 border rounded-lg"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Option ${index + 1}`}
    />
  );
}

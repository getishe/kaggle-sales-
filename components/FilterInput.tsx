"use client";

interface FilterInputProps {
  value: number;
  onThresholdChange: (value: number) => void;
}

export default function FilterInput({
  value,
  onThresholdChange,
}: FilterInputProps) {
  return (
    <div>
      <label className="label-text">Sales Threshold</label>
      <input
        type="number"
        min="0"
        value={value || ""}
        placeholder="e.g. 400000"
        onChange={(event) => onThresholdChange(Number(event.target.value))}
        className="input-field"
      />
      <p className="field-hint">Show only months with sales above this value.</p>
    </div>
  );
}

"use client";

interface FilterInputProps {
  onThresholdChange: (value: number) => void;
}

export default function FilterInput({ onThresholdChange }: FilterInputProps) {
  return (
    <div>
      <label className="label-text">Sales Threshold</label>
      <input
        type="number"
        min="0"
        placeholder="Enter threshold"
        onChange={(event) => onThresholdChange(Number(event.target.value))}
        className="input-field"
      />
    </div>
  );
}

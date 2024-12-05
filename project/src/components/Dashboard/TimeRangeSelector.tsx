import React from 'react';
import { TimeRange } from '../../types';

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ selectedRange, onRangeChange }: TimeRangeSelectorProps) {
  const ranges: { value: TimeRange; label: string }[] = [
    { value: '1M', label: '1 Mese' },
    { value: '3M', label: '3 Mesi' },
    { value: '6M', label: '6 Mesi' },
    { value: '1Y', label: '1 Anno' },
    { value: 'ALL', label: 'Tutto' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
      {ranges.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onRangeChange(value)}
          className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
            selectedRange === value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  allowCustom?: boolean;
  customPlaceholder?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Search or select...",
  disabled = false,
  error,
  allowCustom = true,
  customPlaceholder = "Enter custom value...",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value && !options.find((opt) => opt.value === value) && value !== "others") {
      setIsCustomMode(true);
      setCustomValue(value);
    }
  }, [value, options]);

  const handleSelect = (optionValue: string) => {
    if (optionValue === "others" && allowCustom) {
      setIsCustomMode(true);
      setIsOpen(false);
      setSearch("");
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearch("");
      setIsCustomMode(false);
    }
  };

  const handleCustomSubmit = () => {
    if (customValue.trim()) {
      onChange(customValue.trim());
    }
  };

  const handleBackToSelect = () => {
    setIsCustomMode(false);
    setCustomValue("");
    onChange("");
  };

  if (isCustomMode && allowCustom) {
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={customValue}
            onChange={(e) => {
              setCustomValue(e.target.value);
              onChange(e.target.value);
            }}
            onBlur={handleCustomSubmit}
            placeholder={customPlaceholder}
            disabled={disabled}
            className={`flex-1 w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          <button
            type="button"
            onClick={handleBackToSelect}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
          >
            ← Back
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between ${
          error ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-gray-300"} ${
          isOpen ? "ring-2 ring-blue-500 border-transparent" : ""
        }`}
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
          {selectedOption?.label || placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type to search..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`px-4 py-2 cursor-pointer transition-colors ${
                    option.value === value
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-gray-50 text-gray-700"
                  } ${option.value === "others" ? "border-t border-gray-100 font-medium text-blue-600" : ""}`}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-center">No matches found</div>
            )}
            {allowCustom && !filteredOptions.find((o) => o.value === "others") && (
              <div
                onClick={() => handleSelect("others")}
                className="px-4 py-2 cursor-pointer border-t border-gray-100 font-medium text-blue-600 hover:bg-gray-50"
              >
                + Enter custom college name
              </div>
            )}
          </div>
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

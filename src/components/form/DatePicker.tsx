"use client";
import { useState, useRef, useEffect, useCallback } from "react";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  disabled?: boolean;
  min?: string;
  max?: string;
  placeholder?: string;
  transparentBg?: boolean;
  id?: string;
  name?: string;
  className?: string;
}

const DatePicker = ({
  value,
  onChange,
  disabled = false,
  min,
  max,
  placeholder = "Select date",
  id,
  name,
  transparentBg = false,
  className = "",
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Sync currentMonth with value when dropdown opens
  useEffect(() => {
    if (isOpen && value) {
      const date = new Date(value);
      setCurrentMonth({ year: date.getFullYear(), month: date.getMonth() });
    }
  }, [isOpen, value]);

  const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const isDateDisabled = useCallback(
    (year: number, month: number, day: number) => {
      const dateStr = formatDate(year, month, day);
      if (min && dateStr < min) return true;
      if (max && dateStr > max) return true;
      return false;
    },
    [min, max],
  );

  const isToday = (year: number, month: number, day: number) => {
    const today = new Date();
    return (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    );
  };

  const isSelected = (year: number, month: number, day: number) => {
    if (!value) return false;
    const selected = new Date(value);
    return (
      year === selected.getFullYear() &&
      month === selected.getMonth() &&
      day === selected.getDate()
    );
  };

  const handleDateSelect = (year: number, month: number, day: number) => {
    if (isDateDisabled(year, month, day)) return;
    onChange(formatDate(year, month, day));
    setIsOpen(false);
  };

  const navigateMonth = (direction: number) => {
    setCurrentMonth((prev) => {
      let newMonth = prev.month + direction;
      let newYear = prev.year;
      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }
      return { year: newYear, month: newMonth };
    });
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const { year, month } = currentMonth;
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  // Build calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(i);
  }

  const displayValue = value
    ? new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div ref={containerRef} className={`relative`}>
      {/* Input Field */}
      <button
        type="button"
        id={id}
        name={name}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`${className} ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:border-pink-300"
        } ${isOpen ? "ring-2 ring-pink-500/20 border-pink-500" : ""}`}
      >
        {displayValue || placeholder}
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="font-semibold text-gray-900">
              {monthNames[month]} {year}
            </span>
            <button
              type="button"
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="h-10" />;
              }

              const disabled = isDateDisabled(year, month, day);
              const today = isToday(year, month, day);
              const selected = isSelected(year, month, day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDateSelect(year, month, day)}
                  disabled={disabled}
                  className={`h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selected
                      ? "bg-zPink text-white"
                      : today
                        ? "bg-pink-100 text-zPink"
                        : disabled
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-700 hover:bg-pink-50 hover:text-zPink"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Today Button */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const dateStr = formatDate(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate(),
                );
                if (!min || dateStr >= min) {
                  onChange(dateStr);
                  setIsOpen(false);
                }
              }}
              disabled={
                min
                  ? formatDate(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      new Date().getDate(),
                    ) < min
                  : false
              }
              className="w-full py-2 text-sm font-medium text-zPink hover:bg-pink-50 rounded-lg transition-colors disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;

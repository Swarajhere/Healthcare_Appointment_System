import React from "react";
import { Calendar } from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";

const DatePicker = ({ selectedDate, onSelectDate, minDate, maxDate }) => {
  // Generate dates from minDate to maxDate (tomorrow to 14 days from tomorrow)
  const dates = [];
  let currentDate = new Date(minDate);
  while (currentDate <= maxDate) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Select Date</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {dates.map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => onSelectDate(date)}
            className={`p-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isSameDay(date, selectedDate)
                ? "bg-blue-600 text-white"
                : "bg-gray-50 text-gray-700 hover:bg-blue-100"
            }`}
          >
            {format(date, "MMM d, yyyy")}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DatePicker;
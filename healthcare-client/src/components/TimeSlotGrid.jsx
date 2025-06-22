import React from "react";
import { format, parse, isBefore, addMinutes } from "date-fns";
import { Clock, X, CheckCircle, AlertCircle } from "lucide-react";

const TimeSlotGrid = ({ slots = [], onSelectSlot, selectedDate }) => {
  // Ensure slots is an array
  if (!Array.isArray(slots)) {
    console.warn('TimeSlotGrid: slots prop must be an array');
    return (
      <div className="bg-gray-50 rounded-2xl p-8 text-center">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Invalid Time Slots Format
        </h3>
        <p className="text-gray-600">
          There was an error loading the time slots. Please try again.
        </p>
      </div>
    );
  }
  // Use actual IST time
  const currentTime = new Date();
  const currentDate = format(currentTime, "yyyy-MM-dd");
  const formattedSelectedDate = format(new Date(selectedDate), "yyyy-MM-dd");

  if (!slots || slots.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl p-8 text-center">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Time Slots Available
        </h3>
        <p className="text-gray-600">
          No appointments are available for the selected date. Please choose a
          different date.
        </p>
      </div>
    );
  }

  const getSlotStatus = (slot) => {
    const slotDateTime = parse(
      `${formattedSelectedDate} ${slot.time}`,
      "yyyy-MM-dd HH:mm",
      new Date()
    );

    // Disable slots before current time + 15 minutes only for today
    const isPast =
      formattedSelectedDate === currentDate &&
      isBefore(slotDateTime, addMinutes(currentTime, 15));

    if (isPast) return "past";
    if (slot.status === "booked") return "booked";
    if (slot.status === "unavailable") return "unavailable";
    return "available";
  };

  const getSlotStyles = (status) => {
    switch (status) {
      case "available":
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 cursor-pointer transform hover:scale-105";
      case "booked":
        return "bg-red-50 text-red-700 border-red-200 cursor-not-allowed opacity-75";
      case "unavailable":
        return "bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed opacity-75";
      case "past":
        return "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-50";
      default:
        return "bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed";
    }
  };

  const getSlotIcon = (status) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4" />;
      case "booked":
        return <X className="h-4 w-4" />;
      case "unavailable":
        return <AlertCircle className="h-4 w-4" />;
      case "past":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getSlotLabel = (status) => {
    switch (status) {
      case "available":
        return "Available";
      case "booked":
        return "Booked";
      case "unavailable":
        return "Unavailable";
      case "past":
        return "Past";
      default:
        return "Unavailable";
    }
  };

  // Group slots by time period
  const morningSlots = slots.filter((slot) => {
    const hour = parseInt(slot.time.split(":")[0]);
    return hour >= 6 && hour < 12;
  });

  const afternoonSlots = slots.filter((slot) => {
    const hour = parseInt(slot.time.split(":")[0]);
    return hour >= 12 && hour < 17;
  });

  const eveningSlots = slots.filter((slot) => {
    const hour = parseInt(slot.time.split(":")[0]);
    return hour >= 17 && hour < 21;
  });

  const renderSlotGroup = (groupSlots, title, icon) => {
    if (groupSlots.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center mb-3">
          {icon}
          <h4 className="text-md font-medium text-gray-700 ml-2">{title}</h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {groupSlots.map((slot) => {
            const status = getSlotStatus(slot);
            const isDisabled = status !== "available";

            return (
              <button
                key={slot.time}
                onClick={() => !isDisabled && onSelectSlot(slot.time)}
                className={`
                  relative py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 
                  border-2 flex flex-col items-center space-y-1
                  ${getSlotStyles(status)}
                `}
                disabled={isDisabled}
                title={`${slot.time} - ${getSlotLabel(status)}`}
              >
                <div className="flex items-center space-x-1">
                  {getSlotIcon(status)}
                  <span className="font-semibold">{slot.time}</span>
                </div>
                <span className="text-xs opacity-75">
                  {getSlotLabel(status)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="bg-gray-50 rounded-2xl p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Legend:</h4>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
            <span className="text-gray-600">Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
            <span className="text-gray-600">Unavailable</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded opacity-50"></div>
            <span className="text-gray-600">Past Time</span>
          </div>
        </div>
      </div>

      {/* Time Slots */}
      {renderSlotGroup(
        morningSlots,
        "Morning (6:00 AM - 12:00 PM)",
        <Clock className="h-4 w-4 text-yellow-500" />
      )}

      {renderSlotGroup(
        afternoonSlots,
        "Afternoon (12:00 PM - 5:00 PM)",
        <Clock className="h-4 w-4 text-orange-500" />
      )}

      {renderSlotGroup(
        eveningSlots,
        "Evening (5:00 PM - 9:00 PM)",
        <Clock className="h-4 w-4 text-purple-500" />
      )}

      {/* No slots message */}
      {morningSlots.length === 0 &&
        afternoonSlots.length === 0 &&
        eveningSlots.length === 0 && (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No time slots available for the selected date.
            </p>
          </div>
        )}
    </div>
  );
};

export default TimeSlotGrid;

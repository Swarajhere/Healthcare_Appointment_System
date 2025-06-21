const addMinutes = (time, minutes) => {
    const [hours, mins] = time.split(":").map(Number);
    const date = new Date(1970, 0, 1, hours, mins);
    date.setMinutes(date.getMinutes() + minutes);
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };
  
  const generateSlots = (startTime, endTime, bookedSlots, unavailableSlots) => {
    const slots = [];
    let currentTime = startTime;
  
    while (currentTime < endTime) {
      const status = bookedSlots.includes(currentTime)
        ? "booked"
        : unavailableSlots.includes(currentTime)
        ? "unavailable"
        : "free";
      slots.push({ time: currentTime, status });
      currentTime = addMinutes(currentTime, 15);
    }
  
    return slots;
  };
  
  module.exports = { generateSlots };
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });
  const [bookingStatus, setBookingStatus] = useState(null);

  // Generate next 7 days
  const getNextSevenDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Fetch available slots for a selected date
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get(`/api/slots?date=${selectedDate.toISOString().split('T')[0]}`);
        // Ensure response.data is an array; fallback to empty array if not
        setSlots(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching slots:', error);
        setBookingStatus('Error fetching slots');
        setSlots([]); // Reset to empty array on error
      }
    };
    fetchSlots();
  }, [selectedDate]);

  // Handle booking submission
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setBookingStatus('Please select a slot');
      return;
    }
    try {
      const response = await axios.post('/api/bookings', {
        slotId: selectedSlot._id,
        userDetails,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedSlot.time,
      });
      setBookingStatus('Booking successful!');
      setUserDetails({ name: '', email: '' });
      setSelectedSlot(null);
    } catch (error) {
      setBookingStatus(error.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Book a Slot</h2>

      {/* Date Selection */}
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        {getNextSevenDays().map((date, index) => (
          <button
            key={index}
            onClick={() => setSelectedDate(date)}
            className={`px-4 py-2 rounded ${selectedDate.toDateString() === date.toDateString() ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </button>
        ))}
      </div>

      {/* Time Slots */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {Array.isArray(slots) && slots.length > 0 ? (
          slots.map((slot) => (
            <button
              key={slot._id}
              onClick={() => setSelectedSlot(slot)}
              disabled={slot.isBooked}
              className={`p-2 rounded ${slot.isBooked ? 'bg-gray-400 cursor-not-allowed' : selectedSlot?._id === slot._id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {slot.time}
            </button>
          ))
        ) : (
          <p className="text-gray-500">No slots available for this date.</p>
        )}
      </div>

      {/* Booking Form */}
      <form onSubmit={handleBooking} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={userDetails.name}
            onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={userDetails.email}
            onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Book Slot
        </button>
      </form>

      {/* Booking Status */}
      {bookingStatus && (
        <p className={`mt-4 ${bookingStatus.includes('Error') || bookingStatus.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
          {bookingStatus}
        </p>
      )}
    </div>
  );
};

export default Calendar;
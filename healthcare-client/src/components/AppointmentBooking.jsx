import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchDoctors,
  fetchAvailableSlots,
  bookAppointment,
} from "../features/appointments/appointmentsSlice";

function AppointmentBooking() {
  const dispatch = useDispatch();
  const { doctors, availableSlots, loading, error } = useSelector(
    (state) => state.appointments
  );
  const { user, token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ doctorId: "", slot: null });

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (formData.doctorId) {
      dispatch(fetchAvailableSlots({ doctorId: formData.doctorId }));
    }
  }, [dispatch, formData.doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.slot) return alert("Please select a slot");
    const { date, startTime, endTime } = formData.slot;
    const result = await dispatch(
      bookAppointment({ doctorId: formData.doctorId, date, startTime, endTime })
    );
    if (bookAppointment.fulfilled.match(result)) {
      alert("Appointment booked successfully!");
      setFormData({ doctorId: "", slot: null });
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const availableSlotsForTomorrow = availableSlots.filter(
    (slot) => slot.date === tomorrowStr
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Book Appointment
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Select Doctor</label>
          <select
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.doctorId}
            onChange={(e) =>
              setFormData({ ...formData, doctorId: e.target.value })
            }
            disabled={loading}
            required
          >
            <option value="">Choose a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name} ({doctor.specialty})
              </option>
            ))}
          </select>
        </div>
        {formData.doctorId && (
          <div>
            <label className="block text-gray-700">
              Available Slots for {tomorrowStr}
            </label>
            {loading ? (
              <p className="text-gray-600">Loading slots...</p>
            ) : availableSlotsForTomorrow.length === 0 ? (
              <p className="text-gray-600">No slots available for tomorrow</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableSlotsForTomorrow.map((slot, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`p-2 border rounded ${
                      formData.slot &&
                      formData.slot.startTime === slot.startTime
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 hover:bg-blue-100"
                    }`}
                    onClick={() => setFormData({ ...formData, slot })}
                  >
                    {slot.startTime} - {slot.endTime}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading || !formData.slot}
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
}

export default AppointmentBooking;

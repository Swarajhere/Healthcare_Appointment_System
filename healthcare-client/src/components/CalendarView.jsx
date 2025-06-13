import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { fetchAppointments } from "../features/appointments/appointmentsSlice";

function CalendarView() {
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector(
    (state) => state.appointments
  );
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && token) {
      dispatch(fetchAppointments({ userId: user._id, role: user.role }));
    }
  }, [dispatch, user, token]);

  const events = appointments.map((appt) => ({
    title: `${appt.patientId?.name || "Patient"} - ${appt.status}`,
    start: `${appt.date}T${appt.startTime}`,
    end: `${appt.date}T${appt.endTime}`,
    extendedProps: { doctorId: appt.doctorId },
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Appointment Calendar
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p className="text-gray-600">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-600">
          No appointments found. Book one to get started!
        </p>
      ) : (
        <FullCalendar
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          events={events}
          slotDuration="00:30:00"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridWeek,timeGridDay",
          }}
          className="border rounded p-4"
        />
      )}
    </div>
  );
}

export default CalendarView;

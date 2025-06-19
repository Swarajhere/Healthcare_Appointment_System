import React from "react";

const DoctorList = ({ doctors, onApprove, onReject }) => {
  if (!doctors || doctors.length === 0) {
    return <p>No pending doctors found.</p>;
  }

  return (
    <div className="space-y-4">
      {doctors.map((doctor) => (
        <div
          key={doctor._id}
          className="p-4 border rounded-lg flex justify-between items-center"
        >
          <div>
            <p className="font-medium">
              {doctor.firstName} {doctor.lastName}
            </p>
            <p className="text-sm text-gray-600">ID: {doctor._id}</p>
            <p className="text-sm text-gray-600">Email: {doctor.email}</p>
            <p className="text-sm text-gray-600">
              Specialty: {doctor.specialty}
            </p>
            <p className="text-sm text-gray-600">
              License: {doctor.licenseNumber}
            </p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => onApprove(doctor._id)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(doctor._id)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorList;

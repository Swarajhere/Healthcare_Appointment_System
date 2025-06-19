import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPendingDoctors,
  approveDoctor,
  rejectDoctor,
} from "../redux/slice/adminSlice";
import DoctorList from "../components/DoctorList";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { pendingDoctors, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchPendingDoctors());
  }, [dispatch]);

  const handleApprove = (doctorId) => {
    console.log("Approving doctor with ID:", doctorId);
    dispatch(approveDoctor(doctorId));
  };

  const handleReject = (doctorId) => {
    dispatch(rejectDoctor(doctorId));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DoctorList
          doctors={pendingDoctors}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

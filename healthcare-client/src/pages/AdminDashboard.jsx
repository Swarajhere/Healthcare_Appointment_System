import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPendingDoctors,
  approveDoctor,
  rejectDoctor,
} from "../redux/slice/adminSlice";
import {
  Shield,
  Users,
  Clock,
  Search,
  Filter,
  UserCheck,
  UserX,
  Stethoscope,
  Mail,
  Award,
  Loader2,
} from "lucide-react";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { pendingDoctors, loading } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");

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

  // Filter doctors based on search and specialty
  const filteredDoctors =
    pendingDoctors?.filter((doctor) => {
      const matchesSearch =
        doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty =
        !filterSpecialty || doctor.specialty === filterSpecialty;
      return matchesSearch && matchesSpecialty;
    }) || [];

  // Get unique specialties for filter
  const specialties = [
    ...new Set(pendingDoctors?.map((doctor) => doctor.specialty) || []),
  ];

  // Stats for pending applications and specialties
  const stats = [
    {
      title: "Pending Applications",
      value: pendingDoctors?.length || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Active Specialties",
      value: specialties.length,
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-3 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  Manage doctor applications and approvals
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-xl`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doctors by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={filterSpecialty}
                  onChange={(e) => setFilterSpecialty(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
                >
                  <option value="">All Specialties</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredDoctors.length} of {pendingDoctors?.length || 0}{" "}
              applications
            </div>
          </div>
        </div>

        {/* Doctor List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Pending Doctor Applications
              </h2>
              {loading && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading...</span>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading doctor applications...</p>
              </div>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Applications Found
                </h3>
                <p className="text-gray-600">
                  {pendingDoctors?.length === 0
                    ? "There are no pending doctor applications at the moment."
                    : "No applications match your current search criteria."}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Stethoscope className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Dr. {doctor.firstName} {doctor.lastName}
                          </h3>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {doctor.specialty}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {doctor.email}
                          </div>
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-1" />
                            License: {doctor.licenseNumber}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleApprove(doctor.id)}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                      >
                        <UserCheck className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(doctor.id)}
                        className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                      >
                        <UserX className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

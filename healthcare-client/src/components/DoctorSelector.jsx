import { useState } from "react";
import { Search, Stethoscope, Filter, User, Activity } from "lucide-react";

const DoctorSelector = ({ doctors, onSelectDoctor }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");

  const specialties = [...new Set(doctors.map((doctor) => doctor.specialty))];

  const filteredDoctors = doctors.filter(
    (doctor) =>
      (doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!filterSpecialty || doctor.specialty === filterSpecialty)
  );

  if (!doctors.length) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Doctors Available
          </h3>
          <p className="text-gray-600">
            There are no doctors available at the moment. Please try again
            later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-600" />
            <input
              type="text"
              placeholder="Search doctors by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Specialty Filter */}
          <div className="relative w-full lg:w-auto lg:min-w-[220px]">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-600 pointer-events-none z-10" />
            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="w-full pl-12 pr-10 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none text-gray-900 cursor-pointer"
            >
              <option value="">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex items-center text-sm text-blue-700">
          <Activity className="h-4 w-4 mr-2" />
          <span>
            {filteredDoctors.length} doctor
            {filteredDoctors.length !== 1 ? "s" : ""} available
          </span>
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Doctors Found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-full group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                  <Stethoscope className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-900 transition-colors duration-200">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h3>
                  <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
                    {doctor.specialty}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectDoctor(doctor.id)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-200 font-medium shadow-sm hover:shadow-md transform active:scale-95"
              >
                Select Doctor
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorSelector;

import React, { useState } from 'react';

// Static user data
const staticUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  age: 30,
  gender: 'Male',
};

const Profile = () => {
  const [user] = useState(staticUser);
  const [error] = useState(null);

  // Handle edit profile (placeholder)
  const handleEditProfile = () => {
    alert('Edit profile functionality to be implemented');
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.firstName} {user.lastName}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        {/* User Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
            <span className="text-gray-600 font-medium">Age:</span>
            <span className="text-gray-800">{user.age}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
            <span className="text-gray-600 font-medium">Gender:</span>
            <span className="text-gray-800">{user.gender}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
            <span className="text-gray-600 font-medium">Email:</span>
            <span className="text-gray-800">{user.email}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleEditProfile}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
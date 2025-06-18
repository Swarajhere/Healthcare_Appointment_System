import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../api/profile";
import { User, Edit3, Check, X, Weight, Ruler } from "lucide-react";
import { toast } from "react-hot-toast";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user?.id);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Profile: Fetching profile, userId:", userId);
        const response = await getUserProfile(dispatch);
        console.log("Profile: getUserProfile response:", response);

        if (response.success) {
          setUser(response.user);
          setEditData(response.user);
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        console.error("Profile: Fetch error:", err.message);
        setFetchError(err.message);
        toast.error(err.message);
        if (
          err.message.includes("Session expired") ||
          err.message.includes("unauthorized")
        ) {
          navigate("/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    } else {
      console.log("Profile: No userId, checking localStorage");
      const token = localStorage.getItem("token");
      if (token) {
        fetchProfile();
      } else {
        setFetchError("Please log in to view your profile.");
        setLoading(false);
        toast.error("Please log in.");
        navigate("/login", { replace: true });
      }
    }
  }, [userId, dispatch, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (editData?.weight && (editData.weight <= 0 || editData.weight > 500)) {
      newErrors.weight = "Weight must be between 1-500 kg";
    }

    if (editData?.height && (editData.height <= 0 || editData.height > 300)) {
      newErrors.height = "Height must be between 1-300 cm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditProfile = () => {
    setEditData(user);
    setErrors({});
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (validateForm()) {
      try {
        const response = await updateUserProfile(
          userId,
          {
            weight: editData.weight || null,
            height: editData.height || null,
          },
          dispatch
        );
        console.log("Profile: updateUserProfile response:", response);

        if (response.success) {
          setUser(response.user);
          setIsEditing(false);
          toast.success("Profile updated successfully");
        } else {
          toast.error(response.message);
          if (
            response.message.includes("Session expired") ||
            response.message.includes("unauthorized")
          ) {
            navigate("/login", { replace: true });
          }
        }
      } catch (err) {
        console.error("Profile: Update error:", err.message);
        toast.error("Failed to update profile");
        navigate("/login", { replace: true });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditData(user);
    setErrors({});
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const calculateBMI = () => {
    if (!user?.weight || !user?.height) return "N/A";
    const heightInMeters = user.height / 100;
    return (user.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (fetchError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">
          Error: {fetchError || "Unable to load profile"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 transform transition-all duration-500 hover:shadow-3xl">
        <div className="relative p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl text-white">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              <User size={32} />
            </div>
            <h2 className="mt-4 text-3xl font-bold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-blue-100 text-sm font-medium mt-1">
              {user.email}
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={handleEditProfile}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-110"
            >
              <Edit3 size={20} />
            </button>
          )}
        </div>
        <div className="p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                <span className="text-gray-500 text-sm font-medium">Age</span>
                <p className="text-2xl font-bold text-gray-800">{user.age}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                <span className="text-gray-500 text-sm font-medium">
                  Gender
                </span>
                <p className="text-2xl font-bold text-gray-800">
                  {user.gender}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Weight size={20} className="text-blue-500" />
                Health Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Weight size={16} className="text-blue-600" />
                    <span className="text-blue-600 text-sm font-medium">
                      Weight
                    </span>
                  </div>
                  {isEditing ? (
                    <div>
                      <input
                        type="number"
                        value={editData.weight || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "weight",
                            parseFloat(e.target.value) || null
                          )
                        }
                        className={`w-full px-3 py-2 rounded-lg border text-lg font-bold ${
                          errors.weight
                            ? "border-red-300 bg-red-50 text-red-700"
                            : "border-gray-300 bg-white text-gray-800"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="kg"
                      />
                      {errors.weight && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.weight}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-800">
                      {user.weight ? `${user.weight} kg` : "Not set"}
                    </p>
                  )}
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Ruler size={16} className="text-green-600" />
                    <span className="text-green-600 text-sm font-medium">
                      Height
                    </span>
                  </div>
                  {isEditing ? (
                    <div>
                      <input
                        type="number"
                        value={editData.height || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "height",
                            parseFloat(e.target.value) || null
                          )
                        }
                        className={`w-full px-3 py-2 rounded-lg border text-lg font-bold ${
                          errors.height
                            ? "border-red-300 bg-red-50 text-red-700"
                            : "border-gray-300 bg-white text-gray-800"
                        } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        placeholder="cm"
                      />
                      {errors.height && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.height}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-800">
                      {user.height ? `${user.height} cm` : "Not set"}
                    </p>
                  )}
                </div>
              </div>
              {!isEditing && (
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-600 text-sm font-medium">
                      BMI
                    </span>
                    <span className="text-2xl font-bold text-gray-800">
                      {calculateBMI()}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          calculateBMI() === "N/A"
                            ? 0
                            : Math.min(
                                (parseFloat(calculateBMI()) / 35) * 100,
                                100
                              )
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 font-medium shadow-lg"
                  >
                    <Check size={20} />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 font-medium shadow-lg"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditProfile}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium shadow-lg"
                >
                  <Edit3 size={20} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

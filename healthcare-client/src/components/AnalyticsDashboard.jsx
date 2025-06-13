import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Line } from "react-chartjs-2";
import { fetchAnalytics } from "../features/analytics/analyticsSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function AnalyticsDashboard() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.analytics);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAnalytics({ token }));
  }, [dispatch, token]);

  const chartData = {
    labels: data?.labels || ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Appointments Booked",
        data: data?.booked || [120, 150, 180, 200, 170, 190],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
      },
      {
        label: "Appointments Canceled",
        data: data?.canceled || [20, 25, 30, 15, 10, 20],
        borderColor: "#F44336",
        backgroundColor: "rgba(244, 67, 54, 0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Appointment Trends (2025)" },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Count" } },
      x: { title: { display: true, text: "Month" } },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Analytics Dashboard
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p className="text-gray-600">Loading analytics...</p>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
}

export default AnalyticsDashboard;

import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const HealthCard: React.FC<{
  title: string;
  color: string;
  data?: { date: string; value: number }[];
}> = ({ title, color, data }) => {
  // Define static chart data if no data is available
  const chartData = {
    labels: data?.map((entry) => entry.date) || [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
    ],
    datasets: [
      {
        label: title,
        data: data?.map((entry) => entry.value) || [120, 130, 125, 140, 135], // Sample values
        borderColor: `#${color}-600`,
        backgroundColor: `#${color}-200`,
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  return (
    <div
      className={`p-4 border-l-4 border-${color}-500 bg-white shadow rounded-lg`}
    >
      <h3 className={`text-${color}-600 font-semibold`}>{title}</h3>

      {/* Chart Section */}
      <div className="mt-4">
        <Line data={chartData} />
      </div>

      {/* Data List */}
      <ul className="mt-2 text-sm text-gray-700">
        {data?.length ? (
          data.map((entry, index) => (
            <li key={index} className="flex justify-between border-b py-1">
              <span>{entry.date}</span>
              <span className="font-medium">{entry.value}</span>
            </li>
          ))
        ) : (
          <>
          <li className="flex justify-between border-b py-1">
            <span>12-02-2025</span>
            <span className="font-medium">12</span>
          </li>
          <li className="flex justify-between border-b py-1">
            <span>12-02-2025</span>
            <span className="font-medium">12</span>
          </li>
          <li className="flex justify-between border-b py-1">
            <span>12-02-2025</span>
            <span className="font-medium">12</span>
          </li>
          <li className="flex justify-between border-b py-1">
            <span>12-02-2025</span>
            <span className="font-medium">12</span>
          </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default HealthCard;

import React, { useMemo } from "react";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
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

// Extracted Chart Component
const HealthChart: React.FC<{
  title: string;
  chartData: {
    labels: string[];
    datasets: any[]
  };
}> = ({ title, chartData }) => {
  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false }
          },
          y: {
            grid: {
              color: '#f3f4f6', // Light gray grid lines
              drawBorder: false
            }
          }
        }
      }}
    />
  );
};

const HealthCard: React.FC<{
  title: string;
  color: string;
  data?: { date: string; value: number }[];
  metrics?: any[];
  metricKey?: string;
}> = ({ title, color, data, metrics, metricKey }) => {
  // Process metrics data if available
  const processedData = useMemo(() => {
    if (metrics && metricKey) {
      // Sort metrics by date and take the last 5 entries
      const sortedMetrics = [...metrics]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
        .reverse(); // Reverse to maintain chronological order

      return {
        labels: sortedMetrics.map((metric) =>
          new Date(metric.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
          })
        ),
        values: sortedMetrics.map((metric) => metric[metricKey]),
      };
    }
    return null;
  }, [metrics, metricKey]);

  // Define chart data
  const chartData = {
    labels: processedData?.labels || data?.map((entry) => entry.date) || ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: title,
        data: processedData?.values || data?.map((entry) => entry.value) || [120, 130, 125, 140, 135],
        borderColor: "#0077BE", // Bright Professional Blue
        backgroundColor: "rgba(0, 119, 190, 0.2)", // Soft transparent version
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  // Determine which data to show in the list
  const listData = processedData
    ? processedData.labels.map((date, index) => ({
        date,
        value: processedData.values[index]
      }))
    : data || [
        { date: "12-02-2025", value: 12 },
        { date: "12-02-2025", value: 12 },
        { date: "12-02-2025", value: 12 },
        { date: "12-02-2025", value: 12 },
      ];

  return (
    <div className="p-4 bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-300">
      <h3 className={`text-${color}-600 font-semibold mb-4`}>{title}</h3>

      {/* Chart Section */}
      <div className="mt-2">
        <HealthChart
          title={title}
          chartData={chartData}
        />
      </div>
    </div>
  );
};

export default HealthCard;
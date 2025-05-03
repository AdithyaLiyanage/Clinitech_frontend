import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PatientsChart: React.FC = () => {
  const patientData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'New Patients',
        data: [30, 50, 40, 60, 75, 85, 80, 70, 65, 90, 110, 120],
        borderColor: '#32a852',
        backgroundColor: 'rgba(50, 168, 82, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Return Patients',
        data: [20, 35, 25, 50, 60, 65, 70, 85, 55, 75, 95, 100],
        borderColor: '#32a8e5',
        backgroundColor: 'rgba(50, 168, 229, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-6 w-full max-w-xl">
      <h3 className="text-xl font-semibold mb-4">Patients (New vs Return)</h3>
      <Line data={patientData} options={{ responsive: true }} />
    </div>
  );
};

export default PatientsChart;

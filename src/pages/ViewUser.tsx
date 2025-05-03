import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlusCircle, FaEdit, FaTrash } from "react-icons/fa";
import { FaUserAlt, FaHeartbeat, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import PatientUpdateModal from "../components/PatientUpdateModal"; // Import the modal
import Sidebar from "../components/Sidebar"; // Import the new Sidebar component

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

const ViewUser: React.FC = () => {
  interface Patient {
    _id: string;
    fullName: string;
    DOB: string;  // Date of Birth as a string (ISO format ideally)
    age: number;
    gender: string;
    bloodType: string;
    contactNumber: string;
    guardian: {
      fullName: string;
    };
  }

  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get<Patient[]>("http://localhost:3000/api/patients/");
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, []);

  const openEditModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);  // Open the modal
  };

  const closeEditModal = () => {
    setIsModalOpen(false);  // Close the modal
  };

  const updatePatient = async (updatedPatient: Patient) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Authorization token is missing");
        return;
      }
  
      console.log("Updating patient:", updatedPatient);
      const response = await axios.put(
        `http://localhost:3000/api/patients/patients/${updatedPatient._id}`, // Updated port number
        updatedPatient,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Update response:", response.data);
  
      setPatients(prevPatients =>
        prevPatients.map(patient =>
          patient._id === updatedPatient._id ? response.data : patient
        )
      );
      closeEditModal();
    } catch (error: any) {
      console.error("Error updating patient:", error.response?.data || error.message);
    }
  };

  const deletePatient = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/patients/patients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(prevPatients =>
        prevPatients.filter(patient => patient._id !== id)
      );
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  // Available Beds Chart Data
  const availableBedsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Occupied',
      data: [30, 50, 45, 60, 75, 55, 80, 60, 45, 70, 65, 90],
      borderColor: 'rgba(52, 144, 235, 1)',
      backgroundColor: 'rgba(52, 144, 235, 0.6)',
      tension: 0.3
    }, {
      label: 'Reserved',
      data: [20, 25, 30, 35, 40, 45, 50, 50, 45, 40, 35, 30],
      borderColor: 'rgba(103, 204, 255, 1)',
      backgroundColor: 'rgba(103, 204, 255, 0.6)',
      tension: 0.3
    }, {
      label: 'Available',
      data: [50, 40, 50, 60, 50, 60, 45, 50, 60, 40, 50, 40],
      borderColor: 'rgba(255, 206, 86, 1)',
      backgroundColor: 'rgba(255, 232, 186, 0.6)',
      tension: 0.3
    }]
  };

  // Patients by Gender Pie Chart Data
  const patientsByGenderData = {
    labels: ['Male', 'Female', 'Children'],
    datasets: [{
      data: [60, 30, 10],
      backgroundColor: ['#69aff3', '#5363a0', '#a9b5da'],
      borderColor: ['#1f1f1f', '#1f1f1f', '#1f1f1f'],
      borderWidth: 1
    }]
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar /> {/* Add Sidebar here */}

        {/* Main Content */}
        <div className="flex-1 ml-[250px] p-6 bg-gray-100">
          {/* Dashboard */}
          <div className="bg-blue-500 p-6 text-white rounded-lg relative"
            style={{
              backgroundImage: 'linear-gradient(to right, #4481EB, #04BEFE)'
            }}>
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold">
                Good Morning, Welcome To CliniTech
              </h2>
              <p className="text-lg mt-2">Your schedule today.</p>
              <div className="flex flex-wrap gap-4 mt-6">
                {/* Stats Cards */}
                <div className="bg-white text-blue-500 px-4 py-2 rounded-lg shadow flex items-center">
                  <FaUserAlt className="w-8 h-8 mr-4" />
                  <div>
                    <p className="text-2xl font-bold">9</p>
                    <p className="text-sm">Patients</p>
                  </div>
                </div>

                <div className="bg-white text-blue-500 px-4 py-2 rounded-lg shadow flex items-center">
                  <FaHeartbeat className="w-8 h-8 mr-4" />
                  <div>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-sm">Surgeries</p>
                  </div>
                </div>

                <div className="bg-white text-blue-500 px-4 py-2 rounded-lg shadow flex items-center">
                  <FaSignOutAlt className="w-8 h-8 mr-4" />
                  <div>
                    <p className="text-2xl font-bold">2</p>
                    <p className="text-sm">Discharges</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          {/* Charts Section */}
<div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
  {/* Available Beds Chart */}
  <div className="bg-white p-6 rounded-lg lg:col-span-2 shadow-lg">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">Available Beds</h3>
    <div className="h-[300px]">
      <Line data={availableBedsData} options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }} />
    </div>
  </div>

  {/* Patients by Gender Pie Chart */}
  <div className="bg-white p-6 rounded-lg lg:col-span-2 shadow-lg">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">Patients by Gender</h3>
    <div className="h-[300px] flex justify-center items-center">
      <Pie data={patientsByGenderData} options={{
        responsive: true,
        maintainAspectRatio: false
      }} />
    </div>
  </div>

  {/* Detail Card with Button */}
  <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Final Bill Estimator</h3>
      <p className="text-gray-600 mb-4">
      Quickly estimate the patient’s total bill using treatment, medication, and stay details. Fast and accurate billing made simple.
      </p>
    </div>
    <button 
      onClick={() => window.location.href = "http://127.0.0.1:5000/"} 
      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
    >
      Calculate Bill
    </button>
  </div>
</div>

          {/* Patient Management */}
          <div className="mt-6">
            <h1 className="text-2xl font-bold mb-6">Patient Management</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guardian Full Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(patient.DOB).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.bloodType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.contactNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.guardian.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex space-x-2">
                        <button onClick={() => openEditModal(patient)} className="text-blue-600 hover:text-blue-900">
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button onClick={() => deletePatient(patient._id)} className="text-red-600 hover:text-red-900">
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600">{patients.length} patients total</div>

            {/* Floating Add Button */}
            <button onClick={() => navigate("/patientregistration")} className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600">
              <FaPlusCircle className="h-8 w-8" />
            </button>
          </div>

          {/* Hospital Stats Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-blue-400 text-white p-4 rounded-lg shadow flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold">639</p>
                <p>Appointments</p>
              </div>
              <div className="text-white">
                <FaEdit className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-blue-400 text-white p-4 rounded-lg shadow flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold">83</p>
                <p>Doctors</p>
              </div>
              <div className="text-white">
                <FaEdit className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-blue-400 text-white p-4 rounded-lg shadow flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold">296</p>
                <p>Staff</p>
              </div>
              <div className="text-white">
                <FaEdit className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-blue-400 text-white p-4 rounded-lg shadow flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold">49</p>
                <p>Operations</p>
              </div>
              <div className="text-white">
                <FaEdit className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-blue-400 text-white p-4 rounded-lg shadow flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold">372</p>
                <p>Admitted</p>
              </div>
              <div className="text-white">
                <FaEdit className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-blue-400 text-white p-4 rounded-lg shadow flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold">253</p>
                <p>Discharged</p>
              </div>
              <div className="text-white">
                <FaEdit className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && selectedPatient && (
        <PatientUpdateModal patient={selectedPatient} onClose={closeEditModal} onUpdate={updatePatient} />
      )}
    </Layout>
  );
};

export default ViewUser;

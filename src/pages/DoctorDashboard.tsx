import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useAuth } from "../context/AuthContext";
import { FaFilePen } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import axios from "axios"; // Import axios

const DoctorDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const doctorId = user?._id;
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [patients, setPatients] = useState<any[]>([]); // Define state to store patient data
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Function to fetch patient data
    const fetchPatients = async () => {
        try {
            // Replace with your actual API endpoint
            const response = await axios.get(`/api/doctor/${doctorId}/patients`);
            setPatients(response.data); // Set fetched data to state
        } catch (error) {
            console.error("Error fetching patient data:", error);
        }
    };

    // Fetch patients when the component mounts
    useEffect(() => {
        fetchPatients();
    }, [doctorId]); // Re-run if doctorId changes

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Hello, <span className="text-purple-600">Dr. {user?.fullName || "User"}!</span>{" "}
                        <span className="block sm:inline text-gray-800">Welcome to your Dashboard</span>
                    </h1>

                    <button
                        className="bg-red-500 hover:bg-red-600 transition text-white py-2 px-4 rounded-md flex items-center gap-2"
                        onClick={handleLogout}
                    >
                        <CiLogout className="text-xl" />
                        <span>Logout</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                        <h2 className="text-lg font-semibold">Visits for Today</h2>
                        <p className="text-5xl font-bold mt-2">12</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-400 text-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                        <h2 className="text-lg font-semibold">New Patients</h2>
                        <p className="text-5xl font-bold mt-2">4</p>
                    </div>
                    <div className="bg-gradient-to-r from-red-500 to-red-400 text-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                        <h2 className="text-lg font-semibold">Old Patients</h2>
                        <p className="text-5xl font-bold mt-2">8</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                        <h3 className="text-xl font-bold text-gray-800">
                            Your Patients List
                        </h3>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Search patients..."
                                    className="w-full border border-gray-300 rounded-full py-2 px-4 pl-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Patient Name</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Age</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Gender</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Blood Type</th>
                                    <th className="text-right py-3 px-4 font-semibold text-sm text-gray-600">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients && patients.length > 0 ? (
                                    patients.map((patient) => (
                                        <tr key={patient._id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-gray-800 font-medium">
                                                {patient.name}
                                            </td>
                                            <td className="py-3 px-4 text-gray-800">
                                                {patient.age}
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">
                                                {patient.gender}
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">
                                                {patient.bloodtype}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    className="bg-purple-600 text-white py-2 px-3 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 flex items-center gap-1"
                                                    onClick={() => viewPatientDetails(patient._id)}
                                                >
                                                    <FaFilePen className="text-sm" /> View Dashboard
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-500">
                                            No Patient Details
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                        <p className="text-sm text-gray-600">Showing <span className="font-medium">2</span> of <span className="font-medium">2</span> appointments</p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50">
                                <IoIosArrowBack className="text-lg" />
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50">
                                <IoIosArrowForward className="text-lg" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;

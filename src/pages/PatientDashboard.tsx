import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import HealthCard from "../components/HealthCard";
import InfoCard from "../components/InfoCard";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import profile from "../assets/profile.jpg";

interface PatientData {
  _id: string;
  fullName: string;
  gender: string;
  age: number;
  bloodType: string;
  profilePic: string | null;
}

interface HealthMetric {
  _id: string;
  patientID: string;
  date: string;
  hbA1c: number;
  fastingGlucose: number;
  totalCholesterol: number;
  hdlC: number;
  ldlC: number;
  triglycerides: number;
  tgLdlRatio: number;
  eGFR: number;
  uAlbCreatinineRatio: number;
}

const PatientDashboard: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMetricId, setCurrentMetricId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    hbA1c: "",
    fastingGlucose: "",
    totalCholesterol: "",
    hdlC: "",
    ldlC: "",
    triglycerides: "",
    tgLdlRatio: "",
    eGFR: "",
    uAlbCreatinineRatio: "",
  });

  // Fetch Patient Data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<PatientData>(
          `/api/patients/patients/${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPatient(response.data);
      } catch (error) {
        console.error("Error fetching patient data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId]);

  // Fetch Health Metrics
  useEffect(() => {
    const fetchHealthMetrics = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<HealthMetric[]>(
          `/api/patientsMedical/${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHealthMetrics(response.data);
      } catch (error) {
        console.error("Error fetching health metrics", error);
      }
    };

    fetchHealthMetrics();
  }, [patientId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (isEditing && currentMetricId) {
        // Update existing record
        const response = await axios.put(
          `/api/patientsMedical/${currentMetricId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update the metrics list with the edited record
        setHealthMetrics((metrics) =>
          metrics.map((metric) =>
            metric._id === currentMetricId ? { ...response.data } : metric
          )
        );

        alert("Health metrics updated successfully!");
      } else {
        // Create new record
        const newEntry = {
          patientID: patientId,
          date: new Date().toISOString(),
          ...formData,
        };

        const response = await axios.post("/api/patientsMedical/", newEntry, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Update state to reflect the new entry in the table
        setHealthMetrics((prev) => [...prev, response.data]);

        alert("Health metrics added successfully!");
      }

      setShowForm(false);
      setIsEditing(false);
      setCurrentMetricId(null);
      resetForm();
    } catch (error) {
      console.error("Error submitting health metrics", error);
      alert("Failed to save health metrics");
    }
  };

  const handleEdit = (metric: HealthMetric) => {
    // Populate form with the data from the selected metric
    const editData = {
      hbA1c: metric.hbA1c.toString(),
      fastingGlucose: metric.fastingGlucose.toString(),
      totalCholesterol: metric.totalCholesterol.toString(),
      hdlC: metric.hdlC.toString(),
      ldlC: metric.ldlC.toString(),
      triglycerides: metric.triglycerides.toString(),
      tgLdlRatio: metric.tgLdlRatio.toString(),
      eGFR: metric.eGFR.toString(),
      uAlbCreatinineRatio: metric.uAlbCreatinineRatio.toString(),
    };

    setFormData(editData);
    setCurrentMetricId(metric._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/patientsMedical/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Remove the deleted metric from state
        setHealthMetrics((metrics) =>
          metrics.filter((metric) => metric._id !== id)
        );

        alert("Record deleted successfully");
      } catch (error) {
        console.error("Error deleting record", error);
        alert("Failed to delete record");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      hbA1c: "",
      fastingGlucose: "",
      totalCholesterol: "",
      hdlC: "",
      ldlC: "",
      triglycerides: "",
      tgLdlRatio: "",
      eGFR: "",
      uAlbCreatinineRatio: "",
    });
  };

  const handleAddNew = () => {
    resetForm();
    setIsEditing(false);
    setCurrentMetricId(null);
    setShowForm(true);
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;

  return (
    <div className="mx-auto p-6 bg-gray-50 rounded-lg shadow-md w-full relative">
      {/* Patient Info */}
      <div className="flex items-center gap-6 p-4 bg-white rounded-lg shadow">
        <img
          src={profile}
          alt={patient?.fullName}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <InfoCard label="Patient Name" value={patient?.fullName} icon="👤" />
          <InfoCard label="Gender" value={patient?.gender} icon="⚧" />
          <InfoCard label="Patient Age" value={patient?.age} icon="🎂" />
          <InfoCard label="Blood Type" value={patient?.bloodType} icon="🩸" />
          <div className="flex items-center justify-center">
            <button
              className="flex items-center gap-2 bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700"
              onClick={handleAddNew}
            >
              <FaPlus size={15} />
              <span>Add Medical Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <HealthCard title="BP Levels" color="red" />
        <HealthCard title="Sugar Levels" color="blue" />
        <HealthCard title="Heart Rate" color="green" />
        <HealthCard title="Cholesterol" color="yellow" />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <h2 className="text-lg font-semibold mb-4 text-center">
              {isEditing ? "Edit Health Metrics" : "Add Health Metrics"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              {Object.keys(formData).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium">{key}</label>
                  <input
                    type="number"
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              ))}
              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {isEditing ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Health Metrics Table */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Health Metrics History</h2>
        {healthMetrics.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Date</th>
                  {Object.keys(formData).map((key) => (
                    <th key={key} className="border p-2">
                      {key}
                    </th>
                  ))}
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {healthMetrics.map((metric) => (
                  <tr key={metric._id} className="border hover:bg-gray-50">
                    <td className="border p-2">
                      {new Date(metric.date).toLocaleDateString()}
                    </td>
                    {Object.keys(formData).map((key) => (
                      <td key={key} className="border p-2">
                        {metric[key]}
                      </td>
                    ))}
                    <td className="border p-2">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => handleEdit(metric)}
                          className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(metric._id)}
                          className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">No health metrics available.</p>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;

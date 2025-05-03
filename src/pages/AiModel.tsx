import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaUserAlt, FaWeight, FaRuler, FaHeartbeat } from "react-icons/fa";

const AiModel = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [cholesterol, setCholesterol] = useState("");
  const [hbA1c, setHbA1c] = useState("");
  const [bloodPressureSystolic, setBloodPressureSystolic] = useState("");
  const [bloodPressureDiastolic, setBloodPressureDiastolic] = useState("");
  const [predictionLabel, setPredictionLabel] = useState("");
  const [bmi, setBmi] = useState(0);
  const [bmiStatus, setBmiStatus] = useState("");

  const { patientId } = useParams(); // Replace with the actual patient ID

  useEffect(() => {
    // Fetch patient details by ID
    const fetchPatientDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        const response = await axios.get(
          `/api/patients/patients/${patientId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { age, gender } = response.data;
        setAge(age);
        setGender(gender);
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    };
    const fetchPatientMedical = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        const response = await axios.get(`/api/patientsMedical/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const max = response.data.length - 1; // Get the last index of the array
        const { hbA1c, totalCholesterol } = response.data[max];
        setHbA1c(hbA1c);
        setCholesterol(totalCholesterol);
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    };

    fetchPatientDetails();
    fetchPatientMedical();
  }, [patientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

      // Prepare the request body
      const requestBody = {
        age,
        gender,
        weight,
        height,
        cholesterol,
        hbA1c,
        blood_pressure_systolic: bloodPressureSystolic,
        blood_pressure_diastolic: bloodPressureDiastolic,
      };

      // Make the POST request
      const response = await axios.post("http://127.0.0.1:5000/api/predict", {
        age,
        gender,
        weight,
        height,
        cholesterol,
        hbA1c,
        blood_pressure_systolic: bloodPressureSystolic,
        blood_pressure_diastolic: bloodPressureDiastolic,
      }); // Adjust the URL as needed

      // Log the response to the console
      console.log("Prediction Response:", response.data);

      // Optionally, handle the response (e.g., update state or display a message)
      setPredictionLabel(response.data.prediction || "No prediction available");
      setBmi(response.data.bmi || 0);
      setBmiStatus(response.data.bmi_status || "");
    } catch (error) {
      console.error("Error making prediction request:", error);
      alert("Failed to generate prediction. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        Health Condition Anomaly Detection
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg space-y-6"
      >
        <div className="space-y-6">
          {/* Health Information Section */}
          <div>
            <h2 className="text-xl font-semibold text-blue-700">
              Health Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label
                  htmlFor="age"
                  className="text-sm font-medium text-gray-700 flex items-center"
                >
                  <FaUserAlt className="mr-2" /> Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="age"
                  name="age"
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="gender"
                  className="text-sm font-medium text-gray-700 flex items-center"
                >
                  <FaUserAlt className="mr-2" /> Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="gender"
                  name="gender"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>

          {/* Vital Measurements Section */}
          <div>
            <h2 className="text-xl font-semibold text-blue-700">
              Vital Measurements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label
                  htmlFor="weight"
                  className="text-sm font-medium text-gray-700 flex items-center"
                >
                  <FaWeight className="mr-2" /> Weight (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="weight"
                  name="weight"
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="height"
                  className="text-sm font-medium text-gray-700 flex items-center"
                >
                  <FaRuler className="mr-2" /> Height (meters)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="height"
                  name="height"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>

          {/* Cholesterol and HbA1c Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label
                htmlFor="cholesterol"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                <FaHeartbeat className="mr-2" /> Cholesterol (mg/dL)
              </label>
              <input
                type="number"
                value={cholesterol}
                onChange={(e) => setCholesterol(e.target.value)}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="cholesterol"
                name="cholesterol"
                min="1"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="hbA1c"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                <FaHeartbeat className="mr-2" /> HbA1c (%)
              </label>
              <input
                type="number"
                value={hbA1c}
                onChange={(e) => setHbA1c(e.target.value)}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="hbA1c"
                name="hbA1c"
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Blood Pressure Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label
                htmlFor="blood_pressure_systolic"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                <FaHeartbeat className="mr-2" /> Blood Pressure (Systolic)
              </label>
              <input
                type="number"
                value={bloodPressureSystolic}
                onChange={(e) => setBloodPressureSystolic(e.target.value)}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="blood_pressure_systolic"
                name="blood_pressure_systolic"
                min="1"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="blood_pressure_diastolic"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                <FaHeartbeat className="mr-2" /> Blood Pressure (Diastolic)
              </label>
              <input
                type="number"
                value={bloodPressureDiastolic}
                onChange={(e) => setBloodPressureDiastolic(e.target.value)}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="blood_pressure_diastolic"
                name="blood_pressure_diastolic"
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Generate Prediction
          </button>
        </div>
      </form>

      {/* Display the result */}
      {predictionLabel && (
        <div className="mt-8 p-6 bg-blue-100 text-blue-700 rounded-lg shadow-lg">
          {predictionLabel === "Health Issue Detected" ? (
            <div className="text-red-500">
              <h4 className="text-xl font-semibold">
                Prediction Result: {predictionLabel}
              </h4>
            </div>
          ) : (
            <div className="text-green-500">
              <h4 className="text-xl font-semibold">
                Prediction Result: {predictionLabel}
              </h4>
            </div>
          )}
          <p>
            <strong>BMI Index:</strong> {bmi.toFixed(2)}
          </p>
          <p>
            <strong>BMI Status:</strong> {bmiStatus}
          </p>
        </div>
      )}
    </div>
  );
};

export default AiModel;

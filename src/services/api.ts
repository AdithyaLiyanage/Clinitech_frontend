import axios from "axios";

// Base URL configured via env variable
const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: backendURL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Fetch patient details
export const getPatientById = async (patientId: string) => {
  return api.get(`/api/bills/patient/${patientId}`);
};

// ✅ Add a sub-bill to MainBill
export const addSubBill = async (
  patientId: string, 
  dailyAmount: number,
  hospitalServices: string[] = [],
  treatments: string[] = []
) => {
  return api.post("/api/bills/bill", { patientId, dailyAmount, hospitalServices, treatments });
};

// ✅ Checkout patient & update final amount (if insurance is provided)
// services/api.ts
export const checkoutPatient = async (
  patientId: string,
  insuranceCoverage: string,
  amountDue: number
) => {
  const response = await api.put(`/api/bills/checkout/${patientId}`, {
    insuranceCoverage: parseFloat(insuranceCoverage),
    amountDue,
  });
  return response.data; // expected format: { success: true, data: updatedBill }
};

export const getPatientBill = async (patientId: string) => {
  const response = await api.get(`/api/bills/bill/patient/${patientId}`);
  return response.data; // expected format: { success: true, data: bill }
};

export const getHospitalServices = async () => {
  const response = await api.get('/api/bills/hospitalservices');
  return response.data; // expected format: { success: true, data: array of services }
};

// ✅ Fetch treatments from the new collection
export const getTreatments = async () => {
  const response = await api.get('/api/bills/treatments');
  return response.data; // expected format: { success: true, data: array of treatments }
};

export const createSMSRecord = async (
  patientId: string,
  billId: string,
  message: string
) => {
  return api.post("/api/bills/sms", { patientId, billId, message });
};

export const getSMSMessages = async (patientId: string) => {
  const response = await api.get(`/api/bills/sms/${patientId}`);
  return response.data; // expected format: { success: true, data: array of SMS messages }
};


export default api;

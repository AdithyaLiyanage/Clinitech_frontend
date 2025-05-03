import axios from "axios";

// Base URL configured via env variable
const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: backendURL,
  headers: { "Content-Type": "application/json" },
});

// Fetch patient details
export const getPatientById = async (patientId: string) => {
  return api.get(`/api/bills/patient/${patientId}`);
};

// Add a sub-bill to MainBill
export const addSubBill = (
  patientId: string,
  dailyAmount: number,
  hospitalServices: string[] = [],
  treatments: string[] = []
) =>
  api.post("/api/bills/bill", {
    patientId,
    dailyAmount,
    hospitalServices,
    treatments,
  });

// Checkout patient & update final amount (if insurance is provided)
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

// Fetch treatments from the new collection
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

export const editBill = async (
  billId: string,
  updateData: {
    hospitalServices?: string[];
    treatments?: string[];
    insuranceCoverage?: number;
    isCheckedOut?: boolean;
  }
) => {
  const response = await api.put(`/api/bills/bill/${billId}`, updateData);
  return response.data; // { success: true, data: updatedBill }
};

// Delete a main bill entirely
export const deleteBill = async (billId: string) => {
  const response = await api.delete(`/api/bills/bill/${billId}`);
  return response.data; // { success: true, message: "Bill deleted" }
};

// ——— New: Sub-bill CRUD ———

// Edit a single sub-bill’s daily amount
export const editSubBill = async (
  billId: string,
  subBillId: string,
  updateData: {
    dailyAmount: number;
    hospitalServices?: string[];
    treatments?: string[];
  }
) => {
  const response = await api.put(
    `/api/bills/bill/${billId}/subbill/${subBillId}`,
    updateData
  );
  return response.data; // { success: true, data: updatedBill }
};

// Delete a single sub-bill
export const deleteSubBill = async (
  billId: string,
  subBillId: string
) => {
  const response = await api.delete(
    `/api/bills/bill/${billId}/subbill/${subBillId}`
  );
  return response.data;
};

export const sendReportByEmail = async (
  patientId: string,
  html: string,
  to: string,
  logoDataUrl: string
) => {
  return api.post(`/api/bills/bill/${patientId}/email-report`, {
    html,
    to,
    logoDataUrl,
  });
};



export default api;

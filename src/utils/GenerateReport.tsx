import { FC, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Logo from "../assets/logo.png";
import { getPatientById, sendReportByEmail } from "../services/api";

interface SubBill {
  createdAt: string;
  hospitalServices: string[];
  treatments: string[];
  dailyAmount: number;
}

interface Bill {
  _id: string;
  patientId: string;
  createdAt: string;
  subBills: SubBill[];
  insuranceCoverage: number;
  finalAmount: number;
}

export interface Guardian {
  fullName: string;
  NIC: string;
  contactNumber: string;
  relation: string;
}

export interface PatientDetails {
  fullName: string;
  preferredName: string;
  DOB: string;
  age: number;
  gender: string;
  bloodType: string;
  NIC: string;
  address: string;
  contactNumber: string;
  email: string;
  maritalStatus: string;
  occupation: string;
  guardian: Guardian;
}

interface GenerateReportProps {
  bill: Bill | null;
}

const GenerateReport: FC<GenerateReportProps> = ({ bill }) => {
  const [logoDataUrl, setLogoDataUrl] = useState<string>("");
  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const [loadingPatient, setLoadingPatient] = useState<boolean>(false);
  const [sending, setSending] = useState(false);

  // Load logo once
  useEffect(() => {
    fetch(Logo)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setLogoDataUrl(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      })
      .catch((err) => console.error("Error loading logo:", err));
  }, []);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!bill?.patientId) return;

      setLoadingPatient(true);
      try {
        const res = await getPatientById(bill.patientId);
        console.log("→ getPatientById response:", res);
        console.log("→ res.data:", res.data);
        console.log("→ res.data.data:", res.data?.data);

        const pd = res.data?.data ?? null;
        setPatient(pd);
      } catch (err) {
        console.error("Error fetching patient:", err);
        setPatient(null);
      } finally {
        setLoadingPatient(false);
      }
    };

    fetchPatient();
  }, [bill]);

  const fmtDateTime = (iso: string): string =>
    new Date(iso).toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const fmtDate = (iso: string): string =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const buildHtmlReport = (
          b: Bill,
          p: PatientDetails | null,
          logoSrc: string   // either a data URL or "cid:clinitech_logo"
        ): string => {
    const rows = b.subBills
      .map(
        (sb, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${fmtDateTime(sb.createdAt)}</td>
        <td>${sb.hospitalServices.join(", ")}</td>
        <td>${sb.treatments.join(", ")}</td>
        <td style="text-align:right;">${sb.dailyAmount.toLocaleString()}</td>
      </tr>`
      )
      .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Medical Report – Patient ${b.patientId}</title>
<style>
  body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
  .header { display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #333; padding-bottom:10px; }
  .header img { height:80px; }
  .patient-details { margin-top:30px; }
  .patient-details table { width:100%; border-collapse:collapse; }
  .patient-details td { padding:6px 8px; vertical-align:top; }
  .patient-details td:first-child { width:180px; font-weight:600; }
  table { width:100%; border-collapse:collapse; margin-top:20px; }
  th, td { border:1px solid #666; padding:8px 12px; text-align:left; }
  th { background:#f2f2f2; }
  .summary { margin-top:20px; text-align:right; }
</style>
</head>
<body>
  <div class="header">
    <img src="${logoSrc}" alt="Hospital Logo" />
    <div>
      <h2>CliniTech Hospital</h2>
      <p><strong>Report Date:</strong> ${fmtDateTime(b.createdAt)}</p>
      <p><strong>Patient ID:</strong> ${b.patientId}</p>
    </div>
  </div>

  ${
    p
      ? `<div class="patient-details">
    <h3>Patient Details</h3>
    <table>
      <tr><td>Full Name:</td><td>${p.fullName}</td></tr>
      <tr><td>Preferred Name:</td><td>${p.preferredName}</td></tr>
      <tr><td>N.I.C:</td><td>${p.NIC}</td></tr>
      <tr><td>Date of Birth:</td><td>${fmtDate(p.DOB)}</td></tr>
      <tr><td>Age:</td><td>${p.age}</td></tr>
      <tr><td>Gender:</td><td>${p.gender}</td></tr>
      <tr><td>Blood Type:</td><td>${p.bloodType}</td></tr>
      <tr><td>Marital Status:</td><td>${p.maritalStatus}</td></tr>
      <tr><td>Occupation:</td><td>${p.occupation}</td></tr>
      <tr><td>Address:</td><td>${p.address}</td></tr>
      <tr><td>Contact Number:</td><td>${p.contactNumber}</td></tr>
      <tr><td>Email:</td><td>${p.email}</td></tr>
      <tr><td>Guardian:</td><td>
        ${p.guardian.fullName} (${p.guardian.relation})<br/>
        NIC: ${p.guardian.NIC}<br/>
        Contact: ${p.guardian.contactNumber}
      </td></tr>
    </table>
  </div>`
      : `<p style="margin-top:30px;"><em>Loading patient details…</em></p>`
  }

  <h3 style="margin-top:30px;">Itemized Charges</h3>
  <table>
    <thead>
      <tr>
        <th>#</th><th>Date</th><th>Hospital Services</th><th>Treatments</th><th>Daily Amount (Rs.)</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="summary">
    <p><strong>Insurance Coverage:</strong> Rs. ${b.insuranceCoverage.toLocaleString()}</p>
    <p style="font-size:1.2em;"><strong>Total Amount Due:</strong> Rs. ${b.finalAmount.toLocaleString()}</p>
  </div>

  <p style="margin-top:40px;">Thank you for trusting CliniTech Hospital.</p>
</body>
</html>`;
  };

  const handleGenerateAndSend = async () => {
    if (!bill) return alert("No bill loaded.");
    if (!patient) return alert("Patient data still loading.");

    const htmlForDownload = buildHtmlReport(bill, patient, logoDataUrl);

    // a) Trigger browser download
    const blob = new Blob([htmlForDownload], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medical_report_${bill.patientId}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    // b) Send email
    const htmlForEmail = buildHtmlReport(bill, patient, "cid:clinitech_logo");
    setSending(true);
    try {
      await sendReportByEmail(bill.patientId, htmlForEmail, patient.email, logoDataUrl);
      alert(`Report emailed to ${patient.email}`);
    } catch (err) {
      console.error(err);
      alert("Failed to send email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<DescriptionOutlinedIcon />}
      onClick={handleGenerateAndSend}
      sx={{ borderRadius: 2, textTransform: "none" }}
      disabled={!bill || loadingPatient || sending}
    >
      {sending ? "Sending…" : "Generate & Email Report"}
    </Button>
  );
};

export default GenerateReport;

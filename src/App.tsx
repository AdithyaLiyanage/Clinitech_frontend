import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DoctorLogin from "./components/DoctorLogin";
import { AuthProvider } from "./context/AuthContext";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";

const App: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<DoctorLogin />} />
            <Route path="/doctordashboard" element={<DoctorDashboard />}/>
            <Route path="/patients/:patientId" element={<PatientDashboard/>} />
            
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;

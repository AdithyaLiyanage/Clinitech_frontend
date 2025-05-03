import React from 'react'
import UserSignUp from './pages/UserSignUp'
import PatientRegistration from './pages/PatientRegistration'
import { BrowserRouter , Routes, Route} from 'react-router-dom'
import Login from './components/Login'
import { AuthProvider } from './contexts/AuthContext'
import ViewUser from './pages/ViewUser'



const App = () => {
  return (
    <div>
      <BrowserRouter>
      <AuthProvider>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/viewusers" element={<ViewUser />} />
          <Route path="/home" element={<UserSignUp />} />
          <Route path="/patientregistration" element={<PatientRegistration />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
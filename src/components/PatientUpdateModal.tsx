import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
interface Patient {
  _id: string;
  fullName: string;
  DOB: string;
  age: number;
  gender: string;
  bloodType: string;
  contactNumber: string;
  guardian: {
    fullName: string;
  };
}
interface PatientUpdateModalProps {
  patient: Patient;
  onClose: () => void;
  onUpdate: (updatedPatient: Patient) => void;
}
const PatientUpdateModal: React.FC<PatientUpdateModalProps> = ({
  patient,
  onClose,
  onUpdate
}) => {
  const [formData, setFormData] = useState<Patient>({
    ...patient
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    if (name === 'guardianFullName') {
      setFormData({
        ...formData,
        guardian: {
          ...formData.guardian,
          fullName: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };
  // Prevent clicks within the modal from closing it
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4" onClick={stopPropagation}>
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">
            Update Patient Information
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input type="text" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label htmlFor="DOB" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input type="date" id="DOB" name="DOB" value={formData.DOB} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
                Blood Type
              </label>
              <select id="bloodType" name="bloodType" value={formData.bloodType} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div>
              <label htmlFor="guardianFullName" className="block text-sm font-medium text-gray-700 mb-1">
                Guardian Full Name
              </label>
              <input type="text" id="guardianFullName" name="guardianFullName" value={formData.guardian.fullName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Update Patient
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default PatientUpdateModal;
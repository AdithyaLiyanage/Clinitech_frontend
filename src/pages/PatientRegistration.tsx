import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PatientRegistration: React.FC = () => {
  const navigate = useNavigate(); // Get the navigate function
  // Formik setup
  const formik = useFormik({
    initialValues: {
      fullName: "",
      NIC: "",
      preferredName: "",
      address: "",
      DOB: "",
      age: 0,
      occupation: "",
      gender: "",
      bloodType: "",
      maritalStatus: "",
      contactNumber: "",
      email: "",
      guardian: {
        fullName: "",
        NIC: "",
        contactNumber: "",
        relation: "",
      },
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .matches(/^[a-zA-Z\s]*$/, "Full Name should only contain letters and spaces")
        .required("Full Name is required"),
      NIC: Yup.string()
        .matches(/^[0-9]{9}[vVxX]$/, "NIC must be in the format 123456789V or 123456789X")
        .required("NIC is required"),
      preferredName: Yup.string()
        .matches(/^[a-zA-Z\s]*$/, "Preferred Name should only contain letters and spaces"),
      address: Yup.string().required("Address is required"),
      DOB: Yup.date()
        .max(new Date(), "Date of Birth cannot be in the future")
        .required("Date of Birth is required"),
      age: Yup.number()
        .min(0, "Age must be a positive number")
        .required("Age is required"),
      occupation: Yup.string(),
      gender: Yup.string().required("Gender is required"),
      bloodType: Yup.string().required("Blood Type is required"),
      maritalStatus: Yup.string().required("Marital Status is required"),
      contactNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Contact Number must be 10 digits")
        .required("Contact Number is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      guardian: Yup.object({
        fullName: Yup.string()
          .matches(/^[a-zA-Z\s]*$/, "Guardian Full Name should only contain letters and spaces")
          .required("Guardian Full Name is required"),
        NIC: Yup.string()
          .matches(/^[0-9]{9}[vVxX]$/, "Guardian NIC must be in the format 123456789V or 123456789X")
          .required("Guardian NIC is required"),
        contactNumber: Yup.string()
          .matches(/^[0-9]{10}$/, "Guardian Contact Number must be 10 digits")
          .required("Guardian Contact Number is required"),
        relation: Yup.string().required("Guardian Relation is required"),
      }),
    }),
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post("http://localhost:3000/api/patients/patients", values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Patient added successfully:", response.data);
        // Optionally, you can navigate to another page or show a success message
        navigate('/viewusers')
      } catch (error) {
        console.error("Error adding patient:", error);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">New Patient Enrollment</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                Full Name
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formik.touched.fullName && formik.errors.fullName
                    ? "border-red-500"
                    : ""
                }`}
                id="fullName"
                type="text"
                placeholder="Full Name"
                {...formik.getFieldProps("fullName")}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.fullName}
                </p>
              )}
            </div>

            {/* NIC */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="NIC">
                NIC
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formik.touched.NIC && formik.errors.NIC
                    ? "border-red-500"
                    : ""
                }`}
                id="NIC"
                type="text"
                placeholder="NIC"
                {...formik.getFieldProps("NIC")}
              />
              {formik.touched.NIC && formik.errors.NIC && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.NIC}
                </p>
              )}
            </div>

            {/* Preferred Name */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="preferredName">
                Preferred Name
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formik.touched.preferredName && formik.errors.preferredName
                    ? "border-red-500"
                    : ""
                }`}
                id="preferredName"
                type="text"
                placeholder="Preferred Name"
                {...formik.getFieldProps("preferredName")}
              />
              {formik.touched.preferredName && formik.errors.preferredName && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.preferredName}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                Address
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formik.touched.address && formik.errors.address
                    ? "border-red-500"
                    : ""
                }`}
                id="address"
                type="text"
                placeholder="Address"
                {...formik.getFieldProps("address")}
              />
              {formik.touched.address && formik.errors.address && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.address}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="DOB">
                Date of Birth
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formik.touched.DOB && formik.errors.DOB
                    ? "border-red-500"
                    : ""
                }`}
                id="DOB"
                type="date"
                {...formik.getFieldProps("DOB")}
              />
              {formik.touched.DOB && formik.errors.DOB && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.DOB}
                </p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
                Age
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formik.touched.age && formik.errors.age
                    ? "border-red-500"
                    : ""
                }`}
                id="age"
                type="number"
                placeholder="Age"
                {...formik.getFieldProps("age")}
              />
              {formik.touched.age && formik.errors.age && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.age}
                </p>
              )}
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="occupation">
                Occupation
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formik.touched.occupation && formik.errors.occupation
                    ? "border-red-500"
                    : ""
                }`}
                id="occupation"
                type="text"
                placeholder="Occupation"
                {...formik.getFieldProps("occupation")}
              />
              {formik.touched.occupation && formik.errors.occupation && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.occupation}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
                Gender
              </label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formik.touched.gender && formik.errors.gender
                    ? "border-red-500"
                    : ""
                }`}
                id="gender"
                {...formik.getFieldProps("gender")}
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.gender}
                </p>
              )}
            </div>

            {/* Blood Type */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bloodType">
                Blood Type
              </label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formik.touched.bloodType && formik.errors.bloodType
                    ? "border-red-500"
                    : ""
                }`}
                id="bloodType"
                {...formik.getFieldProps("bloodType")}
              >
                <option value="" disabled>
                  Select Blood Type
                </option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              {formik.touched.bloodType && formik.errors.bloodType && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.bloodType}
                </p>
              )}
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maritalStatus">
                Marital Status
              </label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formik.touched.maritalStatus && formik.errors.maritalStatus
                    ? "border-red-500"
                    : ""
                }`}
                id="maritalStatus"
                {...formik.getFieldProps("maritalStatus")}
              >
                <option value="" disabled>
                  Select Marital Status
                </option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
              {formik.touched.maritalStatus && formik.errors.maritalStatus && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.maritalStatus}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactNumber">
                Contact Number
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formik.touched.contactNumber && formik.errors.contactNumber
                    ? "border-red-500"
                    : ""
                }`}
                id="contactNumber"
                type="tel"
                placeholder="Contact Number"
                {...formik.getFieldProps("contactNumber")}
              />
              {formik.touched.contactNumber && formik.errors.contactNumber && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.contactNumber}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : ""
                }`}
                id="email"
                type="email"
                placeholder="Email"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Guardian Section */}
            <div className="col-span-2">
              <h3 className="text-xl font-bold mb-4">Guardian Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Guardian Full Name */}
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guardian.fullName">
                    Guardian Full Name
                  </label>
                  <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      formik.touched.guardian?.fullName && formik.errors.guardian?.fullName
                        ? "border-red-500"
                        : ""
                    }`}
                    id="guardian.fullName"
                    type="text"
                    placeholder="Guardian Full Name"
                    {...formik.getFieldProps("guardian.fullName")}
                  />
                  {formik.touched.guardian?.fullName && formik.errors.guardian?.fullName && (
                    <p className="text-red-500 text-xs italic mt-1">
                      {formik.errors.guardian.fullName}
                    </p>
                  )}
                </div>

                {/* Guardian NIC */}
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guardian.NIC">
                    Guardian NIC
                  </label>
                  <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      formik.touched.guardian?.NIC && formik.errors.guardian?.NIC
                        ? "border-red-500"
                        : ""
                    }`}
                    id="guardian.NIC"
                    type="text"
                    placeholder="Guardian NIC"
                    {...formik.getFieldProps("guardian.NIC")}
                  />
                  {formik.touched.guardian?.NIC && formik.errors.guardian?.NIC && (
                    <p className="text-red-500 text-xs italic mt-1">
                      {formik.errors.guardian.NIC}
                    </p>
                  )}
                </div>

                {/* Guardian Contact Number */}
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guardian.contactNumber">
                    Guardian Contact Number
                  </label>
                  <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      formik.touched.guardian?.contactNumber && formik.errors.guardian?.contactNumber
                        ? "border-red-500"
                        : ""
                    }`}
                    id="guardian.contactNumber"
                    type="tel"
                    placeholder="Guardian Contact Number"
                    {...formik.getFieldProps("guardian.contactNumber")}
                  />
                  {formik.touched.guardian?.contactNumber && formik.errors.guardian?.contactNumber && (
                    <p className="text-red-500 text-xs italic mt-1">
                      {formik.errors.guardian.contactNumber}
                    </p>
                  )}
                </div>

                {/* Guardian Relation */}
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guardian.relation">
                    Guardian Relation
                  </label>
                  <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      formik.touched.guardian?.relation && formik.errors.guardian?.relation
                        ? "border-red-500"
                        : ""
                    }`}
                    id="guardian.relation"
                    type="text"
                    placeholder="Guardian Relation"
                    {...formik.getFieldProps("guardian.relation")}
                  />
                  {formik.touched.guardian?.relation && formik.errors.guardian?.relation && (
                    <p className="text-red-500 text-xs italic mt-1">
                      {formik.errors.guardian.relation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistration;
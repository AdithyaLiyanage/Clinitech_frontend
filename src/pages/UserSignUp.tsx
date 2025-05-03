import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Sidebar from "../components/Sidebar";
import Layout from "../components/layout/Layout";

const UserSignUp: React.FC = () => {
  // Formik setup
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      role: "",
      password: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .matches(/^[a-zA-Z\s]*$/, "Full Name should only contain letters and spaces")
        .required("Full Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phoneNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
      role: Yup.string().required("Role is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      console.log(values); // Handle form submission
    },
  });

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-300">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
          <form onSubmit={formik.handleSubmit}>
            {/* Full Name */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="fullName"
              >
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

            {/* Email */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email Address
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

            {/* Phone Number */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="phoneNumber"
              >
                Phone Number
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                    ? "border-red-500"
                    : ""
                }`}
                id="phoneNumber"
                type="tel"
                placeholder="Phone Number"
                {...formik.getFieldProps("phoneNumber")}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="role"
              >
                Role
              </label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formik.touched.role && formik.errors.role
                    ? "border-red-500"
                    : ""
                }`}
                id="role"
                {...formik.getFieldProps("role")}
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="Admin">Admin</option>
                <option value="Doctor">Doctor</option>
                <option value="Patient">Patient</option>
              </select>
              {formik.touched.role && formik.errors.role && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.role}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : ""
                }`}
                id="password"
                type="password"
                placeholder="Password"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                SIGN UP
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UserSignUp;
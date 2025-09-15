import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import API from "../api/api";      // <-- Axios instance imported here
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(20, "Name must be at least 20 characters")
    .max(60, "Name must be at most 60 characters")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  address: Yup.string().max(400, "Address too long").required("Required"),
  password: Yup.string()
    .min(8, "Password must be 8-16 characters")
    .max(16, "Password must be 8-16 characters")
    .matches(/[A-Z]/, "At least one uppercase letter required")
    .matches(/[^A-Za-z0-9]/, "At least one special character required")
    .required("Required"),
  role: Yup.string().oneOf(["admin", "user", "owner"], "Select a valid role").required("Required"),
  terms: Yup.bool().oneOf([true], "You must accept the terms and conditions"),
});

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="signup-container">
      <Formik
        initialValues={{
          name: "",
          email: "",
          address: "",
          password: "",
          role: "",
          terms: false,
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            // 🔑 API call using shared axios instance
            const res = await API.post("/auth/signup", values);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            alert(`Signup successful for role: ${res.data.user.role}`);
            navigate("/");
          } catch (err) {
            alert(err?.response?.data?.message || "Signup failed");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="signup-form">
            <h2>Sign up</h2>

            <div className="form-group">
              <Field name="name" placeholder="Full Name (20-60 chars)" />
              <ErrorMessage name="name" component="div" className="error" />
            </div>

            <div className="form-group">
              <Field name="email" placeholder="Email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="form-group">
              <Field name="address" placeholder="Address (max 400 chars)" />
              <ErrorMessage name="address" component="div" className="error" />
            </div>

            <div className="form-group">
              <Field
                type="password"
                name="password"
                placeholder="Password (8-16 chars, 1 uppercase, 1 special char)"
              />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <div className="form-group">
              <Field as="select" name="role">
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">Normal User</option>
                <option value="owner">Store Owner</option>
              </Field>
              <ErrorMessage name="role" component="div" className="error" />
            </div>

            <div className="form-group" style={{ display: "flex", alignItems: "center" }}>
              <Field
                type="checkbox"
                id="terms"
                name="terms"
                checked={values.terms}
                onChange={() => setFieldValue("terms", !values.terms)}
              />
              <label htmlFor="terms" style={{ marginLeft: "10px" }}>
                I accept the terms and conditions.
              </label>
            </div>
            <ErrorMessage name="terms" component="div" className="error" />

            <button type="submit" disabled={isSubmitting || !values.terms}>
              {isSubmitting ? "Signing up..." : "Signup"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

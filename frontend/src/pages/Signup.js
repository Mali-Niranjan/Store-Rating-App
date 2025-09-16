// // src/pages/Signup.js
// import React from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import API from "../api/api";
// import { useNavigate } from "react-router-dom";
// import "./Signup.css"; // Capital S — match filename exactly

// // Yup schema with terms acceptance check added
// const SignupSchema = Yup.object().shape({
//   name: Yup.string()
//     .min(20, "Name must be at least 20 characters")
//     .max(60, "Name must be at most 60 characters")
//     .required("Required"),
//   email: Yup.string().email("Invalid email").required("Required"),
//   address: Yup.string().max(400, "Address too long").required("Required"),
//   password: Yup.string()
//     .min(8, "Password must be 8-16 characters")
//     .max(16, "Password must be 8-16 characters")
//     .matches(/[A-Z]/, "At least one uppercase letter required")
//     .matches(/[^A-Za-z0-9]/, "At least one special character required")
//     .required("Required"),
//   terms: Yup.bool().oneOf([true], "You must accept the terms and conditions"),
// });

// export default function Signup() {
//   const navigate = useNavigate();

//   // helper checks for live feedback (unchanged)
//   const checks = {
//     nameMin: (v) => v && v.trim().length >= 20,
//     nameMax: (v) => v && v.trim().length <= 60,
//     emailValid: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim()),
//     addressPresent: (v) => v && v.trim().length > 0,
//     addressMax: (v) => !v || v.trim().length <= 400,
//     pwdLen: (v) => v && v.length >= 8 && v.length <= 16,
//     pwdUpper: (v) => /[A-Z]/.test(v || ""),
//     pwdSpecial: (v) => /[^A-Za-z0-9]/.test(v || ""),
//   };

//   return (
//     <div className="signup-container">
//       <Formik
//         initialValues={{ name: "", email: "", address: "", password: "", terms: false }}
//         validationSchema={SignupSchema}
//         onSubmit={async (values, { setSubmitting }) => {
//           try {
//             const res = await API.post("/auth/signup", values);
//             localStorage.setItem("token", res.data.token);
//             localStorage.setItem("user", JSON.stringify(res.data.user));
//             alert(
//               `Signup successful for role: ${res.data.user.role}\nName: ${res.data.user.name}\nEmail: ${res.data.user.email}`
//             );
//             navigate("/");
//           } catch (err) {
//             alert(err?.response?.data?.message || "Signup failed");
//           } finally {
//             setSubmitting(false);
//           }
//         }}
//       >
//         {({ values, errors, touched, isSubmitting, setFieldValue }) => {
//           const active = (field) =>
//             touched[field] || (values[field] && values[field].length > 0);

//           return (
//             <Form className="signup-form">
//               <h2>Sign up</h2>

//               {/* Name */}
//               <div className="form-group">
//                 <Field
//                   name="name"
//                   placeholder="Full Name (20-60 chars)"
//                   className={touched.name && errors.name ? "input-error" : ""}
//                 />
//                 <ErrorMessage name="name" component="div" className="error" />
//               </div>

//               {/* Email */}
//               <div className="form-group">
//                 <Field
//                   name="email"
//                   placeholder="Email"
//                   className={touched.email && errors.email ? "input-error" : ""}
//                 />
//                 <ErrorMessage name="email" component="div" className="error" />
//               </div>

//               {/* Address */}
//               <div className="form-group">
//                 <Field
//                   name="address"
//                   placeholder="Address (max 400 chars)"
//                   className={
//                     touched.address && errors.address ? "input-error" : ""
//                   }
//                 />
//                 <ErrorMessage
//                   name="address"
//                   component="div"
//                   className="error"
//                 />
//               </div>

//               {/* Password */}
//               <div className="form-group">
//                 <Field
//                   type="password"
//                   name="password"
//                   placeholder="Password (8-16 chars, 1 uppercase, 1 special char)"
//                   className={
//                     touched.password && errors.password ? "input-error" : ""
//                   }
//                 />
//                 <ErrorMessage
//                   name="password"
//                   component="div"
//                   className="error"
//                 />
//               </div>

//               {/* Terms and Conditions Checkbox */}
//               <div className="form-group" style={{ display: "flex", alignItems: "center" }}>
//                 <Field
//                   type="checkbox"
//                   id="terms"
//                   name="terms"
//                   checked={values.terms}
//                   onChange={() => setFieldValue("terms", !values.terms)}
//                 />
//                 <label htmlFor="terms" style={{ marginLeft: "10px", fontSize: "0.95rem", userSelect: "none" }}>
//                   I accept the terms and conditions.
//                 </label>
//               </div>
//               <ErrorMessage name="terms" component="div" className="error" />

//               {/* Submit */}
//               <button type="submit" disabled={isSubmitting || !values.terms}>
//                 {isSubmitting ? "Signing up..." : "Signup"}
//               </button>

//               {/* === Requirements box (shows live status) === */}
//               <div className="requirements-box">
//                 <h4>Requirements</h4>
//                 <div className="req-group">
//                   <div className="req-title">Name</div>
//                   <ul className="req-list">
//                     <li
//                       className={
//                         "requirement " +
//                         (active("name")
//                           ? checks.nameMin(values.name)
//                             ? "valid"
//                             : "invalid"
//                           : "neutral")
//                       }
//                     >
//                       Name must be at least 20 characters.
//                     </li>
//                     <li
//                       className={
//                         "requirement " +
//                         (active("name")
//                           ? checks.nameMax(values.name)
//                             ? "valid"
//                             : "invalid"
//                           : "neutral")
//                       }
//                     >
//                       Name must be at most 60 characters.
//                     </li>
//                   </ul>
//                 </div>

//                 <div className="req-group">
//                   <div className="req-title">Email</div>
//                   <ul className="req-list">
//                     <li
//                       className={
//                         "requirement " +
//                         (active("email")
//                           ? checks.emailValid(values.email)
//                             ? "valid"
//                             : "invalid"
//                           : "neutral")
//                       }
//                     >
//                       Must be a valid email address.
//                     </li>
//                   </ul>
//                 </div>

//                 <div className="req-group">
//                   <div className="req-title">Address</div>
//                   <ul className="req-list">
//                     <li
//                       className={
//                         "requirement " +
//                         (active("address")
//                           ? checks.addressPresent(values.address)
//                             ? "valid"
//                             : "invalid"
//                           : "neutral")
//                       }
//                     >
//                       Address is required.
//                     </li>
//                     <li
//                       className={
//                         "requirement " +
//                         (active("address")
//                           ? checks.addressMax(values.address)
//                             ? "valid"
//                             : "invalid"
//                           : "neutral")
//                       }
//                     >
//                       Address must not exceed 400 characters.
//                     </li>
//                   </ul>
//                 </div>

//                 <div className="req-group">
//                   <div className="req-title">Password</div>
//                   <ul className="req-list">
//                     <li
//                       className={
//                         "requirement " +
//                         (active("password")
//                           ? checks.pwdLen(values.password)
//                             ? "valid"
//                             : "invalid"
//                           : "neutral")
//                       }
//                     >
//                       Password must be 8–16 characters.
//                     </li>
//                     <li
//                       className={
//                         "requirement " +
//                         (active("password")
//                           ? checks.pwdUpper(values.password)
//                             ? "valid"
//                             : "invalid"
//                           : "neutral")
//                       }
//                     >
//                       Include at least one uppercase letter.
//                     </li>
//                     <li
//                       className={
//                         "requirement " +
//                         (active("password")
//                           ? checks.pwdSpecial(values.password)
//                             ? "valid"
//                             : "invalid"
//                           : "neutral")
//                       }
//                     >
//                       Include at least one special character.
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </Form>
//           );
//         }}
//       </Formik>
//     </div>
//   );
// }

// src/pages/Signup.js
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; // Capital S — match filename exactly

// Yup schema with role and terms validations added
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

  // helper checks for live feedback (unchanged)
  const checks = {
    nameMin: (v) => v && v.trim().length >= 20,
    nameMax: (v) => v && v.trim().length <= 60,
    emailValid: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim()),
    addressPresent: (v) => v && v.trim().length > 0,
    addressMax: (v) => !v || v.trim().length <= 400,
    pwdLen: (v) => v && v.length >= 8 && v.length <= 16,
    pwdUpper: (v) => /[A-Z]/.test(v || ""),
    pwdSpecial: (v) => /[^A-Za-z0-9]/.test(v || ""),
  };

  return (
    <div className="signup-container">
      <Formik
        initialValues={{ name: "", email: "", address: "", password: "", role: "", terms: false }}
        validationSchema={SignupSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await API.post("/auth/signup", values);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            alert(
              `Signup successful for role: ${res.data.user.role}\nName: ${res.data.user.name}\nEmail: ${res.data.user.email}`
            );
            navigate("/");
          } catch (err) {
            alert(err?.response?.data?.message || "Signup failed");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => {
          const active = (field) =>
            touched[field] || (values[field] && values[field].length > 0);

          return (
            <Form className="signup-form">
              <h2>Sign up</h2>

              {/* Name */}
              <div className="form-group">
                <Field
                  name="name"
                  placeholder="Full Name (20-60 chars)"
                  className={touched.name && errors.name ? "input-error" : ""}
                />
                <ErrorMessage name="name" component="div" className="error" />
              </div>

              {/* Email */}
              <div className="form-group">
                <Field
                  name="email"
                  placeholder="Email"
                  className={touched.email && errors.email ? "input-error" : ""}
                />
                <ErrorMessage name="email" component="div" className="error" />
              </div>

              {/* Address */}
              <div className="form-group">
                <Field
                  name="address"
                  placeholder="Address (max 400 chars)"
                  className={
                    touched.address && errors.address ? "input-error" : ""
                  }
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="error"
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <Field
                  type="password"
                  name="password"
                  placeholder="Password (8-16 chars, 1 uppercase, 1 special char)"
                  className={
                    touched.password && errors.password ? "input-error" : ""
                  }
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error"
                />
              </div>

              {/* Role dropdown */}
              <div className="form-group">
                <Field
                  as="select"
                  name="role"
                  className={touched.role && errors.role ? "input-error" : ""}
                  >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">Normal User</option>
                  <option value="owner">Store Owner</option>
                </Field>
                <ErrorMessage
                  name="role"
                  component="div"
                  className="error"
                />
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="form-group" style={{ display: "flex", alignItems: "center" }}>
                <Field
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={values.terms}
                  onChange={() => setFieldValue("terms", !values.terms)}
                />
                <label htmlFor="terms" style={{ marginLeft: "10px", fontSize: "0.95rem", userSelect: "none" }}>
                  I accept the terms and conditions.
                </label>
              </div>
              <ErrorMessage name="terms" component="div" className="error" />


              {/* Submit */}
              <button type="submit" disabled={isSubmitting || !values.terms}>
                {isSubmitting ? "Signing up..." : "Signup"}
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

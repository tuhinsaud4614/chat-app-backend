import { Types } from "mongoose";
import sanitizeHtml from "sanitize-html";
import * as yup from "yup";

export const createUserValidateSchema = yup.object().shape({
  body: yup.object().shape({
    firstName: yup
      .string()
      .nullable()
      .trim()
      .test("sanitize", "Malicious first name entered.", (value) => {
        if (value === undefined) {
          return true;
        }
        return !!value && !!sanitizeHtml(value);
      }),
    lastName: yup
      .string()
      .nullable()
      .trim()
      .test("sanitize", "Malicious last name entered.", (value) => {
        if (value === undefined) {
          return true;
        }
        return !!value && !!sanitizeHtml(value);
      }),
    email: yup
      .string()
      .email("This is not valid email.")
      .required("Email is required."),
    password: yup
      .string()
      .trim()
      .required("Password is required.")
      .min(6, "Password should at least 6 characters.")
      .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain latin letters.")
      .test(
        "sanitize",
        "Malicious password entered.",
        (value) => !!value && !!sanitizeHtml(value)
      ),
    confirmPassword: yup
      .string()
      .required("Confirm password is required.")
      .oneOf([yup.ref("password"), null], "Password must be matched!"),
  }),
});

export const resendUserVerificationCodeValidateSchema = yup.object().shape({
  params: yup.object().shape({
    id: yup
      .string()
      .required("User ID is required")
      .test(
        "validId",
        "Valid user id is required",
        (value) => !!value && Types.ObjectId.isValid(value)
      ),
  }),
});

export const verifyValidateSchema = yup.object().shape({
  params: yup.object().shape({
    id: yup
      .string()
      .test(
        "validId",
        "Valid id is required",
        (value) => !!value && Types.ObjectId.isValid(value)
      ),
    verificationCode: yup.string(),
  }),
});

export const userLoginValidateSchema = yup.object().shape({
  body: yup.object().shape({
    email: yup
      .string()
      .required("Email is required.")
      .email("Invalid email or password."),
    password: yup
      .string()
      .required("Password is required.")
      .min(6, "Invalid email or password.")
      .matches(/^[a-zA-Z0-9_.-]*$/, "Invalid email or password."),
  }),
});

export const userForgetPasswordValidateSchema = yup.object().shape({
  body: yup.object().shape({
    email: yup
      .string()
      .required("Email is required.")
      .email("This is not valid email."),
  }),
});

export const userResetPasswordValidateSchema = yup.object().shape({
  body: yup.object().shape({
    newPassword: yup
      .string()
      .trim()
      .required("Password is required.")
      .min(6, "Password should at least 6 characters.")
      .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain latin letters.")
      .test(
        "sanitize",
        "Malicious password entered.",
        (value) => !!value && !!sanitizeHtml(value)
      ),
    confirmPassword: yup
      .string()
      .required("Confirm password is required.")
      .oneOf([yup.ref("newPassword"), null], "Password must be matched!"),
  }),
  params: yup.object().shape({
    id: yup.string(),
    verifiedCode: yup.string(),
  }),
});

export const userProfileValidateSchema = yup.object().shape({
  file: yup.mixed().required("Avatar is required"),
});

export const userStatusValidateSchema = yup.object().shape({
  body: yup.object().shape({
    status: yup
      .bool()
      .required("Status is required!")
      .oneOf([true, false], "Must be true or false"),
  }),
});

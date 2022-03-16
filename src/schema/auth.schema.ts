import * as yup from "yup";

export const refreshTokenValidateSchema = yup.object().shape({
  body: yup.object().shape({
    token: yup.string().required("Token is required."),
  }),
});

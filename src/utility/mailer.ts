import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
  SendMailOptions,
} from "nodemailer";
import { HttpError } from "../models";

const createDemoAccount = async () => {
  await createTestAccount();
};

const transporter = createTransport({
  port: parseInt(process.env.SMTP_PORT as string) || 587,
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  secure: Boolean(process.env.SMTP_SECURITY),
  auth: {
    user: process.env.SMTP_USER || "w6o47kszasvmdbki@ethereal.email",
    pass: process.env.SMTP_PASSWORD || "fmupU2as65BQCCWpQD",
  },
});

const senMail = async (options: SendMailOptions) => {
  try {
    await createDemoAccount();
    const info = await transporter.sendMail(options);
    return getTestMessageUrl(info);
  } catch (error: any) {
    // logger.error(error.message);
    throw new HttpError("Email not sent", 500);
  }
};

export default senMail;

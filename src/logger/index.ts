import loggerDev from "./logger.dev";
import loggerProd from "./logger.prod";

export default process.env.NODE_ENV === "development"
  ? loggerDev()
  : loggerProd();

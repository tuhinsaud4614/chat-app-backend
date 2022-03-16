export * from "./constants";
export * from "./interfaces";
export { default as sendMail } from "./mailer";
export * from "./redis";
export * from "./types";

export function trimmedObjValue<T extends Object>(obj: T) {
  if (typeof obj === "object") {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        // @ts-ignore
        obj[key] = obj[key].trim();
      }
    }
  }

  return JSON.parse(JSON.stringify(obj)) as T;
}

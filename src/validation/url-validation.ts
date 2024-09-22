import { z } from "zod";

const createUrlValidation = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(30, { message: "Name must not be more than 30 characters" }),
  redirectURL: z
    .string()
    .url({ message: "Redirect URL must be a valid URL" })
    .max(300, { message: "Redirect URL must not be more than 300 characters" })
    .min(1, { message: "Redirect URL is required" }),
});

const updateUrlValidation = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(30, { message: "Name must not be more than 30 characters." }),
});

export { createUrlValidation, updateUrlValidation };

import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  phoneNumber: z.string().min(1, "Phone Number is required"), // You might want to add regex for phone number validation
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "One uppercase letter")
    .regex(/[0-9]/, "One number")
    .regex(/[^A-Za-z0-9]/, "One special character"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms and Conditions",
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;


import { z } from "zod";

// Buyer registration schema
export const registerSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
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

// Merchant registration schema - Step 1: Basic Information
export const merchantBasicInfoSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
});

export type MerchantBasicInfoData = z.infer<typeof merchantBasicInfoSchema>;

// Merchant registration schema - Step 2: Store Information
export const merchantStoreInfoSchema = z.object({
  storeName: z.string().min(1, "Store Name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  region: z.string().min(1, "Region is required"),
  city: z.string().min(1, "City is required"),
  closestLandmark: z.string().min(1, "Closest Landmark is required"),
});

export type MerchantStoreInfoData = z.infer<typeof merchantStoreInfoSchema>;

// Merchant registration schema - Step 3: Password
export const merchantPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "One uppercase letter")
    .regex(/[0-9]/, "One number")
    .regex(/[^A-Za-z0-9]/, "One special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms and Conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type MerchantPasswordData = z.infer<typeof merchantPasswordSchema>;

// Complete merchant registration data
export const merchantRegisterSchema = merchantBasicInfoSchema
  .merge(merchantStoreInfoSchema)
  .merge(z.object({
    password: z.string(),
    confirmPassword: z.string(),
    terms: z.boolean(),
  }));

export type MerchantRegisterFormData = z.infer<typeof merchantRegisterSchema>;// Ghana regions and cities data
export const ghanaRegions = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Northern",
  "Volta",
  "Upper East",
  "Upper West",
  "Bono",
  "Bono East",
  "Ahafo",
  "Western North",
  "Oti",
  "North East",
  "Savannah",
] as const;

export const ghanaCities: Record<string, string[]> = {
  "Greater Accra": ["Accra", "Tema", "Madina", "Teshie", "Nungua", "Kasoa"],
  "Ashanti": ["Kumasi", "Obuasi", "Ejisu", "Mampong", "Bekwai"],
  "Western": ["Takoradi", "Sekondi", "Tarkwa", "Axim"],
  "Eastern": ["Koforidua", "Nkawkaw", "Akim Oda", "Nsawam"],
  "Central": ["Cape Coast", "Winneba", "Elmina", "Mankessim"],
  "Northern": ["Tamale", "Yendi", "Savelugu"],
  "Volta": ["Ho", "Hohoe", "Keta", "Aflao"],
  "Upper East": ["Bolgatanga", "Navrongo", "Bawku"],
  "Upper West": ["Wa", "Lawra", "Tumu"],
  "Bono": ["Sunyani", "Berekum", "Dormaa Ahenkro"],
  "Bono East": ["Techiman", "Kintampo", "Nkoranza"],
  "Ahafo": ["Goaso", "Bechem", "Duayaw Nkwanta"],
  "Western North": ["Sefwi Wiawso", "Bibiani", "Enchi"],
  "Oti": ["Dambai", "Nkwanta", "Jasikan"],
  "North East": ["Nalerigu", "Gambaga", "Walewale"],
  "Savannah": ["Damongo", "Bole", "Salaga"],
};

export const merchantCategories = [
  "Fashion",
  "Electronics",
  "Food & Beverages",
  "Health & Beauty",
  "Home & Garden",
  "Sports & Outdoors",
  "Automotive",
  "Books & Media",
  "Toys & Games",
  "Services",
  "Other",
] as const;

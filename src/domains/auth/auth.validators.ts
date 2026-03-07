import { z } from "zod";

// ─── Ghana-specific validation helpers ────────────────────────────────────────

/** Matches Ghana phone numbers: +233XXXXXXXXX or 0XXXXXXXXX */
const ghanaPhoneRegex = /^(\+233|0)(2[034567]|5[045679])\d{7}$/;

// ─── Buyer Registration ──────────────────────────────────────────────────────

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
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

// ─── Merchant Registration — Step 1: Basic Information ───────────────────────

export const merchantBasicInfoSchema = z.object({
  fullName: z
    .string()
    .min(3, "Please enter your full name (at least 3 characters)")
    .max(100, "Name must be 100 characters or less")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(ghanaPhoneRegex, "Please enter a valid Ghana phone number (e.g. 0241234567 or +233241234567)"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .transform((val) => val.trim().toLowerCase()),
  address: z
    .string()
    .min(5, "Please enter your full address (at least 5 characters)")
    .max(200, "Address must be 200 characters or less"),
});

export type MerchantBasicInfoData = z.infer<typeof merchantBasicInfoSchema>;

// ─── Merchant Registration — Step 2: Store Information ───────────────────────

export const merchantStoreInfoSchema = z.object({
  storeName: z
    .string()
    .min(2, "Store name must be at least 2 characters")
    .max(100, "Store name must be 100 characters or less"),
  category: z.string().min(1, "Please select a business category"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be 500 characters or less"),
  region: z.string().min(1, "Please select a region"),
  city: z.string().min(1, "Please select a city"),
  closestLandmark: z
    .string()
    .min(2, "Please enter the closest landmark (at least 2 characters)")
    .max(150, "Landmark must be 150 characters or less"),
});

export type MerchantStoreInfoData = z.infer<typeof merchantStoreInfoSchema>;

// ─── Merchant Registration — Step 3: Password ────────────────────────────────

export const merchantPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms and Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type MerchantPasswordData = z.infer<typeof merchantPasswordSchema>;

// ─── Merchant Registration — Step 5: ID Verification ─────────────────────────

export const merchantVerificationSchema = z.object({
  idType: z.string().min(1, "Please select an ID type"),
  idNumber: z
    .string()
    .min(5, "ID number must be at least 5 characters")
    .max(30, "ID number must be 30 characters or less"),
});

export type MerchantVerificationData = z.infer<typeof merchantVerificationSchema>;

// ─── Combined Merchant Registration (for reference) ──────────────────────────

export const merchantRegisterSchema = merchantBasicInfoSchema
  .merge(merchantStoreInfoSchema)
  .merge(
    z.object({
      password: z.string(),
      confirmPassword: z.string(),
      terms: z.boolean(),
    })
  );

export type MerchantRegisterFormData = z.infer<typeof merchantRegisterSchema>;

// ─── Ghana Regions & Cities ──────────────────────────────────────────────────

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
  Ashanti: ["Kumasi", "Obuasi", "Ejisu", "Mampong", "Bekwai"],
  Western: ["Takoradi", "Sekondi", "Tarkwa", "Axim"],
  Eastern: ["Koforidua", "Nkawkaw", "Akim Oda", "Nsawam"],
  Central: ["Cape Coast", "Winneba", "Elmina", "Mankessim"],
  Northern: ["Tamale", "Yendi", "Savelugu"],
  Volta: ["Ho", "Hohoe", "Keta", "Aflao"],
  "Upper East": ["Bolgatanga", "Navrongo", "Bawku"],
  "Upper West": ["Wa", "Lawra", "Tumu"],
  Bono: ["Sunyani", "Berekum", "Dormaa Ahenkro"],
  "Bono East": ["Techiman", "Kintampo", "Nkoranza"],
  Ahafo: ["Goaso", "Bechem", "Duayaw Nkwanta"],
  "Western North": ["Sefwi Wiawso", "Bibiani", "Enchi"],
  Oti: ["Dambai", "Nkwanta", "Jasikan"],
  "North East": ["Nalerigu", "Gambaga", "Walewale"],
  Savannah: ["Damongo", "Bole", "Salaga"],
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

// ─── File Upload Validation Constants ────────────────────────────────────────

export const FILE_UPLOAD_CONFIG = {
  MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5 MB
  MAX_SIZE_LABEL: "5 MB",
  ACCEPTED_TYPES: ["image/jpeg", "image/png", "image/webp"] as const,
  ACCEPTED_TYPES_LABEL: "PNG, JPG, or WebP",
} as const;

export function validateUploadFile(file: File): { valid: boolean; error?: string } {
  if (!FILE_UPLOAD_CONFIG.ACCEPTED_TYPES.includes(file.type as typeof FILE_UPLOAD_CONFIG.ACCEPTED_TYPES[number])) {
    return {
      valid: false,
      error: `Invalid file type. Please upload a ${FILE_UPLOAD_CONFIG.ACCEPTED_TYPES_LABEL} image.`,
    };
  }
  if (file.size > FILE_UPLOAD_CONFIG.MAX_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${FILE_UPLOAD_CONFIG.MAX_SIZE_LABEL}.`,
    };
  }
  if (file.size === 0) {
    return { valid: false, error: "File appears to be empty. Please try a different image." };
  }
  return { valid: true };
}

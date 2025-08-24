import * as z from "zod";

const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required").max(2, "Use state abbreviation"),
  zipCode: z.string().regex(/^\d{5}$/, "Enter a valid 5-digit ZIP code"),
});

const packageDimensionsSchema = z.object({
  length: z.string().min(1, "Length is required"),
  width: z.string().min(1, "Width is required"),
  height: z.string().min(1, "Height is required"),
  weight: z.string().min(1, "Weight is required"),
});

const packingDetailsSchema = z.object({
  type: z.enum(["customer", "shipping-center"]),
  boxSize: z.enum(["small", "medium", "large", "custom"]).optional(),
  packagingType: z.enum(["box", "bubble-mailer", "envelope"]).optional(),
  materials: z.array(z.string()).optional(),
  complexity: z.enum(["regular", "fragile", "veryFragile", "custom"]).optional(),
});

export const packageDetailsSchema = z.object({
  shipper: addressSchema,
  receiver: addressSchema,
  package: packageDimensionsSchema,
  packing: packingDetailsSchema,
});
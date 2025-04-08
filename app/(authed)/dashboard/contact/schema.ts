import { CONTACT_FORM_REASONS } from "@/lib/constants";
import { z } from "zod";

const reasonsEnum = Object.values(CONTACT_FORM_REASONS).map((r) => r.key);

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  reason: z.enum(reasonsEnum as [string, ...string[]], {
    message: "Invalid reason selection",
  }),
  message: z.string().min(20, "Message is too short"),
});

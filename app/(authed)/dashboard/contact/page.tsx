import { Metadata } from "next";
import ContactForm from "./_components/contact-form";

export const metadata: Metadata = {
  title: "Get in Touch",
  description: "Reach out to us for any inquiries or feedback",
};

export default function Page() {
  return <ContactForm />;
}

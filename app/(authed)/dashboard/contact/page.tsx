import { Metadata } from "next";
import ContactForm from "./_components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact us",
};

export default function Page() {
  return <ContactForm />;
}

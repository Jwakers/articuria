import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articuria",
  description: "Practice public speaking at home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

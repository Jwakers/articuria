import { Footer } from "@/app/_components/footer";
import { Header } from "@/app/_components/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Table topics",
  description: "Practice table topics at home",
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

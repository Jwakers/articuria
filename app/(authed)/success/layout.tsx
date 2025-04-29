import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function SubscriptionSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

import { NoiseFilter } from "@/components/noise-filter";
import { SubscriptionDrawerProvider } from "@/components/subscription/context";
import { SubscriptionDrawer } from "@/components/subscription/subscription-drawer";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "../components/theme-provider";
import ConvexClientProvider from "./convex-client-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Articuria",
    default: "Articuria",
  },
  description: "Practice public speaking at home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <html lang="en">
          <body
            className={cn(
              geistSans.variable,
              geistMono.variable,
              "antialiased",
            )}
          >
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <SubscriptionDrawerProvider>
                <div vaul-drawer-wrapper="true">
                  <div className="bg-background relative grid min-h-dvh grid-rows-[auto_1fr_auto]">
                    <NoiseFilter />
                    {children}
                  </div>
                </div>
                <Toaster richColors />
                <SubscriptionDrawer />
              </SubscriptionDrawerProvider>
            </ThemeProvider>
          </body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}

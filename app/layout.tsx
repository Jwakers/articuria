import { SubscriptionDrawerProvider } from "@/components/context/subscription-drawer-context";
import { SubscriptionDrawer } from "@/components/subscription-drawer";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "../components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(geistSans.variable, geistMono.variable, "antialiased")}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SubscriptionDrawerProvider>
              <div vaul-drawer-wrapper="true">
                <div className="relative grid min-h-dvh grid-rows-[auto_1fr_auto] bg-background">
                  {children}
                </div>
              </div>
              <Toaster richColors />
              <SubscriptionDrawer />
            </SubscriptionDrawerProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

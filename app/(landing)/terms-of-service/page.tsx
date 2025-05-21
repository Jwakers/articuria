import { ROUTES } from "@/lib/constants";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <article className="container mx-auto pt-20">
      <h1 className="text-xl font-bold md:text-2xl">Terms of service</h1>
      <div className="prose">
        <p>Effective Date: 21 May 2025</p>

        <p>
          These Terms of Service (“Terms”) govern your access to and use of our
          app, which allows users to sign up and record videos of themselves
          practising public speaking. By accessing or using the Service, you
          agree to be bound by these Terms.
        </p>

        <h2>1. Your Account</h2>
        <p>
          To use the Service, you must create an account using our
          authentication provider, Clerk. You are responsible for maintaining
          the confidentiality of your account credentials and for all activity
          that occurs under your account.
        </p>

        <h2>2. Use of the Service</h2>
        <p>
          You agree to use the Service in accordance with all applicable laws
          and not to:
        </p>
        <ul>
          <li>
            Use the Service for any unlawful, harmful, or abusive purpose;
          </li>
          <li>
            Upload or share content that is offensive, defamatory, or infringes
            the rights of others;
          </li>
          <li>
            Attempt to access or interfere with other users’ data or recordings;
          </li>
          <li>
            Reverse engineer or attempt to derive the source code of the
            Service.
          </li>
        </ul>

        <h2>3. Subscriptions and Payments</h2>
        <p>
          Certain features of the Service may require a paid subscription.
          Payments are processed securely via Stripe. By subscribing, you agree
          to pay the applicable fees and any taxes associated with your plan.
        </p>
        <p>
          Subscriptions may renew automatically unless cancelled before the end
          of the billing cycle. You may manage your subscription through your
          account settings.
        </p>

        <h2>4. Content Ownership</h2>
        <p>
          You retain all rights to the videos and other content you create using
          the Service. By uploading content, you grant us a limited licence to
          store, display, and process your content solely for the purpose of
          providing the Service.
        </p>

        <h2>5. Intellectual Property</h2>
        <p>
          All rights, title, and interest in and to the Service, including all
          software, content (excluding user-generated content), and branding,
          are owned by us or our licensors. You may not reproduce or distribute
          any part of the Service without our prior written consent.
        </p>

        <h2>6. Termination</h2>
        <p>
          We may suspend or terminate your access to the Service if you breach
          these Terms or engage in behaviour that we deem harmful or
          inappropriate. You may delete your account at any time.
        </p>

        <h2>7. Disclaimer</h2>
        <p>
          The Service is provided “as is” and “as available” without warranties
          of any kind. We do not guarantee that the Service will be
          uninterrupted or error-free.
        </p>

        <h2>8. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, we shall not be liable for any
          indirect, incidental, or consequential damages arising from your use
          of the Service. Our total liability shall not exceed the amount paid
          by you (if any) in the twelve months preceding the claim.
        </p>

        <h2>9. Changes to the Terms</h2>
        <p>
          We may update these Terms from time to time. If we make material
          changes, we will notify you through the app or via email. Continued
          use of the Service after such updates constitutes your acceptance of
          the revised Terms.
        </p>

        <h2>10. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of England and Wales. Any disputes arising out of these Terms
          shall be subject to the exclusive jurisdiction of the courts of
          England and Wales.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us{" "}
          <Link className="underline" href={ROUTES.dashboard.contact}>
            here
          </Link>
          . Note you must be a signed in user to use the contact form.
        </p>
      </div>
    </article>
  );
}

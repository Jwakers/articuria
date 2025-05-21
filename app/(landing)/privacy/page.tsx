import { ROUTES } from "@/lib/constants";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <article className="container mx-auto pt-20">
      <h1 className="text-xl font-bold md:text-2xl">Privacy Policy</h1>
      <div className="prose dark:prose-invert">
        <p>Effective Date: 21 May 2025</p>

        <p>
          This Privacy Policy explains how we collect, use, and protect your
          personal data when you use our app, which allows users to sign up and
          record videos of themselves practising public speaking.
        </p>

        <h2>1. Who We Are</h2>
        <p>
          We are the provider of this app (the “Service”). This Privacy Policy
          applies when you use our Service through the website or any related
          platform.
        </p>

        <h2>2. Information We Collect</h2>
        <p>We collect the following types of personal data:</p>
        <ul>
          <li>
            <strong>Account Information:</strong> When you sign up, we collect
            your email address and other information via our authentication
            provider, Clerk.
          </li>
          <li>
            <strong>Payment Information:</strong> If you purchase a
            subscription, your payment is processed securely via Stripe. We do
            not store your payment card details.
          </li>
          <li>
            <strong>Video Content:</strong> When you use the Service to record
            yourself, those video files are stored and associated with your
            account.
          </li>
          <li>
            <strong>Usage Data:</strong> We may collect anonymised information
            about how you interact with the app for performance monitoring and
            improvement.
          </li>
        </ul>

        <h2>3. How We Use Your Data</h2>
        <p>We use your personal data to:</p>
        <ul>
          <li>Provide and maintain the Service;</li>
          <li>Authenticate users via Clerk;</li>
          <li>Process payments via Stripe;</li>
          <li>Store and manage your recorded videos;</li>
          <li>Respond to support requests and feedback;</li>
          <li>Improve and personalise your experience.</li>
        </ul>

        <h2>4. Legal Basis for Processing</h2>
        <p>
          We process your personal data based on the following legal grounds:
        </p>
        <ul>
          <li>Your consent (e.g. when you register or submit a recording);</li>
          <li>To perform a contract with you (e.g. paid subscriptions);</li>
          <li>
            Our legitimate interests in improving and securing the Service.
          </li>
        </ul>

        <h2>5. Sharing Your Information</h2>
        <p>
          We do not sell your personal data. We only share it with third parties
          when necessary to deliver the Service, such as:
        </p>
        <ul>
          <li>
            <strong>Clerk:</strong> For secure user authentication and account
            management;
          </li>
          <li>
            <strong>Stripe:</strong> For secure payment processing;
          </li>
          <li>
            Service providers who assist with hosting and analytics, under
            strict confidentiality agreements.
          </li>
        </ul>

        <h2>6. Data Storage and Security</h2>
        <p>
          Your data is stored securely using reputable third-party services with
          appropriate safeguards in place. We take reasonable measures to
          protect your information from unauthorised access, loss, or misuse.
        </p>

        <h2>7. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you;</li>
          <li>Request correction or deletion of your personal data;</li>
          <li>Withdraw your consent at any time;</li>
          <li>
            Lodge a complaint with the Information Commissioner’s Office (ICO).
          </li>
        </ul>

        <h2>8. Data Retention</h2>
        <p>
          We retain your personal data only for as long as necessary to provide
          the Service and meet our legal obligations. You may request deletion
          of your account and data at any time.
        </p>

        <h2>9. Children’s Privacy</h2>
        <p>
          This Service is not intended for use by children under the age of 13.
          We do not knowingly collect personal data from children.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. If we make
          material changes, we will notify you by email or through the app.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy, you
          can contact us{" "}
          <Link className="underline" href={ROUTES.dashboard.contact}>
            here
          </Link>
          . Note you must be a signed in user to use the contact form.
        </p>
      </div>
    </article>
  );
}

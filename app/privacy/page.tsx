"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const SITE_NAME = "TuliaStays"; // TODO: hakikisha inaendana na SITE_NAME kwenye components/whatsapp.tsx
const LAST_UPDATED = "July 11, 2026"; // TODO: badilisha tarehe kila ukibadilisha policy

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-white px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to {SITE_NAME}
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-10 space-y-8 text-slate-300 text-sm leading-relaxed">

          <section>
            <h2 className="text-white text-lg font-bold mb-3">1. Introduction</h2>
            <p>
              This Privacy Policy explains how {SITE_NAME} ("we", "us", "our") collects, uses, and protects
              information when you visit our website (the "Site"). We keep data collection minimal — the
              Site is a property listing showcase, not a booking or payment platform, so most of your
              interaction with us happens directly via WhatsApp, outside of this Site.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">2. Information We Collect</h2>
            <p className="mb-3">We do not require you to create an account to browse listings. The Site may collect:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Browsing information</strong> — basic technical data such as
                device/browser type and pages visited, collected automatically for the Site to function
                properly.
              </li>
              <li>
                <strong className="text-white">Information you choose to share via WhatsApp</strong> — when
                you contact us through the WhatsApp button, your phone number and any details you send
                (name, dates, questions) are received by us directly through WhatsApp, not stored on this
                Site's database.
              </li>
            </ul>
            <p className="mt-3">
              We do not collect payment card details, ID documents, or other sensitive personal information
              through this Site.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">3. How We Use Information</h2>
            <p className="mb-2">Any information shared with us (primarily via WhatsApp) is used only to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Respond to your inquiries about property availability and pricing</li>
              <li>Coordinate bookings, check-in details, and stay arrangements</li>
              <li>Improve the accuracy and usefulness of our listings</li>
            </ul>
            <p className="mt-3">
              We do not sell, rent, or share your personal information with third parties for marketing
              purposes.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">4. Third-Party Services</h2>
            <p className="mb-3">
              The Site relies on the following third-party services to operate, each governed by their own
              privacy practices:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Supabase</strong> — hosts our property listing data and
                images (photos, titles, descriptions, pricing). No guest personal data is stored here since
                bookings happen via WhatsApp.
              </li>
              <li>
                <strong className="text-white">WhatsApp (Meta)</strong> — used for all direct communication
                between you and {SITE_NAME}. Messages sent via WhatsApp are subject to WhatsApp's own
                privacy policy.
              </li>
              <li>
                <strong className="text-white">Vercel</strong> — hosts the Site itself.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">5. Cookies</h2>
            <p>
              The Site may use minimal, essential cookies required for basic functionality (such as
              remembering your session while browsing). We do not use invasive tracking or advertising
              cookies.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">6. Data Retention</h2>
            <p>
              Property listing data is retained for as long as the listing is active on the Site.
              Conversations conducted via WhatsApp are retained according to WhatsApp's own retention
              settings and your device's chat history, not controlled by us.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">7. Your Rights</h2>
            <p className="mb-2">
              Under the Kenya Data Protection Act, 2019, you have the right to request access to, correction
              of, or deletion of any personal information you have shared with us. To exercise these rights,
              message us directly via the WhatsApp contact button on the Site.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">8. Children's Privacy</h2>
            <p>
              The Site is not directed at children, and we do not knowingly collect information from
              individuals under the age of 18.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Continued use of the Site after changes
              are posted constitutes your acceptance of the revised policy. The "Last updated" date above
              reflects the most recent revision.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or how your information is handled, please
              reach out to us via the WhatsApp contact button on this Site.
            </p>
          </section>

        </div>

        <p className="text-slate-600 text-xs mt-8 text-center">
          This document is a general template and does not constitute legal advice.
        </p>
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const SITE_NAME = "TuliaStays"; // TODO: hakikisha inaendana na SITE_NAME kwenye components/whatsapp.tsx
const LAST_UPDATED = "July 11, 2026"; // TODO: badilisha tarehe kila ukibadilisha terms

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-white px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to {SITE_NAME}
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-10 space-y-8 text-slate-300 text-sm leading-relaxed">

          <section>
            <h2 className="text-white text-lg font-bold mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the {SITE_NAME} website ("the Site"), you agree to be bound by these
              Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Site.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">2. Description of Service</h2>
            <p className="mb-3">
              {SITE_NAME} is a listing website that showcases short-stay properties available in Kenya.
              The Site does <strong className="text-white">not</strong> process bookings, payments, or
              reservations directly. All inquiries, availability checks, negotiations, and bookings are
              conducted directly between you and {SITE_NAME} via WhatsApp or other direct communication
              channels shown on the Site.
            </p>
            <p>
              {SITE_NAME} does not operate as a booking platform, payment processor, or escrow service.
              Any payment arrangements, deposits, or transactions you make are conducted at your own
              discretion, directly with {SITE_NAME}, outside of this Site.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">3. Property Listings</h2>
            <p className="mb-3">
              We make reasonable efforts to ensure that property listings (including photos, descriptions,
              pricing, and availability) are accurate and up to date. However, we do not guarantee that all
              information displayed on the Site is complete, current, or error-free at all times.
            </p>
            <p>
              Prices, availability, and property details are subject to change without prior notice and
              should be confirmed directly with us via WhatsApp before finalizing any arrangement.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">4. No Guarantee of Booking</h2>
            <p>
              Viewing a property on the Site does not guarantee its availability. All bookings are subject
              to confirmation by {SITE_NAME} directly. We reserve the right to decline any booking request
              at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">5. Payments &amp; Cancellations</h2>
            <p>
              Since all payments are arranged directly between you and {SITE_NAME} outside of this Site,
              payment terms, deposit requirements, cancellation policies, and refund conditions will be
              communicated to you directly at the time of booking. We recommend confirming these details in
              writing (e.g., via WhatsApp) before making any payment.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">6. User Conduct</h2>
            <p>You agree not to use the Site to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
              <li>Submit false, misleading, or fraudulent inquiries</li>
              <li>Attempt to gain unauthorized access to the Site or its underlying systems</li>
              <li>Copy, scrape, or reproduce content from the Site without permission</li>
              <li>Use the Site for any unlawful purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">7. Intellectual Property</h2>
            <p>
              All content on the Site, including text, images, logos, and design elements, is the property
              of {SITE_NAME} unless otherwise stated, and may not be reproduced, distributed, or used
              without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, {SITE_NAME} shall not be liable for any indirect,
              incidental, or consequential damages arising from your use of the Site, your stay at any
              listed property, or any communications or transactions conducted via WhatsApp or other
              channels outside of the Site.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">9. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the Site after changes are
              posted constitutes your acceptance of the revised Terms. The "Last updated" date at the top
              of this page reflects the most recent revision.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">10. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the Republic of
              Kenya, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">11. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please reach out to us via the WhatsApp contact
              button on this Site.
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
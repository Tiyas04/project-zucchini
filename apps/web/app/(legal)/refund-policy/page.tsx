import { H1, H2, P } from "@repo/ui/core/typography";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Nitrutsav 2026",
  description:
    "Refund Policy for Nitrutsav 2026 - Learn about our registration fees and refund terms.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <H1 className="text-slate-900 mb-4">Refund Policy</H1>
          <p className="text-slate-600">Nitrutsav 2026</p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto prose prose-slate">
          <P className="text-slate-700 leading-relaxed mb-6">
            At Nitrutsav 2026, we are committed to providing an enriching experience for all
            participants. Please review our refund policy carefully:
          </P>

          <H2 className="text-slate-900 mt-12 mb-6">Pricing</H2>
          <P className="text-slate-700 leading-relaxed mb-6">
            The registration fees for Nitrutsav 2026 apply to all students from outside NIT
            Rourkela. This fee grants access to all events, workshops, and exhibitions during the
            fest. For students of NIT Rourkela, registration is completely free.
          </P>
          <P className="text-slate-700 leading-relaxed mb-6">
            Registration covers participation in most events, though some workshops may require
            additional fees for materials. We encourage all students to register early to secure
            their spot, as registrations may close once we reach capacity.
          </P>

          <H2 className="text-slate-900 mt-12 mb-6">No Refunds on Registrations and Payments</H2>
          <P className="text-slate-700 leading-relaxed mb-6">
            Once registration or payment is completed, refunds will not be issued under any
            circumstances. This applies to all ticket types, event passes, and additional purchases
            made through our website.
          </P>
          <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-900 font-semibold">Important:</p>
            <p className="text-blue-800">
              We highly recommend double-checking your availability before confirming your
              registration.
            </p>
          </div>

          <H2 className="text-slate-900 mt-12 mb-6">Event Cancellation by Organizers</H2>
          <P className="text-slate-700 leading-relaxed mb-6">
            Refunds will only be issued if Nitrutsav 2026 is canceled by the organizers. In such a
            case, all registered participants will receive a full refund through the original
            payment method, processed within 14 days of the cancellation announcement.
          </P>

          <H2 className="text-slate-900 mt-12 mb-6">Force Majeure</H2>
          <P className="text-slate-700 leading-relaxed mb-6">
            In the event of unforeseen circumstances such as natural disasters, government
            restrictions, or other events beyond our control, Nitrutsav 2026 organizers will make
            every effort to reschedule. However, refunds will not be issued under these conditions.
            Refunds will only be processed if Nitrutsav 2026 is officially canceled by the
            organizers.
          </P>

          <H2 className="text-slate-900 mt-12 mb-6">Contact for Help</H2>
          <P className="text-slate-700 leading-relaxed mb-6">
            If you have any questions or need assistance with your registration, please feel free to
            reach out to our support team at{" "}
            <a
              href="mailto:team@nitrutsav.in"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              team@nitrutsav.in
            </a>
            . We are here to help with any queries related to registration, event details, or
            technical issues. Our team will respond within 24-48 hours to ensure you have all the
            information you need to enjoy Nitrutsav 2026 to the fullest.
          </P>

          <div className="bg-slate-100 border border-slate-300 rounded-lg p-6 mt-8">
            <p className="text-slate-700 font-semibold">
              By registering for Nitrutsav 2026, you agree to abide by our refund policy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

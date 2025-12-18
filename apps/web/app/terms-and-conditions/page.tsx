import { H1, H2, H3, P } from "@repo/ui/core/typography";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Nitrutsav 2026",
  description:
    "Terms and Conditions for Nitrutsav 2026 - Read our terms of service and usage policies.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <H1 className="text-slate-900 mb-4">Terms and Conditions</H1>
          <p className="text-slate-600">Last updated: 15th December, 2025</p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto prose prose-slate">
          <H2 className="text-slate-900 mb-6">Welcome to Nitrutsav 2026!</H2>
          <P className="text-slate-700 leading-relaxed mb-6">
            The website linked gives you the outline of our protocols. If you agree to the set of
            terms and conditions, you are welcomed as an entrant and will be redirected to proceed
            further.
          </P>

          <H2 className="text-slate-900 mt-12 mb-6">Licence</H2>
          <P className="text-slate-700 leading-relaxed mb-4">
            Unless otherwise stated, Nitrutsav and/or its licensors own the intellectual property
            rights for all material on Nitrutsav 2026. All intellectual property rights are
            reserved. You may access this from Nitrutsav 2026 for your personal use subject to
            restrictions set in these terms and conditions.
          </P>
          <P className="text-slate-700 leading-relaxed mb-4">You must not:</P>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
            <li>Copy or republish material from Nitrutsav 2026</li>
            <li>Sell, rent, or sub-license material from Nitrutsav 2026</li>
            <li>Reproduce, duplicate or copy material from Nitrutsav 2026</li>
            <li>Redistribute content from Nitrutsav 2026</li>
          </ul>
          <P className="text-slate-700 leading-relaxed mb-6">
            This Agreement shall begin on the date hereof.
          </P>

          <H2 className="text-slate-900 mt-12 mb-6">Eligibility</H2>
          <P className="text-slate-700 leading-relaxed mb-6">
            Students from recognized educational institutions across India are eligible to
            participate in Nitrutsav 2026. However, students from blacklisted institutions (e.g.,
            Siksha O Anusandhan (SOA) University, including all its affiliated colleges, and
            Institute of Technical Education and Research (ITER)) are strictly prohibited from
            registering or participating in the fest.
          </P>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
            <p className="text-amber-900 font-semibold">Note:</p>
            <p className="text-amber-800">
              If a student from a banned institution registers, their registration will be canceled,
              and no refund will be provided.
            </p>
          </div>

          <H2 className="text-slate-900 mt-12 mb-6">Disclaimer</H2>
          <P className="text-slate-700 leading-relaxed mb-4">
            To the maximum permitted visitors conduct, nothing in this disclaimer will:
          </P>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
            <li>Limit or exclude our or your liability for death or personal injury.</li>
            <li>
              Limit or exclude our or your liability for fraud or fraudulent misrepresentation.
            </li>
            <li>
              Limit any of our or your liabilities in any way that is not permitted under applicable
              law.
            </li>
            <li>
              Exclude any of our or your liabilities that may not be excluded under applicable law.
            </li>
          </ul>

          <P className="text-slate-700 leading-relaxed mb-4">
            The limitations and prohibitions of liability set in this section and elsewhere in this
            disclaimer:
          </P>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
            <li>Are subject to the preceding paragraph.</li>
            <li>
              Govern all liabilities arising under the disclaimer, including liabilities arising in
              contract, in tort, and for breach of statutory duty.
            </li>
          </ul>

          <P className="text-slate-700 leading-relaxed mb-6">
            As the website can be accessed by all verified visitors, we shall not uphold any
            liability for any damage.
          </P>

          <H2 className="text-slate-900 mt-12 mb-6">Contact Us</H2>
          <P className="text-slate-700 leading-relaxed mb-6">
            If you have any questions about these Terms and Conditions, please contact us by email
            at{" "}
            <a
              href="mailto:team@nitrutsav.in"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              team@nitrutsav.in
            </a>
          </P>
        </div>
      </section>
    </div>
  );
}

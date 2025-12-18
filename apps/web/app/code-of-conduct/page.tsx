import { H1, H2, P } from "@repo/ui/core/typography";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code of Conduct | Nitrutsav 2026",
  description:
    "Code of Conduct for Nitrutsav 2026 - Learn about our community guidelines and expected behavior.",
};

export default function CodeOfConductPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <H1 className="text-slate-900 mb-4">Code of Conduct</H1>
          <p className="text-slate-600">Last updated: 15th December, 2025</p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto prose prose-slate">
          <P className="text-slate-700 leading-relaxed mb-6">
            This Code of Conduct outlines our expectations for all participants at Nitrutsav 2026.
            We are committed to providing a welcoming, safe, and inclusive environment for everyone.
          </P>

          <H2 className="text-slate-900 mt-12 mb-6">Expected Behavior</H2>
          <P className="text-slate-700 leading-relaxed mb-4">All participants are expected to:</P>
          <ul className="list-disc pl-6 space-y-3 text-slate-700 mb-6">
            <li>Be respectful and considerate of others</li>
            <li>Communicate openly and thoughtfully with fellow participants</li>
            <li>Respect the boundaries and personal space of others</li>
            <li>Be collaborative and supportive</li>
            <li>Alert event organizers if you notice violations of this Code of Conduct</li>
            <li>Follow all venue rules and regulations</li>
            <li>Respect the cultural and artistic performances</li>
          </ul>

          <H2 className="text-slate-900 mt-12 mb-6">Unacceptable Behavior</H2>
          <P className="text-slate-700 leading-relaxed mb-4">
            The following behaviors are considered unacceptable:
          </P>
          <ul className="list-disc pl-6 space-y-3 text-slate-700 mb-6">
            <li>Harassment, intimidation, or discrimination in any form</li>
            <li>Physical or verbal abuse</li>
            <li>Unwelcome sexual attention or advances</li>
            <li>Disruptive behavior during events or performances</li>
            <li>Damage to venue property or equipment</li>
            <li>Possession or use of illegal substances</li>
            <li>Violation of photography or recording policies</li>
            <li>Any behavior that creates an unsafe environment</li>
          </ul>

          <H2 className="text-slate-900 mt-12 mb-6">Consequences</H2>
          <P className="text-slate-700 leading-relaxed mb-6">
            Participants who engage in unacceptable behavior may be asked to stop immediately. If
            the behavior continues, organizers reserve the right to take appropriate action,
            including:
          </P>
          <ul className="list-disc pl-6 space-y-3 text-slate-700 mb-6">
            <li>Warning the participant</li>
            <li>Expulsion from the event without refund</li>
            <li>Reporting to appropriate authorities if necessary</li>
            <li>Banning from future Nitrutsav events</li>
          </ul>

          <H2 className="text-slate-900 mt-12 mb-6">Reporting</H2>
          <P className="text-slate-700 leading-relaxed mb-6">
            If you experience or witness unacceptable behavior, or have any concerns, please report
            it immediately to event organizers. You can contact us at:
          </P>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
            <p className="text-slate-700 mb-2">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:team@nitrutsav.in"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                team@nitrutsav.in
              </a>
            </p>
            <p className="text-slate-700 mb-2">
              <strong>Convenors:</strong>
            </p>
            <ul className="list-none pl-4 space-y-1 text-slate-700">
              <li>
                Sidheswar Mahananda:{" "}
                <a href="tel:6371872187" className="text-blue-600 hover:text-blue-700">
                  6371872187
                </a>
              </li>
              <li>
                Shiba Nanda Sethy:{" "}
                <a href="tel:7682866577" className="text-blue-600 hover:text-blue-700">
                  7682866577
                </a>
              </li>
            </ul>
            <p className="text-slate-700 mt-2">
              <strong>Organizing Team:</strong>
            </p>
            <ul className="list-none pl-4 space-y-1 text-slate-700">
              <li>
                Debadutta Nayak:{" "}
                <a href="tel:7855034580" className="text-blue-600 hover:text-blue-700">
                  7855034580
                </a>
              </li>
            </ul>
          </div>

          <H2 className="text-slate-900 mt-12 mb-6">Safety and Security</H2>
          <P className="text-slate-700 leading-relaxed mb-6">
            Your safety is our priority. Event organizers and security personnel will be present
            throughout the venue. In case of emergency, please contact the nearest organizer or
            security personnel immediately.
          </P>

          <H2 className="text-slate-900 mt-12 mb-6">Photography and Recording</H2>
          <P className="text-slate-700 leading-relaxed mb-6">
            Photography and video recording may be permitted in designated areas. Please respect
            performers' and participants' rights. Professional photography or recording for
            commercial purposes requires prior permission from organizers.
          </P>

          <H2 className="text-slate-900 mt-12 mb-6">Acknowledgment</H2>
          <P className="text-slate-700 leading-relaxed mb-6">
            By participating in Nitrutsav 2026, you acknowledge that you have read and agree to
            abide by this Code of Conduct. We appreciate your cooperation in making Nitrutsav 2026 a
            safe, welcoming, and enjoyable experience for everyone.
          </P>

          <div className="bg-gray-50 border-l-4 border-blue-500 p-6 mt-8">
            <p className="text-blue-900 font-semibold mb-2">Remember:</p>
            <p className="text-blue-800">
              Nitrutsav 2026 is a celebration of culture, creativity, and community. Let's work
              together to create an inclusive and memorable experience for all participants.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

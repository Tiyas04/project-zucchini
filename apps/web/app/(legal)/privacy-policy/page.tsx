import { H1, H2, H3, P } from "@repo/ui/core/typography";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Nitrutsav 2026",
  description:
    "Privacy Policy for Nitrutsav 2026 - Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <H1 className="text-slate-900 mb-4">Privacy Policy</H1>
          <p className="text-slate-600">Last updated: 15th December, 2025</p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto prose prose-slate">
          <P className="text-slate-700 leading-relaxed mb-6">
            This Privacy Policy describes our policies and procedures on the collection, use, and
            disclosure of your information when you use the Service and tells you about your privacy
            rights and how the law protects you. We use Your Personal data to provide and improve
            the Service. By using the Service, You agree to the collection and use of information in
            accordance with this Privacy Policy.
          </P>

          <H2 className="text-slate-900 mt-12 mb-6">Interpretation and Definitions</H2>

          <H3 className="text-slate-900 mt-8 mb-4">Interpretation</H3>
          <P className="text-slate-700 leading-relaxed mb-6">
            The words of which the initial letter is capitalised have meanings defined under the
            following conditions. The following definitions shall have the same meaning regardless
            of whether they appear in singular or in plural.
          </P>

          <H3 className="text-slate-900 mt-8 mb-4">Definitions</H3>
          <P className="text-slate-700 leading-relaxed mb-4">
            For the purposes of this Privacy Policy:
          </P>
          <ul className="list-disc pl-6 space-y-3 text-slate-700 mb-6">
            <li>
              <strong>Account</strong> means a unique account created for You to access our Service
              or parts of our Service.
            </li>
            <li>
              <strong>Affiliate</strong> means an entity that controls, is controlled by or is under
              common control with a party, where "control" means ownership of 50% or more of the
              shares, equity interest or other securities entitled to vote for election of directors
              or other managing authority.
            </li>
            <li>
              <strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in
              this Agreement) refers to Nitrutsav.
            </li>
            <li>
              <strong>Cookies</strong> are small files that are placed on Your computer, mobile
              device or any other device by a website, containing the details of Your browsing
              history on that website among its many uses.
            </li>
            <li>
              <strong>Country</strong> refers to: Orissa, India
            </li>
            <li>
              <strong>Device</strong> means any device that can access the Service such as a
              computer, a cell phone or a digital tablet.
            </li>
            <li>
              <strong>Personal Data</strong> is any information that relates to an identified or
              identifiable individual.
            </li>
            <li>
              <strong>Service</strong> refers to the Website.
            </li>
            <li>
              <strong>Service Provider</strong> means any natural or legal person who processes the
              data on behalf of the Company.
            </li>
            <li>
              <strong>Usage Data</strong> refers to data collected automatically, either generated
              by the use of the Service or from the Service infrastructure itself.
            </li>
            <li>
              <strong>Website</strong> refers to the official website of Nitrutsav.
            </li>
            <li>
              <strong>You</strong> means the individual accessing or using the Service, or the
              company, or other legal entity on behalf of which such individual is accessing or
              using the Service, as applicable.
            </li>
          </ul>

          <H2 className="text-slate-900 mt-12 mb-6">Collecting and Using Your Personal Data</H2>

          <H3 className="text-slate-900 mt-8 mb-4">Types of Data Collected</H3>

          <h4 className="text-lg font-bold text-slate-900 mt-6 mb-3">Personal Data</h4>
          <P className="text-slate-700 leading-relaxed mb-4">
            While using Our Service, We may ask You to provide Us with certain personally
            identifiable information that can be used to contact or identify You. Personally
            identifiable information may include, but is not limited to:
          </P>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Phone number</li>
            <li>Address, State, Province, ZIP/Postal code, City</li>
            <li>Usage Data</li>
          </ul>

          <h4 className="text-lg font-bold text-slate-900 mt-6 mb-3">Usage Data</h4>
          <P className="text-slate-700 leading-relaxed mb-6">
            Usage Data is collected automatically when using the Service. Usage Data may include
            information such as Your Device's Internet Protocol address (e.g. IP address), browser
            type, browser version, the pages of our Service that You visit, the time and date of
            Your visit, the time spent on those pages, unique device identifiers and other
            diagnostic data.
          </P>

          <H3 className="text-slate-900 mt-8 mb-4">Use of Your Personal Data</H3>
          <P className="text-slate-700 leading-relaxed mb-4">
            The Company may use Personal Data for the following purposes:
          </P>
          <ul className="list-disc pl-6 space-y-3 text-slate-700 mb-6">
            <li>
              To provide and maintain our Service, including to monitor the usage of our Service.
            </li>
            <li>To manage Your Account: to manage Your registration as a user of the Service.</li>
            <li>
              For the performance of a contract: the development, compliance and undertaking of the
              purchase contract for the products, items or services You have purchased or of any
              other contract with Us through the Service.
            </li>
            <li>
              To contact You: To contact You by email, telephone calls, SMS, or other equivalent
              forms of electronic communication.
            </li>
            <li>
              To provide You with news, special offers and general information about other goods,
              services and events which we offer.
            </li>
            <li>To manage Your requests: To attend and manage Your requests to Us.</li>
          </ul>

          <H2 className="text-slate-900 mt-12 mb-6">Security of Your Personal Data</H2>
          <P className="text-slate-700 leading-relaxed mb-6">
            We prioritize the security of your data, employing commercially acceptable methods for
            protection. However, please note that no method of internet transmission or electronic
            storage can guarantee absolute security. While we take steps to protect your
            information, we cannot ensure it will be fully secure.
          </P>

          <H2 className="text-slate-900 mt-12 mb-6">Children's Privacy</H2>
          <P className="text-slate-700 leading-relaxed mb-6">
            Our Service is not directed to anyone under the age of 13. We do not knowingly collect
            personally identifiable information from anyone under this age. If you are a parent or
            guardian and discover that your child has provided us with Personal Data, please contact
            us.
          </P>

          <H2 className="text-slate-900 mt-12 mb-6">Changes to This Privacy Policy</H2>
          <P className="text-slate-700 leading-relaxed mb-6">
            We may periodically update our Privacy Policy. We will notify you of changes by posting
            the new Privacy Policy on this page and sending you an email and/or a prominent notice
            on our Service before the change becomes effective. The "Last updated" date at the top
            of this Privacy Policy will also be revised.
          </P>

          <H2 className="text-slate-900 mt-12 mb-6">Contact Us</H2>
          <P className="text-slate-700 leading-relaxed mb-6">
            If you have any questions about this Privacy Policy, please contact us by email at{" "}
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

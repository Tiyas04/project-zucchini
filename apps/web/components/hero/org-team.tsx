import { H2 } from "@repo/ui/core/typography";

const ContactCard = ({ name, phone }: { name: string; phone: string }) => (
  <div className="border border-gray-200 p-6 bg-white flex flex-col">
    <span className="text-xl font-semibold text-gray-900 mb-2">{name}</span>
    <span className="text-gray-600">{phone}</span>
  </div>
);

export default function OrgTeam() {
  return (
    <div className="px-6 py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <H2 className="text-3xl font-bold text-gray-900 mb-8">Convenors</H2>
          <div className="grid md:grid-cols-2 gap-6">
            <ContactCard name="Sidheswar Mahananda" phone="6371872187" />
            <ContactCard name="Shiba Nanda Sethy" phone="7682866577" />
          </div>
        </div>

        <div>
          <H2 className="text-3xl font-bold text-gray-900 mb-8">Organizing Team</H2>
          <div className="grid md:grid-cols-2 gap-6">
            <ContactCard name="Debadutta Nayak" phone="7855034580" />
          </div>
        </div>
      </div>
    </div>
  );
}

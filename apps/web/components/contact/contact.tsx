import { contactsFirstRow, contactsSecondRow } from "@/config/contact";
import { ContactCard } from "./contact-card";
import { SectionHeading } from "../ui";

export default function ContactSection() {
  const instituteInfo = {
    name: "NATIONAL INSTITUTE OF TECHNOLOGY ROURKELA",
    location: `SRICCE OFFICE NIT ROURKELA, NATIONAL INSTITUTE
OF TECHNOLOGY,ROURKELA, SECTOR-02, ROURKELA, Sundargarh, Odisha, 769008`,
  };
  function InstituteInfoCard() {
    return (
      <div className="gradient-border rounded-lg p-6 sm:p-8 w-full max-w-xl">
        <div className="text-center">
          <h2 className=" text-left text-white/80">Legal Name:</h2>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 uppercase">
            {instituteInfo.name}
          </h3>
          <h2 className="text-left text-white/80">Legal Address:</h2>
          <p className="text-base sm:text-lg text-white font-semibold uppercase">
            {instituteInfo.location}
          </p>
        </div>
      </div>
    );
  }
  return (
    <section className="flex flex-col gap-8 sm:gap-12 lg:gap-16 items-center justify-center w-full font-inria">
      <div className="flex flex-col justify-center items-center gap-12 sm:gap-16 lg:gap-20 w-full">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-12 sm:gap-16 md:gap-24 lg:gap-32 xl:gap-40 w-full">
          {contactsFirstRow.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>

        {/* {contactsSecondRow.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))} */}
        <div className="about-card-body max-w-4xl mx-auto w-full">
          <SectionHeading
            title="Organising Team"
            containerClassName="mb-20 mt-5"
            textClassName="text-base"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactsSecondRow.map((contact) => (
              <div
                key={contact.id}
                className="flex flex-col gap-2 bg-white/20 w-full p-4 rounded-lg"
              >
                <p className="text-base">{contact.name}</p>
                <p className="text-base">{contact.role}</p>
                <p className="text-base">{contact.phone}</p>
              </div>
            ))}
          </div>
        </div>
        <InstituteInfoCard />
      </div>
    </section>
  );
}

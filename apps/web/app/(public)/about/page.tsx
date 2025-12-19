import { H1, H2, H3, P, Lead } from "@repo/ui/core/typography";
import type { Metadata } from "next";
import { Lightbulb, Users, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About | Nitrutsav 2026",
  description:
    "Learn about Nitrutsav 2026, NIT Rourkela's premier literary and cultural festival celebrating creativity, innovation, and cultural heritage.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <H1 className="text-slate-900 mb-6">About Nitrutsav 2026</H1>
          <Lead className="text-slate-600">
            Celebrating creativity, culture, and innovation at NIT Rourkela
          </Lead>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <H2 className="text-slate-900 mb-6">NITRUTSAV 2026</H2>
          <P className="text-slate-700 leading-relaxed mb-6">
            National Institute of Technology, Rourkela, enunciate the "offline" edition of its very
            own literary and cultural festival, NITRUTSAV 2026. Nitrutsav works to give students a
            creative outlet to commemorate and introspectively explore their creative freedom with
            pioneering ideas, celebrating the creative goodwill of a mind filled with ingenuity and
            innovation.
          </P>
          <P className="text-slate-700 leading-relaxed mb-6">
            With a plethora of fascinating cultural events, it also provides students with a gateway
            to showcase their creative zeal and appreciate their artistic aspects and willingness to
            discover hidden talents. With the hackneyed breakdown of academia and constant
            improvisation of grades, NITRUTSAV delivers different experiences to lure your mind to
            relaxation and enthusiasm.
          </P>
          <P className="text-slate-700 leading-relaxed mb-6">
            In the bizarre outbreak of the COVID-19 pandemic, Nitrusav was hosted on your screens
            last year. The essence of Nitrusav is restored to its complete form to captivate you
            through your eyes and into your mind. This time with the theme of "An Indian Filmic
            Fete", this impeccable beauty will mesmerise right through the windows of your soul.
          </P>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <H2 className="text-center text-slate-900 mb-12">Our Vision</H2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-blue-600" />
              </div>
              <H3 className="text-slate-900 mb-3">Innovation</H3>
              <P className="text-slate-600 mb-0">
                Fostering creative thinking and pioneering ideas through cultural expression and
                artistic exploration.
              </P>
            </div>

            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <H3 className="text-slate-900 mb-3">Community</H3>
              <P className="text-slate-600 mb-0">
                Building a vibrant community of artists, performers, and creative minds from across
                the nation.
              </P>
            </div>

            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <H3 className="text-slate-900 mb-3">Heritage</H3>
              <P className="text-slate-600 mb-0">
                Celebrating and showcasing the rich cultural legacy of Odisha and India's diverse
                traditions.
              </P>
            </div>
          </div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <H2 className="text-slate-900 mb-8">What Makes Nitrutsav Special</H2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <H3 className="text-slate-900 mb-2">Diverse Cultural Events</H3>
                <P className="text-slate-600 mb-0">
                  A wide range of cultural and literary events showcasing talent across dance,
                  music, drama, poetry, and more.
                </P>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <H3 className="text-slate-900 mb-2">Platform for Talent</H3>
                <P className="text-slate-600 mb-0">
                  Provides students with opportunities to showcase their creative abilities and
                  discover hidden talents.
                </P>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <H3 className="text-slate-900 mb-2">Cultural Legacy</H3>
                <P className="text-slate-600 mb-0">
                  Celebrates the cultural heritage of Odisha through traditional performances and
                  modern interpretations.
                </P>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <H3 className="text-slate-900 mb-2">Memorable Experience</H3>
                <P className="text-slate-600 mb-0">
                  Creates unforgettable memories through engaging events, workshops, and interactive
                  sessions.
                </P>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

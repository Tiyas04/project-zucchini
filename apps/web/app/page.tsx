import DummyAbout from "@/components/about/dummy-about";
import DummyHero from "@/components/hero/dummy-hero";
import OrgTeam from "@/components/hero/org-team";
import React from "react";

export default function Home() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <DummyHero />
      <DummyAbout />
      <OrgTeam />
    </div>
  );
}

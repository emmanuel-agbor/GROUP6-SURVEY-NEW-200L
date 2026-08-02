import { createFileRoute } from "@tanstack/react-router";
import {
  BenefitsSection,
  CtaSection,
  FaqSection,
  FeaturesSection,
  HeroSection,
  StatsSection,
  TestimonialsSection,
} from "@/components/marketing/landing-sections";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

const TITLE = "SurveyFlow — Build surveys, collect responses, read results";
const DESCRIPTION =
  "SurveyFlow is a modern survey platform for building surveys, collecting responses, and understanding results in one clean workspace.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
        <StatsSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}

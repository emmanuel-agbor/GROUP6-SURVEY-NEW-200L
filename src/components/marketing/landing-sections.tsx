import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Layers,
  LineChart,
  Lock,
  MousePointerClick,
  Share2,
  Users,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    icon: MousePointerClick,
    title: "Drag-free survey builder",
    body: "Nine question types, inline validation rules, and reordering that takes one click.",
  },
  {
    icon: Share2,
    title: "Share anywhere",
    body: "Publish a link, embed in a page, or send it to a segment — the survey adapts to the screen.",
  },
  {
    icon: BarChart3,
    title: "Live result reading",
    body: "Completion rates and response trends update as submissions arrive, no exports needed.",
  },
  {
    icon: Layers,
    title: "Reusable templates",
    body: "Save any survey as a starting point so your next round takes minutes, not afternoons.",
  },
  {
    icon: Lock,
    title: "Access you control",
    body: "Role-based permissions keep drafts private until the whole team is ready to ship them.",
  },
  {
    icon: LineChart,
    title: "Exports that behave",
    body: "Pull clean CSV output with the same columns every time, ready for your own analysis.",
  },
];

const BENEFITS = [
  {
    icon: Clock,
    title: "Ship a survey before lunch",
    body: "Everything from first question to published link lives in one uninterrupted flow.",
  },
  {
    icon: Users,
    title: "Bring the whole team in",
    body: "Comment, review, and approve drafts without a single attachment changing hands.",
  },
  {
    icon: CheckCircle2,
    title: "Trust what you measure",
    body: "Required fields, typed inputs, and duplicate protection keep the data usable.",
  },
];

const STATS = [
  { label: "Question types", value: "9" },
  { label: "Average setup time", value: "6 min" },
  { label: "Response views", value: "Live" },
  { label: "Export formats", value: "CSV" },
];

const TESTIMONIALS = [
  {
    quote:
      "We replaced three tools with SurveyFlow. Writing a survey now feels like writing a doc — and the results are readable without a data analyst.",
    name: "Blessing Thompson",
    role: "Team Lead, ",
  },
  {
    quote:
      "The builder is the first one my team didn't complain about. Reordering questions and marking them required is obvious from the first minute.",
    name: "Harmony Nyesom",
    role: "Researcher, Loop",
  },
  {
    quote:
      "Completion rate went up once we moved our onboarding survey over. Mobile respondents finally finish it.",
    name: "Wealth Imo",
    role: "CEO, Marvin",
  },
];

const FAQS = [
  {
    question: "How many surveys can I run at once?",
    answer:
      "As many as your plan allows. Active, draft, and archived surveys each live in their own view so a large workspace stays navigable.",
  },
  {
    question: "Can respondents answer on a phone?",
    answer:
      "Yes. Every question type is built mobile-first, with tap targets and keyboard behaviour tuned for small screens.",
  },
  {
    question: "Do I own my response data?",
    answer:
      "Always. You can export the full response set at any time, and deleting a survey removes its responses with it.",
  },
  {
    question: "Is there a limit on questions per survey?",
    answer:
      "No hard limit. Long surveys are paginated automatically so respondents see a manageable number of questions per screen.",
  },
  {
    question: "Can I collaborate with teammates?",
    answer:
      "Invite them to the workspace and assign a role. Editors build and publish, viewers read responses and analytics.",
  },
];

export function HeroSection() {
  return (
    <section className="hero-surface border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <Badge variant="outline" className="mb-6 border-primary/30 bg-card text-primary">
          Survey management, end to end
        </Badge>
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl md:text-6xl">
          Write better surveys. Read clearer answers.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          SurveyFlow gives your team one place to build surveys, collect responses, and understand
          what people actually said. No more copy-pasting between tools, no more lost context, no
          more messy exports.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/register">Create your workspace</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          No credit card required · Cancel whenever you like
        </p>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-semibold text-foreground">
          Built for the whole survey lifecycle
        </h2>
        <p className="mt-3 text-muted-foreground">
          From the first draft question to the final export, each step lives in the same interface.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="transition-shadow hover:shadow-[var(--shadow-soft)]">
            <CardHeader className="space-y-3">
              <span className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                <feature.icon className="size-5" aria-hidden="true" />
              </span>
              <CardTitle className="text-base">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{feature.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function BenefitsSection() {
  return (
    <section id="benefits" className="scroll-mt-20 border-y border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold text-foreground">
              Less tool wrangling, more listening
            </h2>
            <p className="mt-3 text-muted-foreground">
              Teams move from question to insight in one sitting because nothing has to be handed
              off, re-formatted, or re-uploaded.
            </p>
            <Button asChild className="mt-8">
              <Link to="/register">Start for free</Link>
            </Button>
          </div>
          <ul className="space-y-6">
            {BENEFITS.map((benefit) => (
              <li key={benefit.title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <benefit.icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-foreground">{benefit.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{benefit.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function StatsSection() {
  return (
    <section aria-label="Product highlights" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <dl className="grid grid-cols-2 gap-6 rounded-xl border border-border bg-card p-8 md:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <dd className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
              {stat.value}
            </dd>
            <dt className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <h2 className="max-w-2xl text-3xl font-semibold text-foreground">
        Trusted by teams who ask a lot of questions
      </h2>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {TESTIMONIALS.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6"
          >
            <blockquote className="text-sm leading-relaxed text-foreground">
              “{testimonial.quote}”
            </blockquote>
            <figcaption className="mt-6 text-sm">
              <span className="block font-medium text-foreground">{testimonial.name}</span>
              <span className="text-muted-foreground">{testimonial.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-20 border-y border-border bg-card">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-semibold text-foreground">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="mt-8">
          {FAQS.map((faq, index) => (
            <AccordionItem key={faq.question} value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-base">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section id="cta" className="hero-surface scroll-mt-20">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
          Your next survey is ten minutes away
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Create a workspace, build your first survey, and share it before the meeting ends.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/register">Get started free</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/dashboard">View the dashboard</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

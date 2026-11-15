import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Lightbulb, Rocket, Users } from "lucide-react";
import careersImg from "@/assets/careers-team.jpg";
import { PageHero, Section, SectionHeading, IconBadge } from "@/components/site/primitives";
import { CareerForm } from "@/components/site/CareerForm";
import { PageWrapper } from "@/components/site/PageWrapper";
import { pageHead } from "@/lib/seo";
import { SITE } from "@/config/site";

const PERKS = [
  {
    Icon: Rocket,
    title: "Real client work",
    description:
      "Work on live campaigns for real businesses from day one, not just practice projects.",
  },
  {
    Icon: BookOpen,
    title: "Learn by doing",
    description: "Pick up skills across social media, SEO, ads, design and content in one place.",
  },
  {
    Icon: Users,
    title: "Small, supportive team",
    description:
      "Your ideas are heard and your work is visible. Everyone helps each other improve.",
  },
  {
    Icon: Lightbulb,
    title: "Room to experiment",
    description: "Try new formats, tools and ideas, and see what actually works for clients.",
  },
];

export const Route = createFileRoute("/careers")({
  head: () =>
    pageHead({
      title: "Careers at Social Waale | Marketing Jobs in Chandigarh",
      description:
        "Want to work in digital marketing in Chandigarh? Send your resume to Social Waale for social media, SEO, ads, design, video, web and internship roles.",
      path: "/careers",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Careers", path: "/careers" },
      ],
    }),
  component: CareersPage,
});

function CareersPage() {
  return (
    <PageWrapper>
      <PageHero
        eyebrow="Careers"
        title={
          <>
            Grow your career with <span className="text-gradient">Social Waale</span>
          </>
        }
        description="We’re always happy to hear from people who love marketing, design, content and technology. Send us your resume and we’ll reach out when a suitable role opens."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Careers", path: "/careers" },
        ]}
      />
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Why join us"
              title="A place to learn fast and do meaningful work"
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {PERKS.map(({ Icon, title, description }) => (
                <div
                  key={title}
                  className="reveal rounded-2xl border border-border bg-surface/70 p-5"
                >
                  <IconBadge className="h-10 w-10">
                    <Icon className="h-4 w-4" />
                  </IconBadge>
                  <h3 className="mt-4 font-bold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <img
            src={careersImg}
            alt="Young marketing team collaborating at a creative agency workspace"
            width={1200}
            height={900}
            loading="lazy"
            className="reveal aspect-[4/3] w-full rounded-[2rem] border border-border object-cover shadow-card"
          />
        </div>
      </Section>
      <Section className="bg-gradient-section">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Apply"
            title="Send us your application"
            description={
              <>
                There are no specific openings listed right now, but we keep every application on
                file. You can also email your resume to{" "}
                <a href={SITE.emailHref} className="text-primary hover:underline">
                  {SITE.email}
                </a>
                .
              </>
            }
          />
          <div className="card-premium mt-12 p-6 sm:p-8">
            <CareerForm />
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
}

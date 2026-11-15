import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, SectionHeading } from "@/components/site/primitives";
import { ServiceCard } from "@/components/site/cards";
import { CTASection } from "@/components/site/CTASection";
import { PageWrapper } from "@/components/site/PageWrapper";
import { services } from "@/data/services";
import { pageHead, organizationRef } from "@/lib/seo";
import { absoluteUrl } from "@/config/site";
import { getPublicServicesFn } from "@/lib/cms/cms.functions";

export const Route = createFileRoute("/services")({
  loader: async () => {
    try {
      const res = await getPublicServicesFn();
      if (res.ok && res.services.length > 0) {
        return { cmsServices: res.services };
      }
    } catch (e) {
      console.error("Error loading CMS services in /services:", e);
    }
    return { cmsServices: null };
  },
  head: () =>
    pageHead({
      title: "Digital Marketing Services in Chandigarh | Social Waale",
      description:
        "Explore Social Waale’s digital marketing services: SEO, Google Ads, social media, content, branding, websites, CRO, offline ads, PR and photoshoots.",
      path: "/services",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
      ],
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Social Waale services",
          itemListElement: services.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Service",
              name: s.name,
              url: absoluteUrl(`/${s.slug}`),
              provider: organizationRef,
            },
          })),
        },
      ],
    }),
  component: ServicesPage,
});

function ServicesPage() {
  const loaderData = Route.useLoaderData();
  const displayServices = (loaderData?.cmsServices && loaderData.cmsServices.length > 0)
    ? (loaderData.cmsServices as any[])
    : services;

  return (
    <PageWrapper>
      <PageHero
        eyebrow="Our services"
        title={
          <>
            Digital marketing services that <span className="text-gradient">work together</span>
          </>
        }
        description="From being found on Google to turning visitors into enquiries, we plan every channel around one business goal. Pick a single service or let us manage your full digital presence."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
      />
      <Section>
        <SectionHeading
          eyebrow={`${displayServices.length} services, one team`}
          title="Everything your brand needs to grow online and offline"
          description="Each service page explains what’s included, how we work and who it’s for."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {displayServices.map((s, i) => (
            <ServiceCard key={s.slug} service={s} index={i} />
          ))}
        </div>
      </Section>
      <CTASection
        title="Not sure which service you need?"
        description="Tell us about your business and goals. We’ll suggest the right mix — even if it’s just one service to start with."
      />
    </PageWrapper>
  );
}

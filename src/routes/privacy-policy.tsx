import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { LEGAL_UPDATED, privacyPolicy } from "@/data/legal";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy-policy")({
  head: () =>
    pageHead({
      title: "Privacy Policy | Social Waale",
      description:
        "Read how Social Waale collects, uses, stores and protects information shared through enquiry and careers forms on our website, and how to contact us.",
      path: "/privacy-policy",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Privacy Policy", path: "/privacy-policy" },
      ],
    }),
  component: () => (
    <LegalPage
      title="Privacy Policy"
      intro="How Social Waale handles the information you share with us through this website."
      path="/privacy-policy"
      updated={LEGAL_UPDATED}
      sections={privacyPolicy}
    />
  ),
});

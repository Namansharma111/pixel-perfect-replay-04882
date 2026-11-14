import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { LEGAL_UPDATED, termsAndConditions } from "@/data/legal";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () =>
    pageHead({
      title: "Terms & Conditions | Social Waale",
      description:
        "The terms and conditions for using the Social Waale website and engaging our digital marketing services, including enquiries, content and liability.",
      path: "/terms-and-conditions",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Terms & Conditions", path: "/terms-and-conditions" },
      ],
    }),
  component: () => (
    <LegalPage
      title="Terms & Conditions"
      intro="The terms that apply when you use this website or work with Social Waale."
      path="/terms-and-conditions"
      updated={LEGAL_UPDATED}
      sections={termsAndConditions}
    />
  ),
});

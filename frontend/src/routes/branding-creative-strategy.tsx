import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";

export const Route = createFileRoute("/branding-creative-strategy")({
  head: () => serviceHead("branding-creative-strategy"),
  component: () => <ServicePage slug="branding-creative-strategy" />,
});

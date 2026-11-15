import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";

export const Route = createFileRoute("/seo-services")({
  head: () => serviceHead("seo-services"),
  component: () => <ServicePage slug="seo-services" />,
});

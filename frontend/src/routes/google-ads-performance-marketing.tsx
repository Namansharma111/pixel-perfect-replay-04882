import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";

export const Route = createFileRoute("/google-ads-performance-marketing")({
  head: () => serviceHead("google-ads-performance-marketing"),
  component: () => <ServicePage slug="google-ads-performance-marketing" />,
});

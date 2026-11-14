import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";

export const Route = createFileRoute("/social-media-marketing")({
  head: () => serviceHead("social-media-marketing"),
  component: () => <ServicePage slug="social-media-marketing" />,
});

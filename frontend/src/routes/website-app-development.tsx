import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";

export const Route = createFileRoute("/website-app-development")({
  head: () => serviceHead("website-app-development"),
  component: () => <ServicePage slug="website-app-development" />,
});

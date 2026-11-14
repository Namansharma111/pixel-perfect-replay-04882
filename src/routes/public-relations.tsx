import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";

export const Route = createFileRoute("/public-relations")({
  head: () => serviceHead("public-relations"),
  component: () => <ServicePage slug="public-relations" />,
});

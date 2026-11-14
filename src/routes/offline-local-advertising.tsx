import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";

export const Route = createFileRoute("/offline-local-advertising")({
  head: () => serviceHead("offline-local-advertising"),
  component: () => <ServicePage slug="offline-local-advertising" />,
});

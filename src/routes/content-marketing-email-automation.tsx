import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";

export const Route = createFileRoute("/content-marketing-email-automation")({
  head: () => serviceHead("content-marketing-email-automation"),
  component: () => <ServicePage slug="content-marketing-email-automation" />,
});

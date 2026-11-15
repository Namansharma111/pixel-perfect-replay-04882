import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";

export const Route = createFileRoute("/ui-ux-cro-optimization")({
  head: () => serviceHead("ui-ux-cro-optimization"),
  component: () => <ServicePage slug="ui-ux-cro-optimization" />,
});

import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";

export const Route = createFileRoute("/photoshoot-creative-media")({
  head: () => serviceHead("photoshoot-creative-media"),
  component: () => <ServicePage slug="photoshoot-creative-media" />,
});

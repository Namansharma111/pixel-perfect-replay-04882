import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { SERVICE_ORDER } from "@/data/services";
import { articles } from "@/data/articles";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
const matches = (path: string) => router.matchRoutes(path).at(-1)?.routeId;

describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    expect(matches("/")).not.toBe(rootRouteId);
  });

  it.each([
    "/about",
    "/services",
    "/articles",
    "/careers",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
  ])("has a page for %s", (path) => {
    expect(matches(path)).toBe(path === "/articles" ? "/articles/" : path);
  });

  it("has a page for each of the 10 services", () => {
    expect(SERVICE_ORDER).toHaveLength(10);
    for (const slug of SERVICE_ORDER) expect(matches(`/${slug}`)).toBe(`/${slug}`);
  });

  it("has a page for every article", () => {
    for (const a of articles) expect(matches(`/articles/${a.slug}`)).toBe("/articles/$slug");
  });
});

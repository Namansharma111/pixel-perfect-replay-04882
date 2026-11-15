import { createFileRoute } from "@tanstack/react-router";
import { PageWrapper } from "@/components/site/PageWrapper";
import { DownloaderPageLayout } from "@/components/downloader/DownloaderPageLayout";
import { getPublicDownloaderPageFn } from "@/lib/cms/cms.functions";
import { DEFAULT_DOWNLOADER_PAGES } from "@/lib/downloader/seo-data";
import { pageHead } from "@/lib/seo";

const SLUG = "instagram-video-downloader";
const FALLBACK = DEFAULT_DOWNLOADER_PAGES.find((p) => p.slug === SLUG)!;

export const Route = createFileRoute("/instagram-video-downloader")({
  validateSearch: (search: Record<string, unknown>): { preview?: string } => {
    const rawPreview = search["preview"];
    return {
      ...(typeof rawPreview === "string" ? { preview: rawPreview } : {}),
    };
  },
  loaderDeps: ({ search: { preview } }) => ({ preview }),
  loader: async ({ deps: { preview } }) => {
    try {
      const res = await getPublicDownloaderPageFn({ data: { slug: SLUG } });
      if (res && res.page) {
        let activePage = res.page;
        let isPreview = false;
        if (preview === "draft" && activePage.draft) {
          activePage = { ...activePage, ...activePage.draft };
          isPreview = true;
        }
        return { page: activePage, isPreview };
      }
    } catch (err) {
      console.warn(`[${SLUG}] Failed to fetch page from CMS:`, err);
    }
    return { page: FALLBACK, isPreview: false };
  },
  head: ({ loaderData }) => {
    const page = loaderData?.page || FALLBACK;
    return pageHead({
      title: page.seoTitle,
      description: page.metaDescription,
      path: `/${SLUG}`,
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Instagram Downloader", path: "/instagram-downloader" },
        { name: page.name, path: `/${SLUG}` },
      ],
    });
  },
  component: InstagramVideoDownloaderPage,
});

function InstagramVideoDownloaderPage() {
  const { page, isPreview } = Route.useLoaderData();
  return (
    <PageWrapper>
      <DownloaderPageLayout page={page || FALLBACK} isPreview={isPreview} />
    </PageWrapper>
  );
}

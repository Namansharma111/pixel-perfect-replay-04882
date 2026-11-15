import { createFileRoute } from "@tanstack/react-router";
import { PageWrapper } from "@/components/site/PageWrapper";
import { DownloaderPageLayout } from "@/components/downloader/DownloaderPageLayout";
import { getPublicDownloaderPageFn } from "@/lib/cms/cms.functions";
import { DEFAULT_DOWNLOADER_PAGES } from "@/lib/downloader/seo-data";
import { pageHead } from "@/lib/seo";

const SLUG = "instagram-downloader";
const FALLBACK = DEFAULT_DOWNLOADER_PAGES.find((p) => p.slug === SLUG)!;

export const Route = createFileRoute("/instagram-downloader")({
  loader: async () => {
    try {
      const res = await getPublicDownloaderPageFn({ data: { slug: SLUG } });
      if (res && res.page) {
        return { page: res.page };
      }
    } catch (err) {
      console.warn(`[${SLUG}] Failed to fetch page from CMS:`, err);
    }
    return { page: FALLBACK };
  },
  head: ({ loaderData }) => {
    const page = loaderData?.page || FALLBACK;
    return pageHead({
      title: page.seoTitle,
      description: page.metaDescription,
      path: `/${SLUG}`,
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Instagram Downloader", path: `/${SLUG}` },
      ],
    });
  },
  component: InstagramDownloaderPage,
});

function InstagramDownloaderPage() {
  const { page } = Route.useLoaderData();
  return (
    <PageWrapper>
      <DownloaderPageLayout page={page || FALLBACK} />
    </PageWrapper>
  );
}

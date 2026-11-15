import { createFileRoute } from "@tanstack/react-router";
import { PageWrapper } from "@/components/site/PageWrapper";
import { DownloaderPageLayout } from "@/components/downloader/DownloaderPageLayout";
import { getPublicDownloaderPageFn } from "@/lib/cms/cms.functions";
import { DEFAULT_DOWNLOADER_PAGES } from "@/lib/downloader/seo-data";
import { pageHead } from "@/lib/seo";

const SLUG = "instagram-photo-downloader";
const FALLBACK = DEFAULT_DOWNLOADER_PAGES.find((p) => p.slug === SLUG)!;

export const Route = createFileRoute("/instagram-photo-downloader")({
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
        { name: "Instagram Downloader", path: "/instagram-downloader" },
        { name: page.name, path: `/${SLUG}` },
      ],
    });
  },
  component: InstagramPhotoDownloaderPage,
});

function InstagramPhotoDownloaderPage() {
  const { page } = Route.useLoaderData();
  return (
    <PageWrapper>
      <DownloaderPageLayout page={page || FALLBACK} />
    </PageWrapper>
  );
}

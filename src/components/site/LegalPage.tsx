import { PageHero, Container } from "./primitives";
import { PageWrapper } from "./PageWrapper";
import type { LegalSection } from "@/data/types";
import { formatDate } from "@/data/articles";

export function LegalPage({
  title,
  intro,
  path,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  path: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <PageWrapper>
      <PageHero
        eyebrow="Legal"
        title={title}
        description={intro}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: title, path },
        ]}
      />
      <Container className="py-16 lg:py-20">
        <div className="prose-article mx-auto max-w-3xl">
          <p className="text-sm">Last updated: {formatDate(updated)}</p>
          {sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 50)}>{p}</p>
              ))}
              {s.list && (
                <ul>
                  {s.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </Container>
    </PageWrapper>
  );
}

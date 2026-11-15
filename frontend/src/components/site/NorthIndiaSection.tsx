import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

const regions = [
  {
    name: "Chandigarh Tricity",
    text: "Our home base. We work closely with businesses in Chandigarh, Mohali and Panchkula — from cafés and clinics to real-estate firms and coaching institutes — with the advantage of in-person strategy meetings and on-ground shoots.",
  },
  {
    name: "Himachal Pradesh",
    text: "Hotels, homestays, adventure operators and local brands in Shimla, Manali, Dharamshala and Solan rely on seasonal discovery. We plan social media and search campaigns around travel intent and peak seasons.",
  },
  {
    name: "Punjab",
    text: "For retailers, manufacturers, education consultants and clinics in Ludhiana, Amritsar, Jalandhar and Patiala, we combine local SEO, Google Business Profile optimisation and Meta ads aimed at nearby customers.",
  },
  {
    name: "Haryana",
    text: "From Panchkula and Ambala to Karnal and Gurugram, we help service businesses and B2B companies build credible digital presence, generate enquiries and track every lead to its source.",
  },
  {
    name: "Uttar Pradesh",
    text: "Growing businesses in Noida, Lucknow and other UP cities get campaigns tailored to their market size, language preferences and budget — managed remotely with regular reporting calls.",
  },
  {
    name: "Delhi NCR",
    text: "In a crowded, competitive market, we focus on sharp positioning, performance marketing and content that helps NCR brands stand out without overspending on ads.",
  },
];

export function NorthIndiaSection() {
  return (
    <section
      aria-labelledby="north-india-heading"
      className="relative border-t border-border bg-gradient-section py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Serving from Chandigarh</p>
            <h2
              id="north-india-heading"
              className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl"
            >
              Digital Marketing Services Across North India
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Social Waale is based in Chandigarh, and our work reaches well beyond the tricity.
              Digital marketing doesn’t need a branch office in every city — it needs a team that
              understands local audiences, festivals, languages and buying habits. We plan, create
              and manage campaigns remotely for businesses across Himachal Pradesh, Punjab, Haryana,
              Uttar Pradesh and Delhi NCR, with video calls, shared dashboards and a dedicated point
              of contact.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Whether you need{" "}
              <Link
                to="/social-media-marketing"
                className="text-primary underline-offset-4 hover:underline"
              >
                social media marketing
              </Link>
              ,{" "}
              <Link to="/seo-services" className="text-primary underline-offset-4 hover:underline">
                local SEO
              </Link>{" "}
              or a{" "}
              <Link
                to="/website-app-development"
                className="text-primary underline-offset-4 hover:underline"
              >
                new website
              </Link>
              , the same Chandigarh team handles your account from start to finish.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {regions.map((r) => (
              <article key={r.name} className="card-premium card-hover p-6">
                <h3 className="flex items-center gap-2 text-base font-bold">
                  <MapPin className="h-4 w-4 text-primary" /> {r.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { Be_Vietnam_Pro, Cormorant_Garamond } from "next/font/google";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import {
  breakup,
  closing,
  firstMeeting,
  hero,
  lessons,
  letter,
  places,
  present,
} from "@/data/memories";

const serif = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500"],
  variable: "--font-vn",
});

export const metadata: Metadata = {
  title: "Kỉ Niệm — Bảo Ngọc Order",
};

const ROMAN = ["i.", "ii.", "iii.", "iv.", "v.", "vi.", "vii.", "viii.", "ix.", "x."];

function SectionHead({
  index,
  date,
  title,
  dot = "bg-[#c9a29a]",
}: {
  index: string;
  date: string;
  title: string;
  dot?: string;
}) {
  return (
    <>
      <div className={`absolute -left-1 top-[92px] h-[9px] w-[9px] rounded-full ${dot}`} />
      <Reveal className="flex flex-wrap items-baseline gap-4">
        <span className="text-[13px] tracking-[0.25em] text-[#c9a29a]">{index}</span>
        <span className="text-[13px] uppercase tracking-[0.15em] text-[#a39a8c]">{date}</span>
      </Reveal>
      <Reveal
        as="h2"
        className="m-0 font-[family-name:var(--font-serif)] text-[clamp(36px,5vw,56px)] font-normal leading-[1.1] text-[#efe6d8]"
      >
        {title}
      </Reveal>
    </>
  );
}

function Photo({ src, alt, aspect }: { src: string; alt: string; aspect: string }) {
  if (!src) return null;
  return (
    <Reveal className={`relative w-full max-w-[560px] overflow-hidden ${aspect}`}>
      <Image src={src} alt={alt} fill sizes="(max-width: 640px) 100vw, 560px" className="object-cover" />
    </Reveal>
  );
}

const body = "m-0 max-w-[560px] text-[17px] leading-[1.85] text-[#cfc6b8] [text-wrap:pretty]";
const section = "relative flex flex-col gap-7 py-20 pl-12";

export default function MemoriesPage() {
  return (
    <>
      <Navbar />

      <main
        className={`${serif.variable} ${sans.variable} min-h-screen w-full bg-[#15120f] font-[family-name:var(--font-vn)] font-light text-[#e9e2d6] selection:bg-[#c9a29a] selection:text-[#15120f]`}
      >
        {/* Mở đầu */}
        <section className="flex min-h-[90vh] flex-col items-center justify-center gap-8 px-6 py-20 text-center">
          <Reveal className="text-[13px] uppercase tracking-[0.3em] text-[#a39a8c]">{hero.period}</Reveal>
          <Reveal
            as="h1"
            className="m-0 font-[family-name:var(--font-serif)] text-[clamp(48px,9vw,112px)] font-normal italic leading-none text-[#efe6d8] [text-wrap:balance]"
          >
            {hero.title}
          </Reveal>
          <Reveal
            as="p"
            className="m-0 max-w-[520px] font-[family-name:var(--font-serif)] text-[clamp(20px,2.4vw,26px)] leading-normal text-[#b8ae9f] [text-wrap:pretty]"
          >
            {hero.subtitle}
          </Reveal>
          <Reveal className="mt-12 h-[72px] w-px bg-gradient-to-b from-[#a39a8c] to-transparent" />
        </section>

        <div className="relative mx-auto max-w-[880px] px-6 pb-[120px]">
          <div className="absolute bottom-[120px] left-6 top-0 w-px bg-[#3a332c]" />

          {/* 01 */}
          <section className={section}>
            <SectionHead index="01" date={firstMeeting.date} title={firstMeeting.title} />
            <Photo src={firstMeeting.image} alt={firstMeeting.title} aspect="aspect-[4/3]" />
            <Reveal as="p" className={body}>{firstMeeting.text}</Reveal>
          </section>

          {/* 02 */}
          <section className={section}>
            <SectionHead index="02" date={places.date} title={places.title} />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-7">
              {places.items.map((place) => (
                <Reveal as="figure" key={place.name} className="m-0 flex flex-col gap-3">
                  {place.image && (
                    <div className="relative aspect-[3/4] w-full overflow-hidden">
                      <Image src={place.image} alt={place.name} fill sizes="(max-width: 640px) 100vw, 260px" className="object-cover" />
                    </div>
                  )}
                  <figcaption className="flex flex-col gap-1">
                    <span className="font-[family-name:var(--font-serif)] text-2xl text-[#efe6d8]">{place.name}</span>
                    <span className="text-sm leading-relaxed text-[#a39a8c]">{place.note}</span>
                  </figcaption>
                </Reveal>
              ))}
            </div>
          </section>

          {/* 03 */}
          <section className={section}>
            <SectionHead
              index="03"
              date={breakup.date}
              title={breakup.title}
              dot="border border-[#c9a29a] bg-[#15120f]"
            />
            <Reveal as="p" className={body}>{breakup.text}</Reveal>
            <Reveal
              as="blockquote"
              className="m-0 mt-6 max-w-[600px] font-[family-name:var(--font-serif)] text-[clamp(26px,3.4vw,36px)] italic leading-[1.4] text-[#d9b8b0] [text-wrap:balance]"
            >
              {breakup.quote}
            </Reveal>
          </section>

          {/* 04 */}
          <section className={section}>
            <SectionHead index="04" date={letter.date} title={letter.title} dot="bg-[#3a332c]" />
            <Reveal className="flex max-w-[600px] flex-col gap-5 border border-[#2e2822] bg-[#1d1915] p-[clamp(28px,5vw,56px)] font-[family-name:var(--font-serif)] text-[22px]">
              <p className="m-0 italic text-[#b8ae9f]">{letter.greeting}</p>
              {letter.paragraphs.map((p, i) => (
                <p key={i} className="m-0 leading-[1.7] text-[#e9e2d6] [text-wrap:pretty]">{p}</p>
              ))}
            </Reveal>
          </section>

          {/* 05 */}
          <section className={section}>
            <SectionHead index="05" date={lessons.date} title={lessons.title} dot="bg-[#3a332c]" />
            <ol className="m-0 flex max-w-[600px] list-none flex-col p-0">
              {lessons.items.map((text, i) => (
                <Reveal
                  as="li"
                  key={i}
                  className="grid grid-cols-[48px_minmax(0,1fr)] gap-4 border-t border-[#2e2822] py-6"
                >
                  <span className="font-[family-name:var(--font-serif)] text-[22px] italic text-[#c9a29a]">
                    {ROMAN[i] ?? `${i + 1}.`}
                  </span>
                  <span className="text-[17px] leading-[1.8] text-[#cfc6b8] [text-wrap:pretty]">{text}</span>
                </Reveal>
              ))}
            </ol>
          </section>

          {/* 06 */}
          <section className="relative flex flex-col gap-7 pb-10 pl-12 pt-20">
            <SectionHead index="06" date={present.date} title={present.title} dot="bg-[#efe6d8]" />
            <Photo src={present.image} alt={present.title} aspect="aspect-[16/10]" />
            <Reveal as="p" className={body}>{present.text}</Reveal>
          </section>
        </div>

        <footer className="flex flex-col items-center gap-4 px-6 pb-[120px] pt-20 text-center">
          <Reveal
            as="p"
            className="m-0 font-[family-name:var(--font-serif)] text-[clamp(24px,3vw,32px)] italic text-[#b8ae9f]"
          >
            {closing}
          </Reveal>
        </footer>
      </main>
    </>
  );
}

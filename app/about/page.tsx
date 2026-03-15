import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Database, Fingerprint, History, Microscope } from 'lucide-react';
import { PublicSiteShell } from '@/components/public-site/PublicSiteShell';

const impactCards = [
  {
    title: '1.2M+ Specimen',
    subtitle: 'Indexed Digital Records',
    icon: Database,
    className: 'border-l-4 border-primary bg-surface-container-low',
    iconClassName: 'text-primary',
    subtitleClassName: 'text-outline',
  },
  {
    title: 'Global Access',
    subtitle: 'Open Research Protocol',
    icon: Microscope,
    className: 'bg-secondary-container',
    iconClassName: 'text-secondary',
    subtitleClassName: 'text-on-secondary-container',
  },
  {
    title: 'Preservation',
    subtitle: 'Ethical Archive Standards',
    icon: History,
    className: 'bg-surface-container-highest',
    iconClassName: 'text-tertiary',
    subtitleClassName: 'text-on-surface-variant',
  },
];

export default function AboutPage() {
  return (
    <PublicSiteShell>
      <div className="mx-auto max-w-4xl px-6 py-24">
        <section className="mb-20">
          <span className="mb-4 block text-xs font-label uppercase tracking-[0.2em] text-tertiary">Our Institutional Purpose</span>
          <h1 className="font-headline mb-8 text-5xl leading-[1.1] text-on-surface lg:text-7xl">
            The Digital Custodian of <br />
            <span className="text-primary italic">Prehistoric History.</span>
          </h1>
          <p className="font-headline mb-12 max-w-2xl text-2xl leading-relaxed text-on-surface-variant">
            Strata Archive serves as the primary scientific repository for the Petrobras Paleontology Division, bridging the gap
            between industrial discovery and academic preservation.
          </p>
          <div className="group relative h-[400px] w-full overflow-hidden rounded-xl bg-surface-container-high">
            <Image
              alt="Microscopic view of fossilized sedimentary rock layers"
              className="object-cover grayscale opacity-80 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-100"
              fill
              priority
              sizes="(min-width: 1024px) 64rem, 100vw"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ1-nVyI9cgNy5a4_hOAj0Lg12HryrgAvOnU25P4GZHyrXJRc7uBkOQx8dI0VoFkt2oxj2K5jLb5-uqWrgFkGCP5IAw42zA1TSktpSU9PgsU9wrGrBoKNsnsU1Pa3TGPanreYJ7GMjjvCnC-iVexnDVVvHrgSwTRQfAiQ3uOvbLboChv389_W1AKG8gfC8mqlmOkbV3xhOYBSv4_Kgmo8nRG2rqi8zBYkuNhKr_RtJQqVw9QU40zR3K8u2Nlp3UizvnDt5_gQMCd0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-highest/60 to-transparent" />
          </div>
        </section>

        <div className="space-y-24">
          <section className="grid grid-cols-1 items-start gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="font-headline text-3xl text-primary">A Legacy of Discovery</h2>
            </div>
            <div className="space-y-6 md:col-span-8">
              <p className="text-lg leading-relaxed text-on-surface-variant">
                Founded to safeguard the immense paleontological wealth uncovered during exploratory operations, Strata Archive has
                evolved into a global lighthouse for sedimentary research. We believe that every fossil recovered is a piece of a
                planetary puzzle that belongs to the scientific community.
              </p>
              <p className="text-lg leading-relaxed text-on-surface-variant">
                Our role extends beyond storage. We provide high-resolution digital stratigraphy, 3D fossil reconstructions, and a
                peer-reviewed database that supports researchers from over 140 international universities.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {impactCards.map((card) => {
              const Icon = card.icon;

              return (
                <article key={card.title} className={`rounded-xl p-8 ${card.className}`}>
                  <Icon aria-hidden="true" className={`mb-4 h-7 w-7 ${card.iconClassName}`} strokeWidth={1.8} />
                  <h3 className="font-headline mb-2 text-xl text-on-surface">{card.title}</h3>
                  <p className={`text-xs font-label uppercase tracking-wider ${card.subtitleClassName}`}>{card.subtitle}</p>
                </article>
              );
            })}
          </section>

          <section className="relative overflow-hidden rounded-2xl bg-surface-container p-12">
            <div className="relative z-10 max-w-xl">
              <h2 className="font-headline mb-6 text-3xl text-on-surface">Scientific Ethics &amp; Standards</h2>
              <p className="mb-8 text-lg leading-relaxed text-on-surface-variant">
                The Strata Archive operates under the strictest international guidelines for paleontological heritage. We ensure
                that all materials are handled with professional care and that their geological context is meticulously documented
                for future generations.
              </p>
              <Link className="group inline-flex items-center font-bold text-tertiary" href="/legal-notices">
                Review our Ethics Charter
                <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <Fingerprint
              aria-hidden="true"
              className="absolute -bottom-20 right-[-10%] h-[300px] w-[300px] text-on-surface opacity-10"
              strokeWidth={1.2}
            />
          </section>

          <section className="py-12 text-center">
            <h3 className="font-headline mb-8 text-3xl text-on-surface">Ready to explore the strata?</h3>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link className="rounded-sm bg-primary px-8 py-3 font-bold tracking-wide text-on-primary" href="/acesso-ao-portal-interno?origin=public">
                View Collections
              </Link>
              <Link
                className="rounded-sm bg-surface-container-high px-8 py-3 font-bold tracking-wide text-on-surface hover:bg-surface-container-highest"
                href="/contact"
              >
                Contact Curator
              </Link>
            </div>
          </section>
        </div>
      </div>
    </PublicSiteShell>
  );
}

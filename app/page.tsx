import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Mountain } from 'lucide-react';
import { PublicSiteShell } from '@/components/public-site/PublicSiteShell';
import { isPortuguese, type SiteLocale } from '@/lib/site-locale';
import { getSiteLocale } from '@/lib/site-locale-server';

const featuredArticles = [
  {
    category: 'Geology',
    publishedAt: '2 days ago',
    title: 'Cretaceous Discoveries in the Araripe Basin',
    summary:
      'Recent fieldwork has unearthed perfectly preserved fish fossils in the Santana Formation, revealing new evolutionary data.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA7K6z_nXcjW58IO0kaOfbAgyarDVPznIfQhy2ZUBRKOklafc7EooLu-kFsJMsNxTVOK5xGyx2gOxolWbCfYKLlRTi3sZRjXwyjj0lXIuKz_nE7DEV4mKYeEKGiWorVJUmA4jsug69hc7o1fh9hzOd7ACEpqzOXFqtwgfoWPTd6mDqw6iOmvCahIAh2W2aKFFHtortZaFbXBYE3Ma9X1srkkgVv-VS5p9q6qIJC9z-jgff430QME5FQyCDcZ83QXVVYCdZn9l6fhkI',
    alt: 'Archaeological site excavation in a desert landscape',
  },
  {
    category: 'Analysis',
    publishedAt: '1 week ago',
    title: 'The Evolution of Marine Fauna Systems',
    summary:
      'Mapping how prehistoric sea levels influenced the distribution of benthic organisms across the South Atlantic.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDPUiOQ_TAjs6c7obD1wm78gZqsPbpM-U2v8Z8_XDRCl0m5O1uSlqlI0tcD2TcW41GYisNXBJVaOKUhu6P6efJ_-I-VNifTYtqKXe2Urnj8LG9HnwsiiuO9FIyFRAsfknu4qAuko9OTupp7DuRRfrEVAvbvNDicR6bVaPmj8Zy6wiRaHPOLRAlIi-0lX4skF8m9oWu_9lUeJDUGoldrTIRd1EJklby2LGF07MjN_1qnbHThlw2ZTW8E2k9YgJd5eF2AnGWELkDsZcU',
    alt: 'Layers of sediment in a mountain cliff',
  },
  {
    category: 'Technology',
    publishedAt: '2 weeks ago',
    title: 'Digital Preservation: 3D Scanning Lithics',
    summary:
      'How high-resolution LiDAR is helping researchers preserve fragile specimens virtually before physical extraction.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAAbVUlKxlOo98KTHnMEw6e3Iuyykg-yy6E0W717CPzMlAvSfAV5wq3JORJybwr1UIl4HgEPv3p5XX1d6VVxzWt3lHFZzITNi6OYqr9atluZGfJhi99SqnEb8_DKApVBWrZVAWJNqIMsKsXPCGKdjgygp-9Rx8gO9XFhDoxPUyb7mplxX4hrzu_2lBCI_j4c6rBK-ENtSYq1wbZ0SKqRbfh57s_OlJwbKSL9Nl98g2-gR99zSpVWPBVk_ULFZaStHnRISq6CRULGuc',
    alt: 'Scientist working with delicate fossil fragments in a lab',
  },
];

export default async function HomePage() {
  const locale: SiteLocale = await getSiteLocale();
  const pt = isPortuguese(locale);
  const localizedFeaturedArticles = pt
    ? [
        {
          ...featuredArticles[0],
          category: 'Geologia',
          publishedAt: '2 dias atras',
          title: 'Descobertas cretaceas na Bacia do Araripe',
          summary:
            'Trabalhos de campo recentes revelaram peixes fossilizados perfeitamente preservados na Formacao Santana, trazendo novos dados evolutivos.',
        },
        {
          ...featuredArticles[1],
          category: 'Analise',
          publishedAt: '1 semana atras',
          title: 'A evolucao dos sistemas de fauna marinha',
          summary:
            'Mapeando como os niveis pre-historicos do mar influenciaram a distribuicao de organismos bentonicos no Atlantico Sul.',
        },
        {
          ...featuredArticles[2],
          category: 'Tecnologia',
          publishedAt: '2 semanas atras',
          title: 'Preservacao digital: escaneando liticos em 3D',
          summary:
            'Como o LiDAR em alta resolucao ajuda pesquisadores a preservar virtualmente especimes frageis antes da extracao fisica.',
        },
      ]
    : featuredArticles;

  return (
    <PublicSiteShell locale={locale}>
      <section className="relative overflow-hidden px-6 pb-24 pt-16 lg:px-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="z-10 lg:col-span-7">
            <span className="mb-6 inline-block rounded-full bg-secondary-container px-3 py-1 text-[10px] font-label font-bold uppercase tracking-widest text-on-secondary-container">
              {pt ? 'Iniciativa Institucional • Petrobras' : 'Institutional Initiative • Petrobras'}
            </span>
            <h1 className="font-headline mb-8 text-5xl leading-[1.1] font-bold text-on-surface lg:text-7xl">
              {pt ? (
                <>
                  Revelando o Patrimônio <br />
                  <span className="text-primary italic">Paleontológico</span> Regional
                </>
              ) : (
                <>
                  Unveiling Regional <br />
                  <span className="text-primary italic">Paleontological</span> Heritage
                </>
              )}
            </h1>
            <p className="mb-10 max-w-xl text-lg leading-relaxed text-on-surface-variant lg:text-xl">
              {pt
                ? 'Descubra a importância dos nossos registros fósseis e o papel deles na compreensão da história da Terra através das camadas do tempo e do sedimento.'
                : "Discover the importance of our fossil records and their role in understanding Earth's history through layers of time and sediment."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                className="inline-flex items-center justify-center rounded bg-primary px-8 py-4 font-bold text-on-primary shadow-lg hover:-translate-y-0.5"
                href="/acesso-ao-portal-interno?origin=public"
              >
                {pt ? 'Explorar o Portal' : 'Explore The Portal'}
              </Link>
              <a
                className="inline-flex items-center justify-center rounded bg-surface-container-high px-8 py-4 font-bold text-on-surface hover:bg-surface-container-highest"
                href="#recent-discoveries"
              >
                {pt ? 'Saiba Mais' : 'Learn More'}
              </a>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="aspect-[4/5] rotate-3 overflow-hidden rounded-xl bg-surface-container shadow-[0px_24px_48px_-12px_rgba(30,27,20,0.08)] transition-transform duration-700 hover:rotate-0">
              <div className="relative h-full w-full">
                <Image
                  alt="Detailed texture of a fossilized ammonite shell in sandstone"
                  className="object-cover grayscale transition-all duration-1000 hover:grayscale-0"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy0csCNlGZPJywYEu92aoD5ZhHnQTbC5go8vtd3VBtIEW4Hrtnj1voMYURqVP-leZK-NYJEU4nd7mBMgfoAQmRumVI1zshU5vF3UjNG7UynMmUEdxP4xa6jJxtj1P3AfAWCccPbxmp1vUuXsR6-u-F8uWqaKCJWfUfEU0w1Kw0-sGCX5NLWMoWcaeCVaoozTxu7ZtzsSNi4kDGqzKQPlShJZNQ89Mz6kEnUKYIUBiH0NAhPO8bwjw0qFlQPrabigUjUyJdV_VNT-I"
                />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-12 hidden aspect-square w-48 rounded-xl border border-white/20 bg-tertiary-container/20 backdrop-blur-xl lg:block" />
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low px-6 py-24 lg:px-20" id="recent-discoveries">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h2 className="font-headline mb-4 text-4xl font-bold text-on-surface">
                {pt ? 'Descobertas Recentes e Pesquisa' : 'Recent Discoveries & Research'}
              </h2>
              <p className="text-lg text-on-surface-variant">{pt ? 'Descobertas, pesquisas de campo e técnicas de preservação fóssil em destaque.' : 'Detailed insights from the field, geological surveys, and fossil preservation techniques.'}</p>
            </div>
            <Link
              className="group flex items-center gap-2 font-bold text-tertiary hover:underline"
              href="/acesso-ao-portal-interno?origin=public"
            >
              {pt ? 'Ver Todo o Acervo' : 'View All Archives'}
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {localizedFeaturedArticles.map((article) => (
              <article key={article.title} className="group">
                <Link className="block cursor-pointer" href="/acesso-ao-portal-interno?origin=public">
                  <div className="relative mb-6 aspect-video overflow-hidden rounded-lg bg-surface-container">
                    <Image
                      alt={article.alt}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      fill
                      sizes="(min-width: 1024px) 28vw, (min-width: 768px) 42vw, 90vw"
                      src={article.imageUrl}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-label font-bold uppercase tracking-wider text-secondary">{article.category}</span>
                      <span className="h-1 w-1 rounded-full bg-outline-variant" />
                      <span className="text-[11px] font-label text-on-surface-variant">{article.publishedAt}</span>
                    </div>
                    <h3 className="font-headline text-2xl font-bold text-on-surface transition-colors group-hover:text-primary">
                      {article.title}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-on-surface-variant">{article.summary}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-32 lg:px-20">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl bg-surface-container p-8 shadow-sm md:p-16">
          <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="relative z-10 flex flex-col items-center gap-12 md:flex-row">
            <div className="flex-1 space-y-6">
              <h2 className="font-headline text-4xl leading-tight font-bold text-on-surface lg:text-5xl">
                {pt ? (
                  <>
                    Acesse o <br />
                    <span className="text-primary italic">Portal do Pesquisador</span>
                  </>
                ) : (
                  <>
                    Access the <br />
                    <span className="text-primary italic">Researcher Portal</span>
                  </>
                )}
              </h2>
              <p className="text-lg leading-relaxed text-on-surface-variant">
                {pt
                  ? 'Você é colaborador ou pesquisador? Acesse nossa rede interna para enviar descobertas, colaborar em escavações ativas e consultar conjuntos de dados geológicos exclusivos.'
                  : 'Are you a contributor or researcher? Access our internal network to submit findings, collaborate on active excavations, and access exclusive geological datasets.'}
              </p>
              <Link
                className="inline-flex items-center gap-3 rounded bg-primary px-10 py-4 font-bold text-on-primary shadow-xl hover:bg-on-primary-fixed-variant"
                href="/acesso-ao-portal-interno?origin=public"
              >
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
                {pt ? 'Acessar o Portal' : 'Sign In to Portal'}
              </Link>
            </div>

            <div className="flex w-full justify-center md:w-1/3">
              <div className="flex size-48 items-center justify-center rounded-full border-4 border-dashed border-outline-variant p-4">
                <div className="flex size-full items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                  <Mountain aria-hidden="true" className="h-16 w-16" strokeWidth={1.8} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicSiteShell>
  );
}

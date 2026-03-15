import { PublicSiteShell } from '@/components/public-site/PublicSiteShell';
import { PublicContentEnhancer } from '@/components/public-site/PublicContentEnhancer';
import { StitchIconEnhancer } from '@/components/stitch/StitchIconEnhancer';
import { getPublicStitchPage } from '@/lib/public-stitch-page';
import { getSiteLocale } from '@/lib/site-locale-server';

type PublicStitchPageProps = {
  fileName: string;
  containerId: string;
};

export async function PublicStitchPage({ fileName, containerId }: PublicStitchPageProps) {
  const locale = await getSiteLocale();
  const page = await getPublicStitchPage(fileName, locale);

  return (
    <PublicSiteShell locale={locale}>
      {page.styles ? <style dangerouslySetInnerHTML={{ __html: page.styles }} /> : null}
      <div id={containerId} dangerouslySetInnerHTML={{ __html: page.content }} />
      <StitchIconEnhancer containerId={containerId} />
      <PublicContentEnhancer containerId={containerId} />
    </PublicSiteShell>
  );
}

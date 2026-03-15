import { PublicSiteShell } from '@/components/public-site/PublicSiteShell';
import { PublicContentEnhancer } from '@/components/public-site/PublicContentEnhancer';
import { getPublicStitchPage } from '@/lib/public-stitch-page';

type PublicStitchPageProps = {
  fileName: string;
  containerId: string;
};

export async function PublicStitchPage({ fileName, containerId }: PublicStitchPageProps) {
  const page = await getPublicStitchPage(fileName);

  return (
    <PublicSiteShell>
      {page.styles ? <style dangerouslySetInnerHTML={{ __html: page.styles }} /> : null}
      <div id={containerId} dangerouslySetInnerHTML={{ __html: page.content }} />
      <PublicContentEnhancer containerId={containerId} />
    </PublicSiteShell>
  );
}

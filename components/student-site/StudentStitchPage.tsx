import { StudentPortalShell } from '@/components/student-site/StudentPortalShell';
import { StudentContentAccessTracker } from '@/components/student-site/StudentContentAccessTracker';
import { getStudentStitchPage } from '@/lib/student-stitch-page';
import { getSiteLocale } from '@/lib/site-locale-server';

type StudentStitchPageProps = {
  fileName: string;
  activeNav: 'learning' | 'archive' | 'wiki';
  pageTitle: string;
  displayName: string;
  profileLabel: string;
  avatarInitials: string;
  accessLog?: {
    title: string;
    category: string;
    contentType: string;
    contentKey: string;
    sourcePath: string;
  };
};

export async function StudentStitchPage({
  fileName,
  activeNav,
  pageTitle,
  displayName,
  profileLabel,
  avatarInitials,
  accessLog,
}: StudentStitchPageProps) {
  const locale = await getSiteLocale();
  const page = await getStudentStitchPage(fileName, locale);

  return (
    <StudentPortalShell
      activeNav={activeNav}
      pageTitle={pageTitle}
      displayName={displayName}
      profileLabel={profileLabel}
      avatarInitials={avatarInitials}
      locale={locale}
    >
      {page.styles ? <style dangerouslySetInnerHTML={{ __html: page.styles }} /> : null}
      {accessLog ? <StudentContentAccessTracker {...accessLog} /> : null}
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </StudentPortalShell>
  );
}

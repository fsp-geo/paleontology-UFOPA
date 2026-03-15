import { StudentPortalShell } from '@/components/student-site/StudentPortalShell';
import { StudentContentAccessTracker } from '@/components/student-site/StudentContentAccessTracker';
import { getStudentStitchPage } from '@/lib/student-stitch-page';

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
  const page = await getStudentStitchPage(fileName);

  return (
    <StudentPortalShell
      activeNav={activeNav}
      pageTitle={pageTitle}
      displayName={displayName}
      profileLabel={profileLabel}
      avatarInitials={avatarInitials}
    >
      {page.styles ? <style dangerouslySetInnerHTML={{ __html: page.styles }} /> : null}
      {accessLog ? <StudentContentAccessTracker {...accessLog} /> : null}
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </StudentPortalShell>
  );
}

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { AuthGuard } from 'src/auth/guard';
import ErrorBoundaryWithRouter from 'src/components/ErrorBoundary';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  if (CONFIG.auth.skip) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <ErrorBoundaryWithRouter>
          {children}
        </ErrorBoundaryWithRouter>
      </DashboardLayout>
    </AuthGuard>
  );
}

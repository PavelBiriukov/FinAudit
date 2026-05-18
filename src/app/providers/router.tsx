import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';
import { SiteLayout } from '../layouts/site-layout/SiteLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { ProtectedClientRoute } from './ProtectedClientRoute';
import { HomePage } from '../../pages/home';
import { ServicesPage } from '../../pages/services';
import { AboutPage } from '../../pages/about';
import { ContactsPage } from '../../pages/contacts';
import { AdminRequestsPage } from '../../pages/admin-requests';
import { AdminRequestDetailsPage } from '../../pages/admin-request-details';
import { AdminLoginPage } from '../../pages/admin-login';
import { ClientLoginPage } from '../../pages/client-login';
import { ClientDashboardPage } from '../../pages/client-dashboard';
import { ClientProjectsPage } from '../../pages/client-projects';
import { ClientProjectDetailsPage } from '../../pages/client-project-details';
import { AdminProjectsPage } from '../../pages/admin-projects';
import { AdminProjectDetailsPage } from '../../pages/admin-project-details';
import { CalculatorPage } from '../../pages/calculator';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <SiteLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'services', element: <ServicesPage /> },
          { path: 'about', element: <AboutPage /> },
          { path: 'contacts', element: <ContactsPage /> },

          { path: 'admin/login', element: <AdminLoginPage /> },
          {
            path: 'admin/requests',
            element: (
              <ProtectedRoute>
                <AdminRequestsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'admin/requests/:id',
            element: (
              <ProtectedRoute>
                <AdminRequestDetailsPage />
              </ProtectedRoute>
            ),
          },

          { path: 'client/login', element: <ClientLoginPage /> },
          {
            path: 'client/dashboard',
            element: (
              <ProtectedClientRoute>
                <ClientDashboardPage />
              </ProtectedClientRoute>
            ),
          },
          {
            path: 'client/projects',
            element: (
              <ProtectedClientRoute>
                <ClientProjectsPage />
              </ProtectedClientRoute>
            ),
          },
          {
            path: 'client/projects/:id',
            element: (
              <ProtectedClientRoute>
                <ClientProjectDetailsPage />
              </ProtectedClientRoute>
            ),
          },
          {
            path: 'admin/projects',
            element: (
              <ProtectedRoute>
                <AdminProjectsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'admin/projects/:id',
            element: (
              <ProtectedRoute>
                <AdminProjectDetailsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'calculator',
            element: <CalculatorPage />,
          },
        ],
      },
    ],
  },
]);
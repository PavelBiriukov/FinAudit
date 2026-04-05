import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';
import { SiteLayout } from '../layouts/site-layout/SiteLayout';
import { HomePage } from '../../pages/home';
import { ServicesPage } from '../../pages/services';
import { AboutPage } from '../../pages/about';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <SiteLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'services',
            element: <ServicesPage />,
          },
          {
            path: 'about',
            element: <AboutPage />,
          },
        ],
      },
    ],
  },
]);
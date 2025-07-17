import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/dashboard/dashboard';
import Grafic from '../pages/grafic/Grafic';
import PrivateRoute from './PrivateRoute';

const Home = lazy(() => import('../pages/home/Home'));
const DetalleProducto = lazy(() => import('../pages/detalleProducto/DetalleProducto'));
const Venta = lazy(() => import('../pages/venta/Venta'));
const NotFound = lazy(() => import('../pages/notFound/NotFound'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<p>Cargando...</p>}>
              <Home />
          </Suspense>
        )
      },
      {
        path: 'producto/:id',
        element: (
          <Suspense fallback={<p>Cargando...</p>}>
            <DetalleProducto />
          </Suspense>
        )
      },
      {
        path: 'venta/',
        element: (
          <Suspense fallback={<p>Cargando Venta...</p>}>
            <Venta />
          </Suspense>
        )
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<p>Cargando Dasboard...</p>}>
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          </Suspense>
        )
      },
      {
        path: 'grafic',
        element: (
          <Suspense fallback={<p>Cargando Dasboard...</p>}>
            <PrivateRoute>
              <Grafic />
            </PrivateRoute>
          </Suspense>
        )
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<p>Cargando...</p>}>
            <NotFound />
          </Suspense>
        )
      }
    ]
  }
]);

export default router;

import { createElement, lazy, Suspense } from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Loading from '@/layouts/Loading';
const Home = lazy(() => import('@/pages/Home'));

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LazyPage component={Home} />} />
      </Routes>
    </BrowserRouter>
  );
}

function LazyPage({ component }: { component: React.LazyExoticComponent<() => JSX.Element>; }) {
  return (
    <Suspense fallback={<Loading />}>
      {createElement(component)}
    </Suspense>
  );
}
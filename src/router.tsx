import { createElement, lazy, Suspense } from 'react';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Loading from '@/layouts/Loading';
import useAuth from '@/hooks/useAuth';
const Home = lazy(() => import('@/pages/Home'));
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<Navigate to='/' />} />
        <Route path='/' element={<Login />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/home' element={<ProtectedLazyPage component={Home} />} />
      </Routes>
    </BrowserRouter>
  );
}

interface LazyPageProps {
  isProtected?: boolean;
  component: React.LazyExoticComponent<() => JSX.Element>;
}

function LazyPage({ component, isProtected }: LazyPageProps) {
  const { isAuthenticated } = useAuth();
  
  if(!isProtected && isAuthenticated)
    return <Navigate to='/home' />;

  return (
    <Suspense fallback={<Loading />}>
      {createElement(component)}
    </Suspense>
  );
}

function ProtectedLazyPage({ component }: LazyPageProps) {
  const { isAuthenticated } = useAuth();
  if(!isAuthenticated)
    return <Navigate to='/' />;
  return <LazyPage component={component} isProtected />;
}
import { createElement, lazy, Suspense } from 'react';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Loading from '@/layouts/Loading';
import useAuth from '@/hooks/useAuth';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
const Home = lazy(() => import('@/pages/Home'));

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<Navigate to='/' />} />
        <Route path='/' element={<Page component={<Login />} />} />
        <Route path='/sign-up' element={<Page component={<SignUp />} />} />
        <Route path='/home' element={<ProtectedLazyPage component={Home} />} />
      </Routes>
    </BrowserRouter>
  );
}

interface LazyPageProps {
  component: React.LazyExoticComponent<() => JSX.Element>;
  isProtected?: boolean;
}

function LazyPage({ component, isProtected }: LazyPageProps) {
  const { isAuthenticated } = useAuth();
  
  if(!isProtected && isAuthenticated)
    return <Navigate to='/home' />;

  return (
    <Suspense fallback={<Loading message='Carregando..' />}>
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

interface PageProps {
  component: JSX.Element;
  isProtected?: boolean;
}

function Page({ component, isProtected }: PageProps) {
  const { isAuthenticated } = useAuth();
  
  if(!isProtected && isAuthenticated)
    return <Navigate to='/home' />;
  
  return component;
}
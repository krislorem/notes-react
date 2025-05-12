import { lazy, Suspense } from 'react';
import { Routes, Route } from "react-router-dom";
const Loading = lazy(() => import('@/components/Loading'))
const Home = lazy(() => import('@/pages/Home'))

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

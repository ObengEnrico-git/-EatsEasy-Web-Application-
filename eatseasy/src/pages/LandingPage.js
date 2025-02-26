import React, { lazy, Suspense } from 'react';

const Navbar = lazy(() => import('../landingComponents/Navbar'));
const Section1 = lazy(() => import('../landingComponents/Section1'));
const Cards = lazy(() => import('../landingComponents/Cards'));
const Loader = lazy(() => import('../pages/Loader')); //loading screen in between pages 


const LandingPage = () => {
  return (
    <Suspense fallback={<div> <Loader/></div>}>
      <div>
        <Navbar />
        <Section1 />
        <Cards />
      </div>
    </Suspense>
  );
};

export default LandingPage;

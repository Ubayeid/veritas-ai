import Navbar from '@/components/LandingPage/Navbar'
import Hero from '@/components/LandingPage/hero'
import HowItWorks from '@/components/LandingPage/HowItWorks'
import WhatWeSolve from '@/components/LandingPage/WhatWeSolve'
import Features from '@/components/LandingPage/Features'
import Pricing from '@/components/LandingPage/Pricing'
import FAQ from '@/components/LandingPage/FAQ'
import CTA from '@/components/LandingPage/CTA'
import Footer from '@/components/LandingPage/footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
  <Hero />
  <HowItWorks />
  <WhatWeSolve />
  <Features />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

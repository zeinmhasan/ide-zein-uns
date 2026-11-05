import { MotionConfig } from 'framer-motion'
import { Shell } from './components/layout/Layout'
import { Alur, Bisnis, DataErd, DiBalikAI, Footer, Metrik, Roadmap, Sehari, Sumber } from './sections/Deep'
import { Angka, Hero, Insight, Linimasa, Masalah } from './sections/Intro'
import { Modul, Solusi } from './sections/Solution'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Shell>
        <Hero />
        <Angka />
        <Linimasa />
        <Masalah />
        <Insight />
        <Solusi />
        <Modul />
        <Sehari />
        <Alur />
        <DiBalikAI />
        <DataErd />
        <Metrik />
        <Roadmap />
        <Bisnis />
        <Sumber />
        <Footer />
      </Shell>
    </MotionConfig>
  )
}

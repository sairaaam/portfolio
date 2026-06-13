import { useEffect, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useProgress, Preload } from '@react-three/drei'
import { PCFShadowMap, MathUtils } from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import { Player } from './components/Scene/Player'
import { Ball } from './components/Scene/Ball'
import { Stadium } from './components/Scene/Stadium'
import { CameraRig } from './components/Scene/CameraRig'
import { FIFACard } from './components/UI/FIFACard'
import { HeroText } from './components/UI/HeroText'
import { CommentaryFlash } from './components/UI/CommentaryFlash'
import { Scoreboard } from './components/UI/Scoreboard'
import { MobileOverlay } from './components/UI/MobileOverlay'
import { ShootPrompt } from './components/UI/ShootPrompt'
import { useIsMobile } from './hooks/useIsMobile'
import { fifaCards } from './data/cards'
import { matchState } from './state/matchState'

gsap.registerPlugin(ScrollTrigger)

// Decouples the 3D scene from raw scroll: every frame the smoothed value chases
// the ScrollTrigger value (damp lambda 6 ≈ lerp 0.1 at 60fps, frame-rate safe).
// Scene components consume `smooth`; UI overlays keep the raw value.
function ProgressSmoother({ raw, smooth }) {
  useFrame((_, delta) => {
    smooth.current = MathUtils.damp(smooth.current, raw.current, 6, delta)
    // kill sub-pixel drift so phase thresholds settle deterministically
    if (Math.abs(smooth.current - raw.current) < 0.0005) smooth.current = raw.current
  })
  return null
}

function LoadingScreen({ progress }) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50"
      id="loading-screen"
    >
      {/* Spinning football */}
      <div
        style={{
          fontSize: '2.5rem',
          animation: 'spin-ball 1.2s linear infinite',
          lineHeight: 1,
          marginBottom: '1.5rem',
        }}
      >
        ⚽
      </div>
      <div
        style={{
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: '4rem',
          color: '#4fc3f7',
          letterSpacing: '0.1em',
          lineHeight: 1,
        }}
      >
        {Math.round(progress)}%
      </div>
      <div className="mt-4 w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-[#4fc3f7]"
          style={{
            width: `${progress}%`,
            transition: 'width 0.3s ease',
            boxShadow: '0 0 12px #4fc3f7',
          }}
        />
      </div>
      <div
        className="mt-3 text-xs tracking-widest loading-ellipsis"
        style={{ color: 'rgba(255,255,255,0.3)', fontFamily: '"JetBrains Mono", monospace' }}
      >
        PREPARING THE PITCH
      </div>
    </div>
  )
}

export default function App() {
  const isMobile = useIsMobile()
  const scrollProgress = useRef(0)   // raw — written by ScrollTrigger, read by UI
  const smoothProgress = useRef(0)   // damped — the only value the 3D scene reads
  const [visibleCard, setVisibleCard] = useState(null)
  const [showScoreboard, setShowScoreboard] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showFlash, setShowFlash] = useState(false)
  const scrollBarRef = useRef()
  const progressBallRef = useRef()
  const { progress, active } = useProgress()

  // Lenis smooth scroll — dampens native wheel input, drives ScrollTrigger
  // through GSAP's ticker so there is exactly one rAF loop
  const lenisRef = useRef(null)
  useEffect(() => {
    if (isMobile) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [isMobile])

  // Set up scroll trigger
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: '.scroll-wrapper',
      start: 'top top',
      end: 'bottom bottom',
      // numerical scrub: progress takes ~1.5s to catch up to the scrollbar —
      // combined with Lenis this removes all scroll-step jumps
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress
        scrollProgress.current = p

        // Scroll progress bar + ball riding the line
        if (scrollBarRef.current) {
          scrollBarRef.current.style.width = `${p * 100}%`
        }
        if (progressBallRef.current) {
          const key = [0.35, 0.62, 0.88].some((t) => Math.abs(p - t) < 0.03)
          progressBallRef.current.style.left = `calc(${p * 100}% - 8px)`
          progressBallRef.current.style.transform = `scale(${key ? 1.6 : 1})`
        }

        // FIFA card visibility logic
        let activeCard = null
        for (const card of fifaCards) {
          if (p >= card.triggerStart && p <= card.triggerEnd) {
            activeCard = card.id
            break
          }
        }
        setVisibleCard(activeCard)

      },
    })

    return () => trigger.kill()
  }, [])

  // Scoreboard appears ~3s after the goal (event-driven, not scroll-driven),
  // and hides again when the shot resets on scroll-back
  useEffect(() => {
    let scoredSince = null
    const interval = setInterval(() => {
      if (matchState.shot === 'scored') {
        if (scoredSince === null) scoredSince = Date.now()
        if (Date.now() - scoredSince > 3000) setShowScoreboard(true)
      } else {
        scoredSince = null
        setShowScoreboard(false)
      }
    }, 200)
    return () => clearInterval(interval)
  }, [])

  // Hide loading screen once all GLB/texture assets have actually loaded,
  // with a dramatic white flash on the reveal
  useEffect(() => {
    if (isLoaded) return
    if (progress >= 100 && !active) {
      const timer = setTimeout(() => {
        setShowFlash(true)
        setIsLoaded(true)
        setTimeout(() => setShowFlash(false), 700)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [progress, active, isLoaded])

  // Fallback: never trap the user on the loader for more than 6s
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 6000)
    return () => clearTimeout(timer)
  }, [])

  // Keyboard navigation: Space / arrows step through the experience
  useEffect(() => {
    const step = (dir) => {
      const target = window.scrollY + dir * window.innerHeight * 0.8
      // route through Lenis when active — native smooth scroll fights its rAF
      if (lenisRef.current) lenisRef.current.scrollTo(target)
      else window.scrollTo({ top: target, behavior: 'smooth' })
    }
    const onKey = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        // At the penalty spot, SPACE shoots; everywhere else it scrolls.
        // Gate on the smoothed value — that's where the player actually is.
        if (smoothProgress.current >= 0.72 && matchState.shot === 'idle') {
          matchState.shot = 'requested'
        } else if (matchState.shot === 'idle') {
          step(1)
        }
      } else if (e.code === 'ArrowDown') {
        e.preventDefault()
        step(1)
      } else if (e.code === 'ArrowUp') {
        e.preventDefault()
        step(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Mobile renders a simple scrollable layout — no 3D scroll
  if (isMobile) {
    return <MobileOverlay />
  }

  return (
    <>
      {!isLoaded && <LoadingScreen progress={progress} />}

      {/* Reveal flash after loading completes */}
      {showFlash && <div className="reveal-flash" />}

      {/* Scroll progress bar + ball indicator */}
      <div className="scroll-indicator" ref={scrollBarRef} style={{ width: '0%' }} />
      <div
        ref={progressBallRef}
        style={{
          position: 'fixed',
          top: '-3px',
          left: '-8px',
          fontSize: '12px',
          zIndex: 1001,
          transition: 'transform 0.25s ease',
          pointerEvents: 'none',
          willChange: 'transform, left',
        }}
      >
        ⚽
      </div>

      {/* Cinematic vignette over the canvas */}
      <div className="vignette" />

      {/* Scroll wrapper — height drives the entire experience */}
      <div className="scroll-wrapper" style={{ height: '600vh', position: 'relative' }}>

        {/* ── LAYER 0: Fixed 3D Canvas ── */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 0,
          }}
        >
          <Canvas
            shadows={{ type: PCFShadowMap }}
            dpr={[1, 2]}
            camera={{ fov: 42, near: 0.1, far: 100 }}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
              toneMappingExposure: 1.2,
            }}
            style={{ background: '#050a14' }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener('webglcontextlost', (e) => {
                e.preventDefault()
                console.error('WebGL context lost — try refreshing')
              })
            }}
          >
            <Suspense fallback={null}>
              <ProgressSmoother raw={scrollProgress} smooth={smoothProgress} />
              <CameraRig scrollProgress={smoothProgress} isMobile={isMobile} />
              <Stadium scrollProgress={smoothProgress} />
              <Player scrollProgress={smoothProgress} isMobile={isMobile} />
              <Ball scrollProgress={smoothProgress} />
              <Preload all />
            </Suspense>
          </Canvas>
        </div>

        {/* ── LAYER 1: Fixed HTML overlay ── */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          {/* Hero text — fades out at scroll start */}
          <HeroText scrollProgress={scrollProgress} />

          {/* Commentary flashes */}
          <CommentaryFlash scrollProgress={scrollProgress} />

          {/* Penalty prompt — SPACE to shoot (smoothed value = where the
              player actually is, so the prompt waits for him to arrive) */}
          <ShootPrompt scrollProgress={smoothProgress} />

          {/* FIFA Cards — left side */}
          <div
            className="absolute left-8 top-1/2 -translate-y-1/2"
            style={{ pointerEvents: 'auto' }}
          >
            {fifaCards
              .filter((c) => c.slideFrom === 'left')
              .map((card) => (
                <FIFACard
                  key={card.id}
                  card={card}
                  visible={visibleCard === card.id}
                />
              ))}
          </div>

          {/* FIFA Cards — right side */}
          <div
            className="absolute right-8 top-1/2 -translate-y-1/2"
            style={{ pointerEvents: 'auto' }}
          >
            {fifaCards
              .filter((c) => c.slideFrom === 'right')
              .map((card) => (
                <FIFACard
                  key={card.id}
                  card={card}
                  visible={visibleCard === card.id}
                />
              ))}
          </div>

          {/* Scroll position label — subtle bottom indicator */}
          <div
            className="absolute bottom-6 right-8 text-xs tracking-widest"
            style={{
              color: 'rgba(255,255,255,0.2)',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            SARAVANA · 2025
          </div>
        </div>

        {/* ── LAYER 2: Scoreboard (end state) ── */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
            overflowY: showScoreboard ? 'auto' : 'hidden',
            pointerEvents: showScoreboard ? 'auto' : 'none',
            display: 'flex',
            // flex-start, not center: centered flex containers clip the top of
            // overflowing content and make it unscrollable
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          {/* Dark overlay behind scoreboard */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(4px)',
              opacity: showScoreboard ? 1 : 0,
              transition: 'opacity 0.6s ease',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative', width: '100%', padding: '4rem 0 2rem', minHeight: '100%' }}>
            <Scoreboard visible={showScoreboard} />
          </div>
        </div>
      </div>
    </>
  )
}
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
import { ChapterTracker } from './components/UI/ChapterTracker'
import { Scoreboard } from './components/UI/Scoreboard'
import { FootballIcon, VolumeOnIcon, VolumeOffIcon } from './components/UI/icons'
import { Howl } from 'howler'
import { MobileOverlay } from './components/UI/MobileOverlay'
import { ShootPrompt } from './components/UI/ShootPrompt'
import { useIsMobile } from './hooks/useIsMobile'
import { fifaCards } from './data/cards'
import { matchState } from './state/matchState'

gsap.registerPlugin(ScrollTrigger)

// ── Crowd audio (Howler singleton) ──────────────────────────────────────────
// Browsers block autoplay, so the Howl is only created after the first user
// gesture (scroll / click / key). Volume is driven by scroll position in App.
let crowdSound = null
function initAudio() {
  if (crowdSound) return
  crowdSound = new Howl({
    src: ['/audio/crowd-cheering.mp3'],
    loop: true,
    volume: 0,
    preload: true,
  })
}

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
          color: '#4fc3f7',
          animation: 'spin-ball 1.2s linear infinite',
          lineHeight: 0,
          marginBottom: '1.5rem',
        }}
      >
        <FootballIcon size={40} />
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

  const [muted, setMuted] = useState(false)
  const mutedRef = useRef(false)

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

  // ── Crowd audio ───────────────────────────────────────────────────────────
  // Unlock on the first user gesture (autoplay policy)
  useEffect(() => {
    const unlock = () => initAudio()
    document.addEventListener('scroll', unlock, { once: true })
    document.addEventListener('click', unlock, { once: true })
    document.addEventListener('keydown', unlock, { once: true })
    return () => {
      document.removeEventListener('scroll', unlock)
      document.removeEventListener('click', unlock)
      document.removeEventListener('keydown', unlock)
    }
  }, [])

  // Keep mute in sync
  useEffect(() => {
    mutedRef.current = muted
    if (crowdSound) crowdSound.mute(muted)
  }, [muted])

  // Drive crowd volume off scroll position (polls the raw value — leaves the
  // ScrollTrigger setup untouched). Moments A–D from the brief.
  useEffect(() => {
    const s = { started: false, goalRamped: false, celebrated: false }
    const interval = setInterval(() => {
      if (!crowdSound) return
      const p = scrollProgress.current

      // Moment A — dribble starts: play looped ambient, fade in to 0.3
      if (p >= 0.15 && !s.started) {
        s.started = true
        crowdSound.mute(mutedRef.current)
        if (!crowdSound.playing()) crowdSound.play()
        crowdSound.fade(crowdSound.volume(), 0.3, 2000)
      }

      // Moment B — GOAL: crowd erupts, ramp 0.3 → 1.0 over 0.5s
      if (p >= 0.88 && !s.goalRamped && s.started) {
        s.goalRamped = true
        crowdSound.fade(crowdSound.volume(), 1.0, 500)
      }

      // Moment C — celebration: hold 1.0 for 3s, then settle to 0.4
      if (p >= 0.92 && !s.celebrated && s.started) {
        s.celebrated = true
        setTimeout(() => {
          if (crowdSound && scrollProgress.current >= 0.80) {
            crowdSound.fade(crowdSound.volume(), 0.4, 1500)
          }
        }, 3000)
      }

      // Scrolling back below the goal restores ambient level for a clean replay
      if (p < 0.80 && (s.goalRamped || s.celebrated)) {
        s.goalRamped = false
        s.celebrated = false
        if (s.started) crowdSound.fade(crowdSound.volume(), 0.3, 1000)
      }

      // Moment D — back to the start: fade out and pause
      if (p < 0.10 && s.started) {
        s.started = false
        s.goalRamped = false
        s.celebrated = false
        crowdSound.fade(crowdSound.volume(), 0, 1000)
        setTimeout(() => {
          if (crowdSound && scrollProgress.current < 0.10) crowdSound.pause()
        }, 1000)
      }
    }, 100)
    return () => clearInterval(interval)
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

      {/* Crowd audio mute toggle */}
      <button
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? 'Unmute crowd' : 'Mute crowd'}
        className="flex items-center justify-center"
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          width: '32px',
          height: '32px',
          color: 'rgba(255,255,255,0.3)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          zIndex: 100,
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
      >
        {muted ? <VolumeOffIcon size={20} /> : <VolumeOnIcon size={20} />}
      </button>

      {/* Scroll progress bar + ball indicator */}
      <div className="scroll-indicator" ref={scrollBarRef} style={{ width: '0%' }} />
      <div
        ref={progressBallRef}
        style={{
          position: 'fixed',
          top: '-3px',
          left: '-8px',
          color: '#ffffff',
          lineHeight: 0,
          filter: 'drop-shadow(0 0 4px rgba(79,195,247,0.8))',
          zIndex: 1001,
          transition: 'transform 0.25s ease',
          pointerEvents: 'none',
          willChange: 'transform, left',
        }}
      >
        <FootballIcon size={14} />
      </div>

      {/* Cinematic vignette over the canvas */}
      <div className="vignette" />

      {/* Chapter indicator — mini pitch tracker on the left rail.
          Hidden once the scoreboard takes over the screen. */}
      {!showScoreboard && <ChapterTracker scrollProgress={scrollProgress} />}

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

          {/* FIFA Cards — left side. Full-height rail (offset clears the
              chapter tracker); each card anchors itself within it and overlaps,
              so a tall card never pushes a neighbour off-screen. */}
          <div
            className="absolute"
            style={{
              left: 'clamp(140px, 12vw, 200px)',
              top: 0,
              bottom: 0,
              width: '280px',
              pointerEvents: 'none',
              overflow: 'visible',
            }}
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
            className="absolute"
            style={{
              right: 'clamp(12px, 2vw, 32px)',
              top: 0,
              bottom: 0,
              width: '280px',
              pointerEvents: 'none',
              overflow: 'visible',
            }}
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

        {/* ── LAYER 2: Scoreboard (end state) ──
            Solid covering overlay: a near-opaque dark gradient + a faint pitch
            stripe pattern fully hides the 3D clutter while keeping the stadium
            mood. data-lenis-prevent lets it scroll natively (Lenis owns the
            window wheel). Raised above the chapter tracker. */}
        <div
          data-lenis-prevent
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 10,
            overflowY: showScoreboard ? 'auto' : 'hidden',
            WebkitOverflowScrolling: 'touch',
            scrollPaddingTop: '20px',
            pointerEvents: showScoreboard ? 'auto' : 'none',
            opacity: showScoreboard ? 1 : 0,
            transition: 'opacity 0.5s ease',
            background: `
              repeating-linear-gradient(180deg, transparent, transparent 60px, rgba(255,255,255,0.008) 60px, rgba(255,255,255,0.008) 120px),
              linear-gradient(180deg, rgba(0,4,12,0.96) 0%, rgba(0,8,20,0.94) 40%, rgba(0,5,15,0.96) 100%)
            `,
            backdropFilter: 'blur(12px) saturate(150%)',
            WebkitBackdropFilter: 'blur(12px) saturate(150%)',
          }}
        >
          <div style={{ position: 'relative', minHeight: '100vh', height: 'auto', padding: '40px 24px 120px' }}>
            <Scoreboard visible={showScoreboard} />
          </div>
        </div>
      </div>
    </>
  )
}
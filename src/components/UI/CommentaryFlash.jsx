import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { matchState } from '../../state/matchState'

// Scroll-triggered lines during the approach; the shot lines are event-driven
// off matchState (the kick fires on SPACE, not at a scroll position)
const COMMENTARY = [
  { trigger: 0.35, text: 'WHAT A TOUCH!', sub: 'first touch · weight of a feather' },
  { trigger: 0.62, text: 'INTO THE FINAL THIRD...', sub: 'driving at the defence' },
]

const SHOOTS_LINE = { text: 'HE SHOOTS...', sub: 'from the spot · right boot' }
const GOAL_LINE = { text: 'GOOOAL!', sub: "90+3' · top corner · no chance for the keeper", goal: true }

const CONFETTI_COLORS = ['#4fc3f7', '#ffffff', '#81d4fa', '#b3e5fc']

function burstConfetti(container) {
  if (!container) return
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div')
    const size = 4 + Math.random() * 6
    piece.style.cssText = `
      position: absolute; left: 50%; top: 45%;
      width: ${size}px; height: ${size * (0.4 + Math.random() * 0.6)}px;
      background: ${CONFETTI_COLORS[i % CONFETTI_COLORS.length]};
      will-change: transform, opacity; pointer-events: none;
    `
    container.appendChild(piece)

    const angle = Math.random() * Math.PI * 2
    const velocity = 200 + Math.random() * 450
    const vx = Math.cos(angle) * velocity
    const vy = Math.sin(angle) * velocity - 250   // bias upward

    gsap.to(piece, {
      duration: 1.6 + Math.random() * 0.8,
      ease: 'none',
      opacity: 0,
      rotation: (Math.random() - 0.5) * 720,
      onComplete: () => piece.remove(),
      // gravity via manual physics in modifiers-free keyframes
      keyframes: [
        { x: vx * 0.35, y: vy * 0.35, duration: 0.35, ease: 'power1.out' },
        { x: vx * 0.7, y: vy * 0.7 + 350, duration: 0.75, ease: 'power1.in' },
        { x: vx, y: vy + 900, duration: 0.9, ease: 'power1.in' },
      ],
    })
  }
}

export function CommentaryFlash({ scrollProgress }) {
  const [moment, setMoment] = useState(null)
  const textRef = useRef()
  const flashRef = useRef()
  const confettiRef = useRef()
  const lastTrigger = useRef(-1)
  const shotFlashed = useRef(false)
  const goalFlashed = useRef(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const p = scrollProgress.current

      // Event-driven shot lines — replay-safe: flags reset when the shot resets
      let eventLine = null
      if (matchState.shot === 'idle') {
        shotFlashed.current = false
        goalFlashed.current = false
      } else {
        if (!shotFlashed.current && (matchState.shot === 'shooting' || matchState.shot === 'scored')) {
          shotFlashed.current = true
          eventLine = SHOOTS_LINE
        }
        if (!goalFlashed.current && matchState.netImpactAt >= 0) {
          goalFlashed.current = true
          eventLine = GOAL_LINE
        }
      }

      const scrollLine = COMMENTARY.find(
        (c) => p >= c.trigger && p < c.trigger + 0.04 && lastTrigger.current !== c.trigger
      )
      const c = eventLine || scrollLine
      if (c) {
        if (scrollLine && c === scrollLine) lastTrigger.current = c.trigger
        setMoment(c)

        requestAnimationFrame(() => {
            if (!textRef.current) return
          gsap.killTweensOf(textRef.current)

          if (c.goal) {
            // MAXIMUM IMPACT: explode in + white flash + confetti
            gsap.fromTo(textRef.current,
              { opacity: 0, scale: 3 },
              {
                opacity: 1, scale: 1, duration: 0.4, ease: 'expo.out',
                onComplete: () => {
                  gsap.to(textRef.current, { opacity: 0, scale: 0.96, duration: 0.45, delay: 1.6 })
                },
              }
            )
            if (flashRef.current) {
              gsap.fromTo(flashRef.current,
                { opacity: 0.6 },
                { opacity: 0, duration: 0.3, ease: 'power2.out' }
              )
            }
            burstConfetti(confettiRef.current)
          } else {
            // Slam in from below
            gsap.fromTo(textRef.current,
              { opacity: 0, y: 60, scale: 1.3 },
              {
                opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power4.out',
                onComplete: () => {
                  gsap.to(textRef.current, { opacity: 0, duration: 0.3, delay: 1.2 })
                },
              }
            )
          }
        })
      }
    }, 100)
    return () => clearInterval(interval)
  }, [scrollProgress])

  return (
    <>
      {/* White flash on goal */}
      <div
        ref={flashRef}
        className="absolute inset-0 pointer-events-none"
        style={{ background: '#ffffff', opacity: 0, zIndex: 25 }}
      />

      {/* Confetti layer */}
      <div
        ref={confettiRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 24 }}
      />

      {/* Commentary text */}
      <div
        ref={textRef}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ opacity: 0, zIndex: 20, willChange: 'transform, opacity' }}
      >
        <div
          className="whitespace-nowrap text-center"
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: moment?.goal ? 'clamp(4rem, 11vw, 9.5rem)' : 'clamp(3rem, 8vw, 7rem)',
            letterSpacing: '0.1em',
            lineHeight: 1,
            color: '#ffffff',
            textShadow:
              '0 0 30px rgba(79,195,247,0.9), 0 0 80px rgba(79,195,247,0.5), 0 4px 24px rgba(0,0,0,0.8)',
            WebkitTextStroke: '1px rgba(79,195,247,0.4)',
          }}
        >
          {moment?.text}
        </div>
        {moment?.sub && (
          <div
            className="mt-3 text-xs sm:text-sm tracking-[0.25em] uppercase"
            style={{
              color: 'rgba(79,195,247,0.85)',
              fontFamily: '"JetBrains Mono", monospace',
              textShadow: '0 2px 12px rgba(0,0,0,0.9)',
            }}
          >
            {moment.sub}
          </div>
        )}
      </div>
    </>
  )
}

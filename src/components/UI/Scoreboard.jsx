import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { projects, socialLinks } from '../../data/cards'
import { PROJECT_ICONS, FootballIcon } from './icons'

const SOCIAL_CTA = {
  GitHub: 'Explore',
  LinkedIn: 'Connect',
  Email: 'Contact',
}

function ProjectCard({ project, index, visible }) {
  const cardRef = useRef()

  useEffect(() => {
    if (!cardRef.current) return
    if (visible) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.45 + index * 0.1, ease: 'power3.out', overwrite: true }
      )
    } else {
      gsap.set(cardRef.current, { opacity: 0, y: 30 })
    }
  }, [visible, index])

  const Icon = PROJECT_ICONS[project.id] || FootballIcon
  const tags = project.tag.split('·').map((t) => t.trim()).filter(Boolean)

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden cursor-pointer project-card flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(79,195,247,0.12)',
        borderRadius: '4px',
        minHeight: '180px',
        padding: '20px',
        transition: 'border-color 0.3s, box-shadow 0.3s, background 0.3s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        willChange: 'transform, opacity',
      }}
    >
      {/* Top accent bar — draws 0 → 100% on hover */}
      <div
        className="absolute top-0 left-0 project-bar"
        style={{ height: '3px', width: '0%', background: project.color, transition: 'width 0.3s ease' }}
      />

      {/* Header — icon + title */}
      <div className="flex items-center gap-3 mb-3">
        <Icon size={22} style={{ color: project.color, flexShrink: 0 }} />
        <h3
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: '22px',
            letterSpacing: '0.06em',
            color: '#ffffff',
            lineHeight: 1.05,
          }}
        >
          {project.title}
        </h3>
      </div>

      {/* Tag pills — one per skill */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="uppercase"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              letterSpacing: '0.1em',
              color: project.color,
              background: `${project.color}14`,
              border: `1px solid ${project.color}33`,
              borderRadius: '2px',
              padding: '3px 8px',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '11px',
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.4)',
        }}
      >
        {project.description}
      </p>

      {/* Divider */}
      <div className="mt-auto pt-3" style={{ marginBottom: '12px', borderTop: '1px solid rgba(79,195,247,0.12)' }} />

      {/* CTA — always rendered; revealed on hover */}
      <div
        className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: project.color,
        }}
      >
        <span>View Project</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </div>
    </div>
  )
}

export function Scoreboard({ visible }) {
  const boardRef = useRef()

  // Verify the full project list is being mapped (expect 4)
  useEffect(() => {
    console.log(`[Scoreboard] rendering ${projects.length} projects:`, projects.map((p) => p.title))
  }, [])

  // Staged entrance — the overlay (App) handles the background fade; here we
  // sequence the header, title, cards (own effect) and social section.
  useEffect(() => {
    if (!visible || !boardRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.sb-header', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', overwrite: true })
      gsap.fromTo('.sb-title', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.3, ease: 'power3.out', overwrite: true })
      gsap.fromTo('.sb-social', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.7, ease: 'power3.out', overwrite: true })
    }, boardRef)
    return () => ctx.revert()
  }, [visible])

  return (
    <div
      ref={boardRef}
      className="w-full max-w-4xl mx-auto pointer-events-auto"
      style={{ willChange: 'transform, opacity' }}
    >
      {/* ── Broadcast match-result header ── */}
      <div
        className="sb-header mb-12"
        style={{
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(79,195,247,0.2)',
          borderRadius: '4px 4px 0 0',
          padding: '1.5rem 2rem',
        }}
      >
        {/* FULL TIME · stoppage */}
        <div className="flex items-center justify-between mb-5">
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', letterSpacing: '0.4em', color: '#4fc3f7' }}>
            FULL TIME
          </span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', letterSpacing: '0.4em', color: '#4fc3f7' }}>
            90&apos;+3
          </span>
        </div>

        {/* Teams + scoreline */}
        <div className="flex items-center justify-between gap-4">
          <div className="text-right flex-1">
            <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '28px', letterSpacing: '0.04em', color: '#ffffff', lineHeight: 1 }}>
              SARAVANA FC
            </div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
              Portfolio
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ScoreBox value="1" />
            <span style={{ width: '20px', height: '2px', background: '#4fc3f7' }} />
            <ScoreBox value="0" />
          </div>

          <div className="text-left flex-1">
            <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '28px', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.6)', lineHeight: 1 }}>
              OPPORTUNITY
            </div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
              Industry
            </div>
          </div>
        </div>

        {/* Goalscorer */}
        <div
          className="mt-5 flex items-center justify-center gap-2"
          style={{ fontFamily: '"Inter", sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}
        >
          <FootballIcon size={13} style={{ color: '#4fc3f7' }} />
          <span>45&apos;+3&nbsp; SARAVANA&nbsp; <span style={{ fontStyle: 'italic' }}>(pen.)</span></span>
        </div>
      </div>

      {/* ── SELECTED WORKS ── */}
      <div className="sb-title text-center mb-8">
        <h2
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: 'clamp(2.6rem, 6vw, 3.5rem)',
            letterSpacing: '0.1em',
            color: '#ffffff',
            lineHeight: 1,
          }}
        >
          SELECTED WORKS
        </h2>
        <div className="flex items-center justify-center gap-3 mt-3">
          <span style={{ width: '90px', height: '1px', background: 'rgba(79,195,247,0.3)' }} />
          <FootballIcon size={15} style={{ color: '#4fc3f7' }} />
          <span style={{ width: '90px', height: '1px', background: 'rgba(79,195,247,0.3)' }} />
        </div>
      </div>

      {/* Project grid — FUT squad cards (2 cols desktop, 1 col mobile) */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 mx-auto"
        style={{ gap: '16px', width: '100%', maxWidth: '900px' }}
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} visible={visible} />
        ))}
      </div>

      {/* ── Social links — broadcast stats row (inside the scrollable
          overlay; inherits its dark background) ── */}
      <div
        className="sb-social grid grid-cols-3 mb-16 mx-auto"
        style={{
          maxWidth: '640px',
          marginTop: '48px',
          paddingTop: '32px',
          borderTop: '1px solid rgba(79,195,247,0.15)',
          borderBottom: '1px solid rgba(79,195,247,0.15)',
        }}
      >
        {socialLinks.map((link, i) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group stat-link flex flex-col items-center justify-center gap-1 py-5 transition-colors"
            style={{
              textDecoration: 'none',
              borderLeft: i === 0 ? 'none' : '1px solid rgba(79,195,247,0.15)',
            }}
          >
            <span
              className="uppercase transition-colors"
              style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '18px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.85)' }}
            >
              {link.label}
            </span>
            <span
              className="flex items-center gap-1 uppercase"
              style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', letterSpacing: '0.15em', color: '#4fc3f7' }}
            >
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              {SOCIAL_CTA[link.label] || 'Open'}
            </span>
          </a>
        ))}
      </div>

      {/* Footer line */}
      <div className="text-center pb-24">
        <p
          className="uppercase"
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '9px',
            letterSpacing: '0.3em',
            color: 'rgba(255,255,255,0.15)',
          }}
        >
          Built with Three.js · React · GSAP · Blender
        </p>
      </div>

      {/* ── Back to top — fixed bottom center while the scoreboard is open ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="back-to-top"
        style={{
          position: 'fixed',
          left: '50%',
          bottom: '24px',
          transform: 'translateX(-50%)',
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: '14px',
          letterSpacing: '0.15em',
          color: '#4fc3f7',
          background: 'rgba(0,0,0,0.8)',
          border: '1px solid rgba(79,195,247,0.3)',
          borderRadius: '2px',
          padding: '10px 24px',
          cursor: 'pointer',
          transition: 'background 0.3s ease, box-shadow 0.3s ease',
          zIndex: 5,
        }}
      >
        ↑ BACK TO KICK OFF
      </button>
    </div>
  )
}

function ScoreBox({ value }) {
  return (
    <span
      style={{
        fontFamily: '"Bebas Neue", sans-serif',
        fontSize: 'clamp(3rem, 8vw, 72px)',
        lineHeight: 1,
        color: '#ffffff',
        background: 'rgba(79,195,247,0.1)',
        border: '1px solid rgba(79,195,247,0.3)',
        borderRadius: '2px',
        padding: '4px 18px',
      }}
    >
      {value}
    </span>
  )
}

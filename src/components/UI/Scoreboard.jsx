import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { projects, socialLinks } from '../../data/cards'
import { PROJECT_ICONS, FootballIcon } from './icons'

// ── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ src, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'zoom-out',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <img
        src={src}
        alt="Fullscreen screenshot"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '72vw',
          maxHeight: '78vh',
          objectFit: 'contain',
          borderRadius: '4px',
          boxShadow: '0 0 80px rgba(0,0,0,0.8)',
          cursor: 'default',
        }}
      />
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: '20px', right: '24px',
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50%', width: '40px', height: '40px',
          color: '#fff', fontSize: '20px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          lineHeight: 1, fontFamily: 'monospace',
        }}
      >
        ×
      </button>
    </div>,
    document.body
  )
}

// ── Screenshot Carousel ──────────────────────────────────────────────────────
function Carousel({ screenshots, color, screenshotLabel }) {
  const [index, setIndex] = useState(0)
  const [imgError, setImgError] = useState({})
  const [lightbox, setLightbox] = useState(false)

  const prev = (e) => { e && e.stopPropagation(); setIndex((i) => (i - 1 + screenshots.length) % screenshots.length) }
  const next = (e) => { e && e.stopPropagation(); setIndex((i) => (i + 1) % screenshots.length) }

  useEffect(() => {
    const handler = (e) => {
      if (lightbox) return
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, index])

  const currentSrc = screenshots[index]
  const hasImage = !imgError[index]

  return (
    <>
      {lightbox && hasImage && (
        <Lightbox src={currentSrc} onClose={() => setLightbox(false)} />
      )}

      <div style={{ marginBottom: '32px' }}>
        {/* Main slide */}
        <div
          className="relative"
          style={{
            background: 'rgba(0,0,0,0.5)',
            border: `1px solid ${color}22`,
            borderRadius: '4px',
            overflow: 'hidden',
            minHeight: '180px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {hasImage ? (
            <img
              key={currentSrc}
              src={currentSrc}
              alt={`Screenshot ${index + 1}`}
              onError={() => setImgError((e) => ({ ...e, [index]: true }))}
              onClick={() => setLightbox(true)}
              style={{
                display: 'block',
                maxWidth: '100%',
                maxHeight: '520px',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                cursor: 'zoom-in',
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3" style={{ padding: '48px 0' }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', letterSpacing: '0.15em', color: `${color}55`, textTransform: 'uppercase', textAlign: 'center', whiteSpace: 'pre-line' }}>
                {screenshotLabel || 'Screenshot unavailable'}
              </span>
            </div>
          )}

          {/* Prev arrow */}
          <button
            onClick={prev}
            style={{
              position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.7)', border: `1px solid ${color}44`, borderRadius: '3px',
              color: '#fff', width: '32px', height: '32px', cursor: 'pointer',
              fontFamily: 'monospace', fontSize: '20px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s, border-color 0.2s', zIndex: 2,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${color}33`; e.currentTarget.style.borderColor = color }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.7)'; e.currentTarget.style.borderColor = `${color}44` }}
          >
            ‹
          </button>

          {/* Next arrow */}
          <button
            onClick={next}
            style={{
              position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.7)', border: `1px solid ${color}44`, borderRadius: '3px',
              color: '#fff', width: '32px', height: '32px', cursor: 'pointer',
              fontFamily: 'monospace', fontSize: '20px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s, border-color 0.2s', zIndex: 2,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${color}33`; e.currentTarget.style.borderColor = color }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.7)'; e.currentTarget.style.borderColor = `${color}44` }}
          >
            ›
          </button>

          {/* Expand hint + counter */}
          <div style={{
            position: 'absolute', bottom: '10px', right: '12px',
            display: 'flex', alignItems: 'center', gap: '8px',
            pointerEvents: 'none',
          }}>
            {hasImage && (
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '8px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                click to expand
              </span>
            )}
            <span style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: '9px',
              letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)',
              background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '2px',
            }}>
              {index + 1} / {screenshots.length}
            </span>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {screenshots.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              style={{
                width: i === index ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === index ? color : 'rgba(255,255,255,0.2)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </>
  )
}

// ── Project Detail Panel ─────────────────────────────────────────────────────
function ProjectDetail({ project, onClose }) {
  const panelRef = useRef()

  useEffect(() => {
    if (!panelRef.current) return
    gsap.fromTo(panelRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
    )
  }, [])

  return (
    <div ref={panelRef} style={{ opacity: 0 }}>
      {/* Back button */}
      <button
        onClick={onClose}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px',
          background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
          fontFamily: '"JetBrains Mono", monospace', fontSize: '11px',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
      >
        ← Back to Projects
      </button>

      {/* Header */}
      <div
        style={{
          background: 'rgba(0,0,0,0.4)',
          border: `1px solid ${project.color}33`,
          borderRadius: '4px',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <div style={{ height: '3px', background: project.color, borderRadius: '2px', marginBottom: '20px' }} />

        <div className="flex items-start gap-3 mb-4">
          {(() => { const Icon = PROJECT_ICONS[project.id] || FootballIcon; return <Icon size={28} style={{ color: project.color, flexShrink: 0, marginTop: '4px' }} /> })()}
          <div>
            <h2 style={{
              fontFamily: '"Bebas Neue", sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              letterSpacing: '0.06em', color: '#ffffff', lineHeight: 1,
            }}>
              {project.title}
            </h2>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {project.tag.split('·').map((t) => t.trim()).filter(Boolean).map((tag) => (
                <span key={tag} style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: '10px',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: project.color, background: `${project.color}14`,
                  border: `1px solid ${project.color}33`, borderRadius: '2px', padding: '3px 8px',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
          {[
            ['Role', project.role],
            ['Year', project.year],
            ['Duration', project.duration],
            ['Status', project.status],
            ['Team', project.team],
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '9px', letterSpacing: '0.2em', color: `${project.color}88`, textTransform: 'uppercase', marginBottom: '2px' }}>
                {label}
              </div>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Screenshot carousel */}
      <Carousel
        screenshots={project.screenshots}
        color={project.color}
        screenshotLabel={project.screenshotLabel}
      />

      {/* Summary */}
      <div style={{ marginBottom: '28px' }}>
        <SectionLabel color={project.color}>Overview</SectionLabel>
        {project.summary.split('\n\n').filter(Boolean).map((para, i) => (
          <p key={i} style={{
            fontFamily: '"Inter", sans-serif', fontSize: '13px',
            lineHeight: 1.75, color: 'rgba(255,255,255,0.6)', marginBottom: '12px',
          }}>
            {para.trim()}
          </p>
        ))}
      </div>

      {/* Highlights */}
      <div style={{ marginBottom: '28px' }}>
        <SectionLabel color={project.color}>Key Highlights</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {project.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-3">
              <span style={{ color: project.color, flexShrink: 0, marginTop: '3px', fontSize: '10px' }}>◆</span>
              <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '12px', lineHeight: 1.6, color: 'rgba(255,255,255,0.6)' }}>
                {h}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div style={{ marginBottom: '32px' }}>
        <SectionLabel color={project.color}>Tech Stack</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {project.techStack.map((group) => (
            <div key={group.category} style={{
              background: 'rgba(0,0,0,0.3)', border: `1px solid ${project.color}1a`,
              borderRadius: '4px', padding: '14px',
            }}>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: '9px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: project.color, marginBottom: '10px',
              }}>
                {group.category}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {group.items.map((item) => (
                  <span key={item} style={{
                    fontFamily: '"JetBrains Mono", monospace', fontSize: '10px',
                    color: 'rgba(255,255,255,0.55)', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2px',
                    padding: '3px 7px',
                  }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      {(project.links?.github || project.links?.live || project.links?.demo) && (
        <div className="flex gap-3 mb-8">
          {project.links.github && (
            <a href={project.links.github} target="_blank" rel="noopener noreferrer" style={linkStyle(project.color)}>
              GitHub →
            </a>
          )}
          {project.links.live && (
            <a href={project.links.live} target="_blank" rel="noopener noreferrer" style={linkStyle(project.color)}>
              Live Site →
            </a>
          )}
          {project.links.demo && (
            <a href={project.links.demo} target="_blank" rel="noopener noreferrer" style={linkStyle(project.color)}>
              Demo →
            </a>
          )}
        </div>
      )}
    </div>
  )
}

function SectionLabel({ color, children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '18px', letterSpacing: '0.12em', color: '#ffffff' }}>
        {children}
      </span>
      <span style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${color}44, transparent)` }} />
    </div>
  )
}

function linkStyle(color) {
  return {
    fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', letterSpacing: '0.15em',
    textTransform: 'uppercase', color, textDecoration: 'none',
    background: `${color}11`, border: `1px solid ${color}44`, borderRadius: '3px',
    padding: '8px 16px', transition: 'background 0.2s, border-color 0.2s',
  }
}

// ── Project Card (grid view) ─────────────────────────────────────────────────
function ProjectCard({ project, index, visible, onSelect }) {
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
      onClick={() => onSelect(project)}
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
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 project-bar"
        style={{ height: '3px', width: '100%', background: project.color }}
      />

      {/* Header — icon + title */}
      <div className="flex items-center gap-3 mb-3">
        <Icon size={22} style={{ color: project.color, flexShrink: 0 }} />
        <h3 style={{
          fontFamily: '"Bebas Neue", sans-serif', fontSize: '22px',
          letterSpacing: '0.06em', color: '#ffffff', lineHeight: 1.05,
        }}>
          {project.title}
        </h3>
      </div>

      {/* Tag pills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {tags.map((tag) => (
          <span key={tag} className="uppercase" style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: '10px',
            letterSpacing: '0.1em', color: project.color,
            background: `${project.color}14`, border: `1px solid ${project.color}33`,
            borderRadius: '2px', padding: '3px 8px',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Description */}
      <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '11px', lineHeight: 1.6, color: 'rgba(255,255,255,0.4)' }}>
        {project.description}
      </p>

      {/* Screenshot placeholder */}
      {project.screenshotLabel && (
        <div className="mt-3 flex items-center justify-center" style={{
          background: 'rgba(0,0,0,0.25)', border: `1px dashed ${project.color}33`,
          borderRadius: '2px', height: '64px',
        }}>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: '9px',
            letterSpacing: '0.12em', color: `${project.color}55`,
            textTransform: 'uppercase', textAlign: 'center', whiteSpace: 'pre-line',
          }}>
            {project.screenshotLabel}
          </span>
        </div>
      )}

      {/* Divider */}
      <div className="mt-auto pt-3" style={{ marginBottom: '12px', borderTop: '1px solid rgba(79,195,247,0.12)' }} />

      {/* CTA */}
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: '10px',
        letterSpacing: '0.2em', textTransform: 'uppercase', color: project.color,
      }}>
        <span>View Project</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </div>
    </div>
  )
}

// ── Scoreboard ───────────────────────────────────────────────────────────────
export function Scoreboard({ visible, onBackToKickOff }) {
  const boardRef = useRef()
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    if (!visible || !boardRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.sb-header', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', overwrite: true })
      gsap.fromTo('.sb-title', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.3, ease: 'power3.out', overwrite: true })
      gsap.fromTo('.sb-social', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.7, ease: 'power3.out', overwrite: true })
    }, boardRef)
    return () => ctx.revert()
  }, [visible])

  // Scroll to top of scoreboard when opening a project detail
  const handleSelect = (project) => {
    setSelectedProject(project)
    boardRef.current?.closest('[data-lenis-prevent]')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClose = () => {
    setSelectedProject(null)
  }

  return (
    <div ref={boardRef} className="w-full max-w-4xl mx-auto pointer-events-auto" style={{ willChange: 'transform, opacity' }}>

      {/* ── Broadcast match-result header ── */}
      <div
        className="sb-header mb-12"
        style={{
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(79,195,247,0.2)', borderRadius: '4px 4px 0 0', padding: '1.5rem 2rem',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', letterSpacing: '0.4em', color: '#4fc3f7' }}>EXPERIENCE SUMMARY</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', letterSpacing: '0.4em', color: '#4fc3f7' }}>PRESENT</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="text-right flex-1">
            <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '28px', letterSpacing: '0.04em', color: '#ffffff', lineHeight: 1 }}>SARAVANA SAIRAM C</div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Software Engineer</div>
          </div>
          <div className="flex items-center gap-3">
            <ScoreBox value="2024" />
            <span style={{ width: '20px', height: '2px', background: '#4fc3f7' }} />
            <ScoreBox value="2026" />
          </div>
          <div className="text-left flex-1">
            <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '28px', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.85)', lineHeight: 1 }}>FULL STACK + AI</div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Specialization</div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center"
          style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>
          <span>OCT 2024 – JUN 2026 · SOFTWARE ENGINEER</span>
          <span style={{ color: 'rgba(79,195,247,0.5)' }}>|</span>
          <span>AUG 2026 – 2028 · <span style={{ color: '#4fc3f7' }}>SCHOLAR @ SAP</span></span>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2"
          style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.55)' }}>
          <span style={{ color: '#4fc3f7' }}>✦</span>
          <span>React · Three.js · FastAPI · AWS · RAG/LLMs</span>
        </div>
      </div>

      {/* ── Detail view OR grid ── */}
      {selectedProject ? (
        <ProjectDetail project={selectedProject} onClose={handleClose} />
      ) : (
        <>
          <div className="sb-title text-center mb-8">
            <h2 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 'clamp(2.6rem, 6vw, 3.5rem)', letterSpacing: '0.1em', color: '#ffffff', lineHeight: 1 }}>
              FEATURED WORK
            </h2>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span style={{ width: '90px', height: '1px', background: 'rgba(79,195,247,0.3)' }} />
              <FootballIcon size={15} style={{ color: '#4fc3f7' }} />
              <span style={{ width: '90px', height: '1px', background: 'rgba(79,195,247,0.3)' }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 mx-auto" style={{ gap: '16px', width: '100%', maxWidth: '900px' }}>
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} visible={visible} onSelect={handleSelect} />
            ))}
          </div>

          {/* Social links */}
          <div className="sb-social grid grid-cols-3 mb-16 mx-auto"
            style={{ maxWidth: '640px', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(79,195,247,0.15)', borderBottom: '1px solid rgba(79,195,247,0.15)' }}>
            {socialLinks.map((link, i) => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                className="group stat-link flex flex-col items-center justify-center gap-1 py-5 transition-colors"
                style={{ textDecoration: 'none', borderLeft: i === 0 ? 'none' : '1px solid rgba(79,195,247,0.15)' }}>
                <span className="uppercase transition-colors"
                  style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '18px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.85)' }}>
                  {link.label}
                </span>
                <span className="flex items-center gap-1 uppercase"
                  style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', letterSpacing: '0.15em', color: '#4fc3f7' }}>
                  {link.sub}
                </span>
              </a>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center pb-24 flex flex-col items-center gap-6">
            <button
              onClick={onBackToKickOff}
              style={{
                fontFamily: '"Bebas Neue", sans-serif', fontSize: '14px', letterSpacing: '0.15em',
                color: '#4fc3f7', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(79,195,247,0.3)',
                borderRadius: '2px', padding: '10px 28px', cursor: 'pointer',
                transition: 'background 0.3s ease, border-color 0.3s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(79,195,247,0.12)'; e.currentTarget.style.borderColor = '#4fc3f7' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.6)'; e.currentTarget.style.borderColor = 'rgba(79,195,247,0.3)' }}
            >
              ↑ BACK TO KICK OFF
            </button>
            <p className="uppercase" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.15)' }}>
              Built with Three.js · React · GSAP · Blender · FastAPI
            </p>
          </div>
        </>
      )}
    </div>
  )
}

function ScoreBox({ value }) {
  return (
    <span style={{
      fontFamily: '"Bebas Neue", sans-serif', fontSize: 'clamp(2.2rem, 5vw, 52px)',
      lineHeight: 1, color: '#ffffff', background: 'rgba(79,195,247,0.1)',
      border: '1px solid rgba(79,195,247,0.3)', borderRadius: '2px', padding: '6px 16px',
    }}>
      {value}
    </span>
  )
}

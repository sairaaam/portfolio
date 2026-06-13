import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { projects, socialLinks } from '../../data/cards'

function ProjectCard({ project, index, visible }) {
  const cardRef = useRef()

  useEffect(() => {
    if (!cardRef.current) return
    if (visible) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, delay: index * 0.1, ease: 'power3.out' }
      )
    } else {
      gsap.set(cardRef.current, { opacity: 0, y: 30 })
    }
  }, [visible, index])

  return (
    <div
      ref={cardRef}
      className="group relative rounded-xl overflow-hidden cursor-pointer project-card"
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(79,195,247,0.15)',
        transition: 'border-color 0.3s, box-shadow 0.3s, background 0.3s',
        willChange: 'transform, opacity',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${project.color}66`
        e.currentTarget.style.boxShadow = `0 0 30px ${project.color}22`
        e.currentTarget.style.background = 'rgba(79,195,247,0.06)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(79,195,247,0.15)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
      }}
    >
      {/* Top accent line — draws to full width on hover */}
      <div
        className="h-0.5 transition-all duration-300 group-hover:w-full"
        style={{ background: project.color, opacity: 0.8, width: '30%' }}
      />

      <div className="p-5">
        {/* Icon + tag */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl">{project.icon}</span>
          <span
            className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full"
            style={{
              color: project.color,
              background: `${project.color}18`,
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            {project.tag}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-base font-bold mb-2 text-white group-hover:text-[#4fc3f7] transition-colors"
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-white/40 leading-relaxed">
          {project.description}
        </p>

        {/* Arrow link — slides in from the left on hover */}
        <div
          className="mt-4 flex items-center gap-1 text-xs font-medium opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
          style={{ color: project.color }}
        >
          <span>View Project</span>
          <span>→</span>
        </div>
      </div>
    </div>
  )
}

export function Scoreboard({ visible }) {
  const boardRef = useRef()

  useEffect(() => {
    if (!boardRef.current) return
    gsap.to(boardRef.current, {
      opacity: visible ? 1 : 0,
      y: visible ? 0 : 40,
      duration: 0.6,
      ease: 'power3.out',
      overwrite: true,
    })
  }, [visible])

  return (
    <div
      ref={boardRef}
      className="w-full max-w-4xl mx-auto px-6 pointer-events-auto"
      style={{ opacity: 0, transform: 'translateY(40px)' }}
    >
      {/* Match scoreboard */}
      <div className="text-center mb-10">
        <div
          className="text-xs tracking-[0.4em] uppercase mb-4"
          style={{
            color: '#4fc3f7',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          Full Time
        </div>

        {/* Scoreline */}
        <div
          className="inline-flex items-center gap-4 px-6 py-3 rounded-lg mb-2"
          style={{
            background: 'linear-gradient(145deg, rgba(10,30,15,0.9), rgba(5,18,10,0.95))',
            border: '1px solid rgba(79,195,247,0.2)',
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
            letterSpacing: '0.08em',
            color: '#ffffff',
          }}
        >
          <span>SARAVANA FC</span>
          <span
            className="px-3 py-0.5 rounded"
            style={{ background: '#4fc3f7', color: '#04101e' }}
          >
            1 — 0
          </span>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>OPPORTUNITY</span>
        </div>
        <div
          className="text-xs tracking-widest mb-6"
          style={{ color: 'rgba(255,255,255,0.4)', fontFamily: '"JetBrains Mono", monospace' }}
        >
          90+3&apos; ⚽ SARAVANA (pen.)
        </div>

        <h2
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            letterSpacing: '0.08em',
            color: '#ffffff',
            lineHeight: 1,
          }}
        >
          SELECTED WORKS
        </h2>
        <div
          className="h-0.5 w-24 mx-auto mt-4"
          style={{ background: 'linear-gradient(90deg, transparent, #4fc3f7, transparent)' }}
        />
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} visible={visible} />
        ))}
      </div>

      {/* Social links */}
      <div className="flex items-center justify-center gap-8 pb-12">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-sm transition-all"
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontFamily: '"JetBrains Mono", monospace',
              textDecoration: 'none',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#4fc3f7'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            <span className="text-xs tracking-widest uppercase">{link.label}</span>
            <span className="transition-transform group-hover:translate-x-1">{link.icon}</span>
          </a>
        ))}
      </div>

      {/* Scroll back up — replay the match */}
      <div className="text-center pb-10">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-6 py-2.5 rounded-full text-xs tracking-[0.25em] uppercase transition-all"
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            color: '#4fc3f7',
            background: 'rgba(79,195,247,0.08)',
            border: '1px solid rgba(79,195,247,0.35)',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(79,195,247,0.18)'
            e.currentTarget.style.boxShadow = '0 0 24px rgba(79,195,247,0.25)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(79,195,247,0.08)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          ↑ Scroll back up — replay
        </button>
      </div>

      {/* Bottom tagline */}
      <div className="text-center pb-8">
        <p
          className="text-xs tracking-widest uppercase"
          style={{
            color: 'rgba(255,255,255,0.15)',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          Built with React · Three.js · GSAP · Blender
        </p>
      </div>
    </div>
  )
}

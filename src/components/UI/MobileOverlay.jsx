import { fifaCards, projects, socialLinks } from '../../data/cards'

function MobileFIFACard({ card }) {
  return (
    <div
      className="rounded-2xl overflow-hidden mx-auto"
      style={{
        background: card.bgGradient,
        border: `1px solid ${card.accentColor}33`,
        maxWidth: '280px',
        boxShadow: `0 0 30px ${card.accentColor}22`,
      }}
    >
      <div className="px-5 pt-5 pb-2">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div
              className="text-5xl font-black"
              style={{ fontFamily: '"Bebas Neue"', color: card.accentColor }}
            >
              {card.rating}
            </div>
            <div className="text-xs tracking-widest" style={{ color: card.accentColor, opacity: 0.7 }}>
              {card.position}
            </div>
          </div>
          <div className="text-right text-xs" style={{ color: card.accentColor, opacity: 0.5 }}>
            {card.label}
          </div>
        </div>
        <div
          className="text-center text-xl tracking-widest mb-3"
          style={{ fontFamily: '"Bebas Neue"', color: '#fff' }}
        >
          {card.name}
        </div>
      </div>
      <div className="px-5 pb-5 space-y-2">
        {card.stats.map(stat => (
          <div key={stat.label} className="flex items-center gap-2">
            <span className="text-[10px] font-bold w-6" style={{ color: card.accentColor, opacity: 0.7 }}>
              {stat.label}
            </span>
            <span className="text-sm font-bold text-white w-5 text-right">{stat.value}</span>
            <span className="text-[10px] text-white/40 flex-1">{stat.skill}</span>
            <div className="w-16 h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${stat.value}%`, background: card.accentColor }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function MobileOverlay() {
  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center pt-24 pb-12 px-6 text-center">
        <div
          className="text-xs tracking-[0.4em] uppercase mb-4"
          style={{ color: '#4fc3f7', fontFamily: '"JetBrains Mono"' }}
        >
          Full Stack Developer · AI Engineer
        </div>
        <h1
          style={{
            fontFamily: '"Bebas Neue"',
            fontSize: '5rem',
            lineHeight: 0.9,
            color: '#ffffff',
          }}
        >
          SARAVANA
        </h1>
        <p className="mt-4 text-sm text-white/40 tracking-widest">
          React · Three.js · FastAPI · AWS
        </p>
        <div
          className="mt-3 text-xs tracking-widest"
          style={{ color: '#4fc3f7', fontFamily: '"JetBrains Mono"' }}
        >
          ⚽ Best experienced on desktop
        </div>
      </div>

      {/* FIFA Cards */}
      <div className="px-6 space-y-6 mb-12">
        <div
          className="text-center text-xs tracking-[0.3em] uppercase mb-6"
          style={{ color: '#4fc3f7', fontFamily: '"JetBrains Mono"' }}
        >
          Player Stats
        </div>
        {fifaCards.map(card => (
          <MobileFIFACard key={card.id} card={card} />
        ))}
      </div>

      {/* Projects */}
      <div className="px-6 mb-12">
        <div
          className="text-center text-xs tracking-[0.3em] uppercase mb-6"
          style={{ color: '#4fc3f7', fontFamily: '"JetBrains Mono"' }}
        >
          Selected Works
        </div>
        <div className="space-y-4">
          {projects.map(project => (
            <div
              key={project.id}
              className="rounded-xl p-4"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${project.color}22`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span>{project.icon}</span>
                <h3 className="font-bold text-sm">{project.title}</h3>
              </div>
              <p className="text-xs text-white/40">{project.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social */}
      <div className="flex justify-center gap-8 pb-12">
        {socialLinks.map(link => (
          <a
            key={link.label}
            href={link.url}
            className="text-xs tracking-widest uppercase"
            style={{ color: '#4fc3f7', fontFamily: '"JetBrains Mono"', textDecoration: 'none' }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}

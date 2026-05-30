import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Shared icons ─────────────────────────────────────────────────────────────
const PitchinMark = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21.75 3.25 3.9 10.2c-.82.32-.78 1.5.07 1.76l4.96 1.52 1.52 4.96c.26.85 1.44.89 1.76.07L20.75 6.25c.26-.73-.47-1.46-1.2-1.2Z" fill="#F2F0E9"/>
  </svg>
)

const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ─── Noise ────────────────────────────────────────────────────────────────────
function NoiseSVG() {
  return (
    <svg className="noise-overlay" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <filter id="pg-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#pg-noise)"/>
    </svg>
  )
}

// ─── Submit-listing modal ─────────────────────────────────────────────────────
function SubmitModal({ open, onClose }) {
  const [iframeH, setIframeH] = useState(580)

  // Listen to Tally dynamic-height messages
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'tally-height') {
        setIframeH(Math.max(400, e.data.height + 24))
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (open) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, handleKey])

  return (
    <div
      className={`submit-overlay${open ? ' open' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      aria-hidden={!open}
      role="presentation"
    >
      <div
        className="submit-card"
        role="dialog"
        aria-modal="true"
        aria-label="Submit a volunteer listing"
      >
        <div className="submit-card-head">
          <span className="submit-card-title">Submit a Listing</span>
          <button className="submit-card-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="submit-card-body">
          {open && (
            <iframe
              src="https://tally.so/embed/Me8bb0?alignLeft=1&hideTitle=1&dynamicHeight=1&formEventsForwarding=1"
              width="100%"
              height={iframeH}
              title="Submit a volunteer listing"
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ onSubmit }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`} role="banner">
      <div className="nav-inner">
        <a href="/" className="nav-brand" aria-label="Pitchin home">
          <span className="nav-mark"><PitchinMark size={18}/></span>
          <span className="nav-name">Pitchin</span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="/directory/" className="nav-link">Directory</a>
          <a href="/newsroom/" className="nav-link">Newsroom</a>
          <span className="nav-badge" aria-label="Beta version">Beta</span>
        </nav>
        <button
          className="nav-cta"
          onClick={onSubmit}
          aria-label="Submit a volunteer listing"
        >
          Submit Listing
          <span className="nav-cta-icon"><ArrowRight/></span>
        </button>
      </div>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 })
      tl.from('.hero-kicker',    { y: 16, opacity: 0, duration: 0.7, ease: 'power3.out' })
        .from('.hero-line-1 .word', { y: 40, opacity: 0, duration: 0.9, stagger: 0.07, ease: 'power3.out' }, '-=0.3')
        .from('.hero-drama',    { y: 60, opacity: 0, duration: 1.0, ease: 'power3.out' }, '-=0.55')
        .from('.hero-copy',     { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.55')
        .from('.hero-actions > *', { y: 16, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.45')
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" ref={ref} aria-label="Hero">
      <div className="hero-bg" aria-hidden="true">
        <img
          src="/assets/landing/framer/framer-11.jpg"
          alt=""
          className="hero-bg-img"
          fetchpriority="high"
        />
        <div className="hero-bg-gradient"/>
      </div>
      <div className="hero-body shell">
        <div className="hero-kicker" aria-hidden="true">
          <span className="hero-kicker-dot"/>
          BETA — Website in active development
        </div>
        <h1 className="hero-title">
          <span className="hero-line-1" aria-hidden="true">
            <span className="word">Do</span>{' '}
            <span className="word">something</span>{' '}
            <span className="word">that</span>
          </span>
          <span className="hero-drama">lasts.</span>
          <span className="sr-only">Do something that lasts.</span>
        </h1>
        <p className="hero-copy">
          Pitchin is a free, searchable directory of 200+ verified volunteer opportunities across Canada — for students, newcomers, and everyone in between.
        </p>
        <div className="hero-actions">
          <a href="/directory/" className="btn btn--clay">
            Browse Opportunities
            <span className="btn-icon"><ArrowRight/></span>
          </a>
          <a href="/newsroom/" className="btn btn--ghost">
            The Newsroom
            <span className="btn-icon"><ArrowRight/></span>
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Logo strip ───────────────────────────────────────────────────────────────
const LOGOS_A = [
  { src: '/assets/landing/framer/framer-07.png', alt: 'University of Calgary' },
  { src: '/assets/landing/framer/framer-05.png', alt: 'University of Manitoba' },
  { src: '/assets/landing/framer/framer-27.png', alt: 'Toronto Metropolitan University' },
  { src: '/assets/landing/framer/framer-26.png', alt: 'University of Waterloo' },
  { src: '/assets/landing/framer/framer-23.png', alt: 'University of Victoria' },
  { src: '/assets/landing/framer/framer-25.png', alt: 'McGill University' },
  { src: '/assets/landing/framer/framer-02.png', alt: 'University of Saskatchewan' },
  { src: '/assets/landing/framer/framer-22.png', alt: 'University of Alberta' },
  { src: '/assets/landing/universities/uottawa.png', alt: 'University of Ottawa' },
  { src: '/assets/landing/universities/carleton.svg', alt: 'Carleton University' },
  { src: '/assets/landing/universities/guelph.svg', alt: 'University of Guelph' },
  { src: '/assets/landing/universities/memorial.svg', alt: 'Memorial University' },
]

const LOGOS_B = [
  { src: '/assets/landing/framer/framer-21.png', alt: '' },
  { src: '/assets/landing/framer/framer-18.png', alt: '' },
  { src: '/assets/landing/framer/framer-01.png', alt: '' },
  { src: '/assets/landing/framer/framer-19.png', alt: '' },
  { src: '/assets/landing/framer/framer-28.png', alt: '' },
  { src: '/assets/landing/framer/framer-08.png', alt: '' },
  { src: '/assets/landing/framer/framer-14.png', alt: '' },
  { src: '/assets/landing/universities/sfu.svg', alt: 'SFU' },
  { src: '/assets/landing/universities/dalhousie.svg', alt: 'Dalhousie' },
  { src: '/assets/landing/universities/windsor.png', alt: 'University of Windsor' },
  { src: '/assets/landing/universities/brock.svg', alt: 'Brock University' },
  { src: '/assets/landing/universities/regina.png', alt: 'University of Regina' },
]

function LogoTrack({ logos, reverse, label }) {
  const doubled = [...logos, ...logos]
  return (
    <div
      className={`marquee-track ${reverse ? 'marquee-track--reverse' : ''}`}
      aria-hidden={reverse || undefined}
      aria-label={!reverse ? label : undefined}
    >
      {doubled.map((logo, i) => (
        <div key={i} className="marquee-item">
          <img src={logo.src} alt={logo.alt} loading="lazy"/>
        </div>
      ))}
    </div>
  )
}

function LogoStrip() {
  return (
    <section className="logo-strip">
      <p className="logo-strip-label">Built for students at universities across Canada</p>
      <div className="marquee-wrap" aria-label="Partner universities">
        <LogoTrack logos={LOGOS_A} reverse={false} label="Universities row 1"/>
        <LogoTrack logos={LOGOS_B} reverse={true}/>
      </div>
    </section>
  )
}

// ─── Feature cards ────────────────────────────────────────────────────────────
const SHUFFLER_ITEMS = [
  { tag: 'Healthcare', city: 'Vancouver, BC', commit: 'Weekly · 4 hrs' },
  { tag: 'Food Bank',  city: 'Calgary, AB',   commit: 'Bi-weekly · 3 hrs' },
  { tag: 'Tutoring',   city: 'Toronto, ON',   commit: 'Flexible · 2 hrs' },
]

function ShufflerCard() {
  const [items, setItems] = useState(SHUFFLER_ITEMS)

  useEffect(() => {
    const id = setInterval(() => {
      setItems(prev => {
        const next = [...prev]
        next.unshift(next.pop())
        return next
      })
    }, 2600)
    return () => clearInterval(id)
  }, [])

  return (
    <article className="feat-card feat-card--shuffler" aria-label="Search feature">
      <div className="feat-card-visual" aria-hidden="true">
        <div className="shuffler">
          {items.map((item, i) => (
            <div key={item.tag} className="shuffler-item" style={{ '--depth': i }}>
              <span className="shuffler-tag">{item.tag}</span>
              <span className="shuffler-city">{item.city}</span>
              <span className="shuffler-commit">{item.commit}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="feat-card-body">
        <h3 className="feat-card-title">Search</h3>
        <p className="feat-card-copy">One searchable directory for all verified Canadian volunteer opportunities.</p>
      </div>
    </article>
  )
}

const FEED_MSGS = [
  '✓  St. Paul\'s Hospital — Patient Visitor · Vancouver',
  '✓  Calgary Food Bank — Warehouse Support · Calgary',
  '✓  SickKids — Event Coordinator · Toronto',
  '✓  CHEO — Administrative Aid · Ottawa',
  '✓  Foothills Medical — Greeter · Calgary',
]

function TypewriterCard() {
  const [lines, setLines] = useState([''])
  const [msgIdx, setMsgIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)

  useEffect(() => {
    const msg = FEED_MSGS[msgIdx]
    if (charIdx < msg.length) {
      const t = setTimeout(() => setCharIdx(c => c + 1), 32)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setLines(prev => [...prev.slice(-3), ''])
      setMsgIdx(i => (i + 1) % FEED_MSGS.length)
      setCharIdx(0)
    }, 1500)
    return () => clearTimeout(t)
  }, [charIdx, msgIdx])

  useEffect(() => {
    setLines(prev => [...prev.slice(0, -1), FEED_MSGS[msgIdx].slice(0, charIdx)])
  }, [charIdx, msgIdx])

  return (
    <article className="feat-card feat-card--typewriter" aria-label="Verify feature">
      <div className="feat-card-visual">
        <div className="tw-header" aria-hidden="true">
          <span className="tw-live-dot"/>
          <span className="tw-live-label">Verification Feed</span>
        </div>
        <div className="tw-feed" role="log" aria-live="polite" aria-label="Live verification feed">
          {lines.map((line, i) => (
            <div key={i} className={`tw-line ${i === lines.length - 1 ? 'tw-line--active' : 'tw-line--done'}`}>
              <span className="tw-text">{line}</span>
              {i === lines.length - 1 && <span className="tw-cursor" aria-hidden="true"/>}
            </div>
          ))}
        </div>
      </div>
      <div className="feat-card-body">
        <h3 className="feat-card-title">Verify</h3>
        <p className="feat-card-copy">Every listing is manually reviewed before going live. No broken links, no expired deadlines.</p>
      </div>
    </article>
  )
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function SchedulerCard() {
  const [activeDay, setActiveDay] = useState(null)
  const [phase, setPhase] = useState('idle')

  useEffect(() => {
    let timers = []
    const run = () => {
      setPhase('idle'); setActiveDay(null)
      timers.push(setTimeout(() => { setPhase('moving') }, 500))
      timers.push(setTimeout(() => { setPhase('clicking'); setActiveDay(3) }, 1300))
      timers.push(setTimeout(() => { setPhase('done') }, 1900))
      timers.push(setTimeout(() => run(), 4200))
    }
    run()
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <article className="feat-card feat-card--scheduler" aria-label="Apply feature">
      <div className="feat-card-visual" aria-hidden="true">
        <div className="sched-header">
          <span className="sched-label">Weekly Commitment</span>
        </div>
        <div className="sched-grid">
          {DAYS.map((day, i) => (
            <button
              key={i}
              className={`sched-day${activeDay === i ? ' sched-day--active' : ''}${phase === 'clicking' && i === 3 ? ' sched-day--press' : ''}`}
              onClick={() => setActiveDay(i)}
              aria-pressed={activeDay === i}
              tabIndex={-1}
            >
              {day}
            </button>
          ))}
        </div>
        <div className={`sched-confirm${phase === 'done' ? ' sched-confirm--visible' : ''}`}>
          ✓ Wednesday saved
        </div>
      </div>
      <div className="feat-card-body">
        <h3 className="feat-card-title">Apply</h3>
        <p className="feat-card-copy">Apply directly through the organization's own page. No middleman, no account required.</p>
      </div>
    </article>
  )
}

function Features() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feat-card', {
        y: 48,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.features-grid', start: 'top 78%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section features" ref={ref}>
      <div className="shell">
        <p className="section-eyebrow">What you get</p>
        <h2 className="section-heading">Tools built for the<br/><em>way you actually volunteer.</em></h2>
        <div className="features-grid">
          <ShufflerCard/>
          <TypewriterCard/>
          <SchedulerCard/>
        </div>
      </div>
    </section>
  )
}

// ─── Why ──────────────────────────────────────────────────────────────────────
const WITHOUT = [
  { title: 'Scattered Listings',    copy: 'Opportunities buried across hospital websites, Instagram posts, and random nonprofit pages.' },
  { title: 'Outdated Information',  copy: 'Deadlines passed, links broken, no way to know if a role is still available.' },
  { title: 'Hard to Compare',       copy: 'No consistent format, no filters, and no way to find what\'s meant for you.' },
]
const WITH = [
  { title: 'One Searchable Directory', copy: 'Every opportunity in one place, filterable by location, category, and commitment.' },
  { title: 'Verified and Current',     copy: 'We check every single listing manually before they go live.' },
  { title: 'Built for Everyone',       copy: 'Filter by healthcare relevance, age requirement, schedule fit, and beyond.' },
]

function Why() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.why-col', {
        y: 32,
        opacity: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section why" ref={ref}>
      <div className="shell">
        <p className="section-eyebrow">Why choose us</p>
        <h2 className="section-heading">The smarter way<br/><em>to find your fit.</em></h2>
        <div className="why-grid">
          <div className="why-col why-col--without">
            <h3 className="why-col-heading">Without Pitchin 😟</h3>
            <ul className="why-list">
              {WITHOUT.map(item => (
                <li key={item.title} className="why-item">
                  <span className="why-icon why-icon--x" aria-label="disadvantage">×</span>
                  <div>
                    <strong className="why-item-title">{item.title}</strong>
                    <p className="why-item-copy">{item.copy}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="why-col why-col--with">
            <h3 className="why-col-heading">With Pitchin 🫡</h3>
            <ul className="why-list">
              {WITH.map(item => (
                <li key={item.title} className="why-item">
                  <span className="why-icon why-icon--check" aria-label="benefit">✓</span>
                  <div>
                    <strong className="why-item-title">{item.title}</strong>
                    <p className="why-item-copy">{item.copy}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Philosophy ───────────────────────────────────────────────────────────────
function Philosophy() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.manifesto-line', {
        y: 40,
        opacity: 0,
        duration: 1.1,
        stagger: 0.3,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 65%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="philosophy" ref={ref}>
      <div className="philosophy-noise" aria-hidden="true"/>
      <div className="shell">
        <p className="manifesto-line manifesto-line--small">
          Most volunteer platforms focus on: listing everything.
        </p>
        <p className="manifesto-line manifesto-line--large">
          We focus on: <em className="manifesto-accent">quality.</em>
        </p>
      </div>
    </section>
  )
}

// ─── Protocol (How it works) ──────────────────────────────────────────────────
function ConcentricCircles() {
  return (
    <svg className="proto-anim-svg" viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <circle cx="100" cy="100" r="18" stroke="#CC5833" strokeWidth="1.5" opacity="0.9"/>
      <circle cx="100" cy="100" r="38" stroke="#CC5833" strokeWidth="1"   opacity="0.65"/>
      <circle cx="100" cy="100" r="58" stroke="#CC5833" strokeWidth="1"   opacity="0.40"/>
      <circle cx="100" cy="100" r="78" stroke="#CC5833" strokeWidth="0.8" opacity="0.22"/>
      <circle cx="100" cy="100" r="94" stroke="#CC5833" strokeWidth="0.5" opacity="0.12"/>
      <circle cx="100" cy="100" r="4"  fill="#CC5833" opacity="0.9"/>
    </svg>
  )
}

function LaserGrid() {
  const dots = []
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 8; c++) {
      dots.push({ x: 14 + c * 26, y: 16 + r * 26 })
    }
  }
  return (
    <svg className="proto-anim-svg" viewBox="0 0 216 136" fill="none" aria-hidden="true">
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="2.5" fill="#2E4036" opacity="0.25"/>
      ))}
      <line className="laser-line" x1="0" y1="68" x2="216" y2="68" stroke="#CC5833" strokeWidth="1.5" opacity="0.85"/>
    </svg>
  )
}

function EkgWave() {
  return (
    <svg className="proto-anim-svg" viewBox="0 0 300 100" fill="none" aria-hidden="true">
      <path
        className="ekg-path"
        d="M0 50 L55 50 L72 22 L88 78 L104 22 L120 78 L136 50 L300 50"
        stroke="#CC5833"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const STEPS = [
  { num: '01', title: 'Search',         copy: 'Browse 200+ verified opportunities by location, category, or commitment type. Everything in one place.', Visual: ConcentricCircles },
  { num: '02', title: 'Find your fit',  copy: 'Read the full listing, check the requirements, and see if it works for your schedule and location.', Visual: LaserGrid },
  { num: '03', title: 'Apply directly', copy: "Click the application link and apply through the organization's own page. No middleman, no friction.", Visual: EkgWave },
]

function Protocol() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      STEPS.forEach((_, i) => {
        gsap.from(`.proto-card:nth-child(${i + 1}) .proto-card-content`, {
          y: 48,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: `.proto-card:nth-child(${i + 1})`, start: 'top 75%' },
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section protocol" ref={ref}>
      <div className="shell">
        <p className="section-eyebrow">How it works</p>
        <h2 className="section-heading">Three steps to<br/><em>your next role.</em></h2>
        <div className="proto-cards">
          {STEPS.map((step) => (
            <div key={step.num} className="proto-card">
              <div className="proto-card-content">
                <div className="proto-visual">
                  <step.Visual/>
                </div>
                <div className="proto-copy">
                  <span className="proto-num">{step.num}</span>
                  <h3 className="proto-title">{step.title}</h3>
                  <p className="proto-copy-text">{step.copy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const ref = useRef(null)
  const counted = useRef(false)

  useEffect(() => {
    const animate = (el, target) => {
      const start = performance.now()
      const suffix = el.dataset.suffix || ''
      const prefix = el.dataset.prefix || ''
      const tick = now => {
        const p = Math.min((now - start) / 1300, 1)
        const eased = 1 - (1 - p) ** 3
        el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || counted.current) return
      counted.current = true
      ref.current?.querySelectorAll('[data-target]').forEach(el =>
        animate(el, Number(el.dataset.target))
      )
    }, { threshold: 0.5 })

    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="stats" ref={ref} aria-label="Pitchin statistics">
      <div className="shell">
        <div className="stats-bar">
          <div className="stat">
            <span className="stat-num" data-target="200" data-suffix="+">200+</span>
            <span className="stat-label">Verified Opportunities</span>
          </div>
          <div className="stat">
            <span className="stat-num" data-target="15" data-suffix="+">15+</span>
            <span className="stat-label">Cities Covered</span>
          </div>
          <div className="stat">
            <span className="stat-num" data-target="0" data-prefix="$">$0</span>
            <span className="stat-label">Cost to You, Always</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'How do I apply for an opportunity?',
    a: "Each listing includes a direct link to the organization's application page, or contact details for a representative. Pitchin doesn't process applications — we just connect you." },
  { q: 'How often are the listings updated?',
    a: 'We update listings on a daily basis, with final verification before they go live. Each listing shows the last date it was checked, so you always know how fresh it is.' },
  { q: "I'm from an organization. Can I submit a listing?",
    a: 'Absolutely! Use the "Submit a Listing" form and we\'ll review it within a few days. Approved listings go live in our directory for free.' },
  { q: 'Is Pitchin free to use?',
    a: 'Completely free. No account needed, no fees, and no catch. All you need to do is spread the word.' },
  { q: 'Do you cover all of Canada?',
    a: "We're working to add listings across all Canadian provinces and territories, including remote opportunities. Coverage grows as the platform does." },
  { q: 'Who is Pitchin for?',
    a: "Pitchin is built for students, newcomers, and community members — especially those pursuing healthcare, education, or social service careers. But really, it's for everyone." },
]

function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section className="section faq" aria-labelledby="faq-heading">
      <div className="shell">
        <p className="section-eyebrow">FAQ</p>
        <h2 className="section-heading" id="faq-heading">Questions,<br/><em>answered.</em></h2>
        <div className="faq-list" role="list">
          {FAQS.map((item, i) => (
            <div key={i} className={`faq-item${open === i ? ' faq-item--open' : ''}`} role="listitem">
              <button
                className="faq-q"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`faq-panel-${i}`}
              >
                <span>{item.q}</span>
                <span className="faq-icon" aria-hidden="true">{open === i ? '−' : '+'}</span>
              </button>
              <div
                id={`faq-panel-${i}`}
                className="faq-panel"
                role="region"
                aria-hidden={open !== i}
              >
                <p className="faq-a">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA({ onSubmit }) {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-card > *', {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 72%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="cta-section" ref={ref}>
      <div className="shell">
        <div className="cta-card">
          <div className="cta-noise" aria-hidden="true"/>
          <p className="section-eyebrow cta-eyebrow">Get started</p>
          <h2 className="cta-title">Ready to find your<br/><em>next opportunity?</em></h2>
          <p className="cta-copy">
            Search verified roles, find something that actually fits your life, and apply without getting lost in a maze of stale links.
          </p>
          <div className="cta-actions">
            <a href="/directory/" className="btn btn--clay">
              Browse Opportunities
              <span className="btn-icon"><ArrowRight/></span>
            </a>
            <button
              className="btn"
              style={{ background: 'rgba(242,240,233,0.14)', color: '#F2F0E9', border: '1.5px solid rgba(242,240,233,0.28)' }}
              onClick={onSubmit}
            >
              Submit an Opportunity
              <span className="btn-icon"><ArrowRight/></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ onSubmit }) {
  return (
    <footer className="footer" role="contentinfo">
      <div className="shell footer-inner">
        <div className="footer-brand-col">
          <a href="/" className="footer-brand" aria-label="Pitchin home">
            <span className="footer-mark"><PitchinMark size={16}/></span>
            <span className="footer-name">Pitchin</span>
          </a>
          <p className="footer-copy">Connecting Canadians to meaningful volunteer opportunities.</p>
          <div className="footer-status" aria-label="System status: operational">
            <span className="footer-status-dot" aria-hidden="true"/>
            <span className="footer-status-text">System Operational</span>
          </div>
        </div>
        <div>
          <h3 className="footer-col-heading">Follow us</h3>
          <ul className="footer-links">
            <li><a href="https://www.instagram.com/pitchin.live" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://www.linkedin.com/company/pitchinvolunteer/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </div>
        <div>
          <h3 className="footer-col-heading">Contact</h3>
          <ul className="footer-links">
            <li><a href="mailto:hello@pitchin.live">hello@pitchin.live</a></li>
            <li><span style={{ color: 'rgba(242,240,233,0.35)', fontSize: '14px' }}>Saskatchewan, CA</span></li>
          </ul>
        </div>
        <div>
          <h3 className="footer-col-heading">Navigate</h3>
          <ul className="footer-links">
            <li><a href="/directory/">Directory</a></li>
            <li><a href="/newsroom/">Newsroom</a></li>
            <li><button className="footer-submit-btn" onClick={onSubmit}>Submit a Listing</button></li>
          </ul>
        </div>
      </div>
      <div className="footer-meta shell">
        <span>© 2026 Pitchin. All rights reserved.</span>
        <span className="footer-dot" aria-hidden="true"/>
        <span>Made with love in The Prairies 🌾</span>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [submitOpen, setSubmitOpen] = useState(false)
  const openSubmit  = useCallback(() => setSubmitOpen(true),  [])
  const closeSubmit = useCallback(() => setSubmitOpen(false), [])

  return (
    <>
      <NoiseSVG/>
      <Navbar onSubmit={openSubmit}/>
      <main id="main-content">
        <Hero/>
        <LogoStrip/>
        <Features/>
        <Why/>
        <Philosophy/>
        <Protocol/>
        <Stats/>
        <FAQ/>
        <CTA onSubmit={openSubmit}/>
      </main>
      <Footer onSubmit={openSubmit}/>
      <SubmitModal open={submitOpen} onClose={closeSubmit}/>
    </>
  )
}

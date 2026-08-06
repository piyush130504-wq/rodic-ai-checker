import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "@/rodic.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/* Real aerial photograph of an Indian coastal highway interchange (documentary asset, not AI) */
const HERO_BG =
  "https://images.unsplash.com/photo-1708357997379-e55c1636e0d7?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000";

/* ───────────────── ICONS (distinct, 1.5px stroke, 24 grid) ───────────────── */
const iconProps = {
  width: 24, height: 24, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round",
};

const RoadIcon = () => (
  <svg {...iconProps}><path d="M4 21 8.5 3" /><path d="M20 21 15.5 3" /><path d="M12 4v3M12 10v3M12 17v3" /></svg>
);
const ChipIcon = () => (
  <svg {...iconProps}><rect x="6" y="6" width="12" height="12" rx="1.5" /><rect x="9.5" y="9.5" width="5" height="5" rx="0.5" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></svg>
);
const LeafIcon = () => (
  <svg {...iconProps}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6" /></svg>
);
const TransitIcon = () => (
  <svg {...iconProps}><rect x="4" y="3" width="16" height="14" rx="2" /><path d="M4 11h16M8 17v3M16 17v3" /><circle cx="8" cy="14" r="0.6" fill="currentColor" /><circle cx="16" cy="14" r="0.6" fill="currentColor" /></svg>
);
const DropletIcon = () => (
  <svg {...iconProps}><path d="M12 2.7s5.5 6 5.5 10.5a5.5 5.5 0 0 1-11 0C6.5 8.7 12 2.7 12 2.7z" /><path d="M9.5 13a2.5 2.5 0 0 0 2.5 2.5" /></svg>
);
const CraneIcon = () => (
  <svg {...iconProps}><path d="M3 21h18" /><path d="M7 21V5l10-2" /><path d="M3 5h15" /><path d="M11 5v4" /><path d="M9.6 9h2.8L11 12z" /></svg>
);

/* ─── FOCUS AREAS ─── */
const FOCUS_AREAS = [
  { id: "infrastructure", title: "Infrastructure Innovation", desc: "Driving infrastructure innovation across highways, bridges, and tunnels in India", Icon: RoadIcon, media: "/media/booth.jpeg" },
  { id: "ai", title: "AI & Digital Transformation", desc: "Advancing AI and digital transformation in construction and infrastructure delivery", Icon: ChipIcon, media: "/media/vr-demo.jpeg", mediaTag: "Live AI & VR demo · Bihar AI Summit" },
  { id: "sustainability", title: "Sustainability & Climate Resilience", desc: "Sustainable infrastructure research for climate-resilient development", Icon: LeafIcon, media: "/media/panel-outdoor.jpeg" },
  { id: "transportation", title: "Transportation & Mobility", desc: "Smart transportation and mobility solutions for urban and regional connectivity", Icon: TransitIcon, media: "/media/img1.png" },
  { id: "water", title: "Water & Urban Infrastructure", desc: "Urban water infrastructure innovation through research-led engineering", Icon: DropletIcon, media: "/media/img2.png" },
  { id: "construction", title: "Construction Technology", desc: "Construction technology and project management innovation across infrastructure delivery", Icon: CraneIcon, media: "/media/software-presentation.jpeg" },
];

/* ─── EVENT GALLERY (Rodic Innovations in Action) ─── */
const EVENT_PHOTOS = [
  { src: "/media/booth.jpeg", caption: "Rodic Digital & Advisory Booth", idx: "01", cell: "cell-p1", testid: "photo-gallery-booth" },
  { src: "/media/software-presentation.jpeg", caption: "Live AI Software Demo", idx: "02", cell: "cell-p2", testid: "photo-gallery-ai" },
  { src: "/media/vr-demo.jpeg", caption: "Immersive VR Experience", idx: "03", cell: "cell-p3", testid: "photo-gallery-vr" },
  { src: "/media/panel-outdoor.jpeg", caption: "Panel & Knowledge Sharing", idx: "04", cell: "cell-p4", testid: "photo-gallery-outdoor" },
];

/* ─── LEADERS ─── */
const leaders = [
  { name: "Mr. Raj Kumar", designation: "Chairman & Managing Director", image: "/media/raj-kumar.png" },
  { name: "Mr. Anshuman Krishanu", designation: "Chief Operating Officer", image: "https://d1vah4ferpk10z.cloudfront.net/coo_anshuman_49f52bbd7c.png" },
  { name: "Mr. Sapan Gupta", designation: "Chief Financial Officer", image: "https://d1vah4ferpk10z.cloudfront.net/cfo_sapan_89331d5330.png" },
];

/* ─── NAV ITEMS ─── */
const navItems = [
  { id: "home", label: "Home" },
  { id: "focus", label: "Focus Areas" },
  { id: "ecosystem", label: "Rodic Innovations in Action" },
  { id: "leaders", label: "Leaders" },
  { id: "resources", label: "Resources", dropdown: [{ id: "brochure", label: "Rodic Innovations Brochure", href: "/rodic_innovations_brochure.pdf" }] },
];

/* ───────────────── COMPONENTS ───────────────── */

const TargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const InstitutionIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22h20M12 2l10 5-10 5-10-5zM12 12v10M17 10v12M7 10v12" />
  </svg>
);

const ResearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 2v6.5L4.5 18a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L15 8.5V2" />
    <path d="M7 2h10M8 15h8" />
  </svg>
);

const RocketIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const Eyebrow = ({ children }) => <span className="eyebrow">{children}</span>;

const Section = ({ id, variant = "", children }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("reveal")),
      { rootMargin: "0px 0px -8% 0px", threshold: 0 }
    );
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <section id={id} ref={ref} className={`band ${variant}`} data-testid={`section-${id}`}>
      <div className="wrap">{children}</div>
    </section>
  );
};

/* ─── NAV ─── */
function Nav({ onNav }) {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const go = (id) => { setOpen(false); setDropdownOpen(false); onNav(id); };

  return (
    <>
      <nav className="nav" data-testid="main-nav">
        <div className="nav-logo" data-testid="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a href="https://www.rodicconsultants.com/" target="_blank" rel="noopener noreferrer">
            <img src="/media/rodic-logo.webp" alt="Rodic Consultants" style={{ height: '60px', width: 'auto' }} />
          </a>
          <span>× Rodic Innovations</span>
        </div>
        <div className="nav-links">
          {navItems.map((n) => (
            n.dropdown ? (
              <div key={n.id} className="nav-item-dropdown" ref={dropdownRef}>
                <button
                  className="nav-link dropdown-toggle"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {n.label} <span className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}>▼</span>
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="dropdown-menu"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {n.dropdown.map(d => (
                        <a
                          key={d.id}
                          href={d.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="dropdown-link"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {d.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <span key={n.id} className="nav-link" data-testid={`nav-link-${n.id}`} onClick={() => go(n.id)}>
                {n.label}
              </span>
            )
          ))}
          <button className="btn btn-primary nav-cta" data-testid="nav-contact-btn" onClick={() => go("contact")}>
            Get in Touch
          </button>
        </div>
        <button className="hamburger" aria-label="Open menu" data-testid="hamburger-btn" onClick={() => setOpen((o) => !o)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </nav>
      <div className={`mobile-panel${open ? " open" : ""}`} data-testid="mobile-panel">
        {navItems.map((n) => (
          n.dropdown ? (
            <div key={n.id} className="mobile-nav-dropdown">
              <span className="nav-link" onClick={() => setDropdownOpen(!dropdownOpen)} style={{ display: 'flex', justifyContent: 'space-between' }}>
                {n.label} <span className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}>▼</span>
              </span>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    className="mobile-dropdown-menu"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    {n.dropdown.map(d => (
                      <a
                        key={d.id}
                        href={d.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mobile-dropdown-link"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {d.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <span key={n.id} className="nav-link" data-testid={`mobile-link-${n.id}`} onClick={() => go(n.id)}>
              {n.label}
            </span>
          )
        ))}
        <button className="btn btn-primary" data-testid="mobile-contact-btn" onClick={() => go("contact")}>
          Get in Touch
        </button>
      </div>
    </>
  );
}

/* ─── HERO ─── */
function Hero({ onNav }) {
  return (
    <section id="home" className="hero" data-testid="hero">
      <div className="hero-bg-anim" style={{ backgroundImage: `url(${HERO_BG})` }} />
      <div className="hero-overlay" />
      <div className="hero-inner">
        <span className="hero-tag">Rodic Innovations</span>
        <h1 data-testid="hero-headline">
          Two Decades of Infrastructure.<br />
          <span className="gradient-text">Now Open for Research Collaboration.</span>
        </h1>
        <p className="sub">
          Rodic Innovations serves as the bridge between India’s deep-tech innovators and the nation’s most pressing infrastructure challenges, enabling scalable solutions for highways, urban water systems, and beyond.
        </p>
        <div className="hero-cta">
          <button className="btn btn-primary" data-testid="hero-ideas-btn" onClick={() => onNav("contact")}>
            Start a Partnership <span className="ar">→</span>
          </button>
          <span className="hero-text-link" data-testid="hero-contact-btn" onClick={() => onNav("focus")}>
            Explore Focus Areas
          </span>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num">20+</span>
            <span className="hero-stat-label">Years in Infrastructure</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-num">₹10,000 Cr+</span>
            <span className="hero-stat-label">Projects Delivered</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-num">NASSCOM</span>
            <span className="hero-stat-label">Ecosystem Partner</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── ABOUT Rodic Innovations ─── */
function AboutReep() {
  return (
    <Section id="about">
      <div className="about-layout">
        <div className="about-content">
          <Eyebrow>About Rodic Innovations</Eyebrow>
          <h2 style={{ marginBottom: "var(--s4)" }}>
            Advancing <span className="gradient-text">infrastructure innovation</span> across India.
          </h2>
          <div className="about-text-blocks">
            <p className="lede">
              Rodic Innovations is an industry platform built to advance infrastructure innovation, connecting academic institutions, researchers, and startups around real infrastructure challenges.
            </p>
            <p>
              With over two decades of infrastructure consulting experience, Rodic launched Rodic Innovations to formalize industry-academia collaboration through a structured research partnership program that channels technical expertise directly into infrastructure innovation.
            </p>
          </div>
          <div className="about-creds" data-testid="about-creds">
            <span>ISO 9001:2015 Certified</span>
            <span>Government Empanelled</span>
            <span>A Division of Rodic Consultants</span>
          </div>
        </div>

        <div className="about-visual">
          <div className="mission-card">
            <div className="mission-icon"><TargetIcon /></div>
            <h3>Our Objective</h3>
            <p>
              Build research partnerships by creating startup collaboration pathways in infrastructure and construction technology, and strengthen India's broader innovation ecosystem.
            </p>
            <div className="mission-stats">
              <div className="m-stat">
                <h4>20+</h4>
                <span>Years Experience</span>
              </div>
              <div className="m-stat">
                <h4>6</h4>
                <span>Core Focus Areas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─── FOCUS AREAS ─── */
function FocusAreas() {
  return (
    <Section id="focus">
      <div className="sec-head">
        <Eyebrow>Focus Areas</Eyebrow>
        <h2>Engineering the <span className="gradient-text">future.</span></h2>
        <p className="lede">Collaborate on the most critical challenges facing public infrastructure today.</p>
      </div>

      <div className="focus-grid" data-testid="focus-grid">
        {FOCUS_AREAS.map((area) => (
          <div
            className={`focus-card${area.media ? " has-media" : ""}`}
            key={area.id}
            data-testid={`focus-card-${area.id}`}
          >
            {area.media && (
              <div className="focus-media" style={{ backgroundImage: `url(${area.media})` }} data-testid={`focus-media-${area.id}`} />
            )}
            <div className="focus-inner">
              <div className="focus-icon"><area.Icon /></div>
              <h4>{area.title}</h4>
              <p>{area.desc}</p>
              {area.mediaTag && <span className="media-tag">◉ {area.mediaTag}</span>}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ─── MEDIA LIGHTBOX ─── */
function MediaLightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return;
    
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="lightbox-overlay"
          data-testid="media-lightbox-overlay"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className={`lightbox-content${item.type === "video" ? " is-video" : ""}`}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <button className="lightbox-close" onClick={onClose} aria-label="Close" data-testid="media-lightbox-close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
            <div className="lightbox-media">
              {item.type === "video" ? (
                <video src={item.src} autoPlay loop controls playsInline data-testid="lightbox-video" />
              ) : (
                <img src={item.src} alt={item.caption} data-testid="lightbox-image" />
              )}
            </div>
            <span className="lightbox-cap">{item.caption}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const ExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
);

/* ─── Rodic Innovations IN ACTION (Editorial Bento) ─── */
function ReepInAction() {
  const videoRef = useRef(null);
  const [lightbox, setLightbox] = useState(null);

  return (
    <Section id="ecosystem">
      <div className="sec-head" data-testid="reep-in-action-section">
        <Eyebrow>Rodic Innovations in Action</Eyebrow>
        <h2>On the ground at <span className="gradient-text">India's AI summits.</span></h2>
        <p className="lede">
          From the Bihar AI Summit 2026 to live VR and AI software demos — Rodic Innovations shows up where India's
          technology and infrastructure ecosystem comes together.
        </p>
        <div className="ecosystem-meta">
          <span>Bihar AI Summit 2026</span>
          <span>Booth 1.44</span>
          <span>AI · VR · Digital Advisory</span>
        </div>
      </div>

      <div className="bento" data-testid="ecosystem-bento">
        {/* Vertical recap video */}
        <div
          className="bento-cell cell-video"
          data-testid="video-recap-trigger"
          onClick={() => setLightbox({ type: "video", src: "/media/summit-recap.mp4", caption: "Bihar AI Summit 2026 — Recap Reel" })}
        >
          <video ref={videoRef} src="/media/summit-recap.mp4" autoPlay loop muted playsInline preload="metadata" data-testid="ecosystem-video" />
          <div className="cell-overlay" />
          <span className="live-badge"><span className="dot" />Summit Recap</span>
        </div>

        {/* Event photos */}
        {EVENT_PHOTOS.map((p) => (
          <div
            className={`bento-cell ${p.cell}`}
            key={p.idx}
            data-testid={p.testid}
            onClick={() => setLightbox({ type: "image", src: p.src, caption: p.caption })}
          >
            <img src={p.src} alt={p.caption} loading="lazy" />
            <div className="cell-overlay" />
            <button className="cell-expand" aria-label="Expand image"><ExpandIcon /></button>
            <div className="cell-cap">
              <span className="cap-label">{p.caption}</span>
              <span className="cap-idx">{p.idx}</span>
            </div>
          </div>
        ))}
      </div>

      <MediaLightbox item={lightbox} onClose={() => setLightbox(null)} />
    </Section>
  );
}

/* ─── STARTUP PROGRAM (Collaborate) ─── */
function StartupProgram({ onNav }) {
  const [lightbox, setLightbox] = useState(null);
  const videoRef = useRef(null);
  const desiredRate = useRef(0.6);

  const applyPlaybackRate = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = desiredRate.current;
    }
  };

  useEffect(() => {
    applyPlaybackRate();
  }, []);

  return (
    <Section id="routing">
      <div className="sec-head">
        <Eyebrow>Collaborate</Eyebrow>
        <h2>Join the <span className="gradient-text">ecosystem.</span></h2>
        <p className="lede">A dedicated track for emerging companies to engage and scale.</p>
      </div>

      <div className="startup-feature" data-testid="route-startup">
        <div 
          className="startup-img-col"
          onClick={() => setLightbox({ type: "video", src: "/media/startup-program.mp4", caption: "Deep-tech solution presentation" })}
          style={{ cursor: 'pointer' }}
        >
          <video 
            ref={videoRef}
            src="/media/startup-program.mp4" 
            autoPlay loop muted playsInline preload="metadata" 
            onLoadedMetadata={applyPlaybackRate}
            onClick={() => {
              desiredRate.current = 1;
              applyPlaybackRate();
            }}
            style={{ cursor: "pointer" }}
          />
          <div className="startup-badge">
            <RocketIcon />
            <span>Scale with Rodic</span>
          </div>
        </div>
        
        <div className="startup-content-col">
          <h3>Deploy your deep-tech solution.</h3>
          <p className="startup-desc">
            Integrate your technology with live government infrastructure through paid pilot programs, 
            validated and scaled via Rodic's exclusive NASSCOM collaboration track.
          </p>
          
          <ul className="startup-perks">
            <li><span className="chk">✓</span> Paid pilot deployments</li>
            <li><span className="chk">✓</span> Live infrastructure data access</li>
            <li><span className="chk">✓</span> <a href="https://nasscom.in/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline', color: 'inherit' }}>NASSCOM</a> scalability certification</li>
          </ul>
          
          <div className="startup-actions">
            <button className="btn btn-primary" onClick={() => onNav("idea-checker")}>
              Check Your Startup Idea <span className="ar">→</span>
            </button>
            <span className="routing-note">Validated through NASSCOM</span>
          </div>
        </div>
      </div>
      <MediaLightbox item={lightbox} onClose={() => setLightbox(null)} />
    </Section>
  );
}

/* ─── AI STARTUP IDEA CHECKER ─── */
function IdeaChecker() {
  const [form, setForm] = useState({ founder_name: "", email: "", startup_name: "", sector: "", idea: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  const submit = async () => {
    setError("");
    setResult(null);
    if (Object.values(form).some(value => !value.trim())) return setError("Please complete every field.");
    if (!/\S+@\S+\.\S+/.test(form.email)) return setError("Enter a valid email address.");
    if (form.idea.trim().length < 80) return setError("Please describe your idea in at least 80 characters.");
    if (form.idea.length > 6000) return setError("Please keep your idea under 6,000 characters.");
    setLoading(true);
    try {
      const response = await axios.post(`${API}/idea-checks`, form);
      setResult(response.data.evaluation);
    } catch (err) {
      setError(err.response?.data?.error || "We could not evaluate the idea right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="idea-checker" variant="idea-checker-band">
      <div className="sec-head">
        <Eyebrow>AI Startup Idea Check</Eyebrow>
        <h2>Get a practical <span className="gradient-text">first read.</span></h2>
        <p className="lede">Share your infrastructure or construction-tech idea and receive a structured readiness review in moments.</p>
      </div>
      <div className="idea-checker-grid">
        <div className="contact-form-box">
          <div className="form-row">
            <div className="form-group"><label className="form-label">Founder name</label><input className="form-input" value={form.founder_name} onChange={update("founder_name")} placeholder="Your name" /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={update("email")} placeholder="you@startup.com" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Startup name</label><input className="form-input" value={form.startup_name} onChange={update("startup_name")} placeholder="Startup name" /></div>
            <div className="form-group"><label className="form-label">Focus area</label><select className="form-input" value={form.sector} onChange={update("sector")}><option value="">Select a focus area...</option>{FOCUS_AREAS.map(area => <option key={area.id} value={area.title}>{area.title}</option>)}</select></div>
          </div>
          <div className="form-group"><label className="form-label">Your startup idea</label><textarea className="form-textarea" value={form.idea} onChange={update("idea")} maxLength={6000} placeholder="What problem are you solving, who is it for, how does it work, and what makes it different?" /><span className="idea-count">{form.idea.length}/6000 characters · minimum 80</span></div>
          {error && <div className="form-error">{error}</div>}
          <button className="form-submit" onClick={submit} disabled={loading || form.idea.length > 6000} data-testid="idea-check-submit">{loading ? "Analysing your idea…" : "Check my startup idea"} <span>→</span></button>
          <p className="form-sla">AI feedback is an initial screening aid, not a funding decision. Your submission is securely saved for the Rodic team.</p>
        </div>
        <div className="idea-result" aria-live="polite">
          {result ? <>
            <div className="score-row"><div><span className="form-label">Readiness score</span><strong>{result.overall_score}<small>/100</small></strong></div><span className="verdict">{result.verdict}</span></div>
            <p className="result-summary">{result.summary}</p>
            <ResultList title="What stands out" items={result.strengths} />
            <ResultList title="Questions to resolve" items={result.risks} />
            <ResultList title="Suggested next steps" items={result.next_steps} />
          </> : <div className="result-empty"><span>✦</span><h3>Your evaluation will appear here.</h3><p>We assess problem clarity, solution fit, implementation feasibility, and pilot readiness for the infrastructure ecosystem.</p></div>}
        </div>
      </div>
    </Section>
  );
}

function ResultList({ title, items }) {
  return <div className="result-list"><h4>{title}</h4><ul>{items.map((item, index) => <li key={index}>{item}</li>)}</ul></div>;
}

/* ─── OUR LEADERS ─── */
function Leaders() {
  return (
    <Section id="leaders">
      <div className="leaders-layout">
        <div className="leaders-intro">
          <h2 style={{ fontStyle: "italic" }}>Rodic Innovations<br />LEADERSHIP</h2>
          <p>
            Meet the dedicated leaders driving Rodic Innovations
            forward with unparalleled experience and a commitment to infrastructure innovation.
          </p>
          <span className="explore-btn">
            <span className="explore-circle">→</span>
            EXPLORE
          </span>
        </div>
        <div className="leaders-cards">
          {leaders.map((l, i) => (
            <div className="leader-card" key={i} data-testid={`leader-card-${i}`}>
              <div className="leader-photo">
                {l.image ? (
                  <img src={l.image} alt={l.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center bottom" }} />
                ) : (
                  <div className="avatar-placeholder">{l.initials}</div>
                )}
              </div>
              <div className="leader-info">
                <span className="name">{l.name}</span>
                <span className="designation">{l.designation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── CONTACT FORM ─── */
function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [area, setArea] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email address."); return; }
    if (!organization.trim()) { setError("Please enter your organization."); return; }
    if (!message.trim()) { setError("Please enter a message."); return; }

    try {
      await axios.post(`${API}/registrations`, {
        email: email.trim(),
        role: "Enquiry",
        sectors: [area.trim()],
        name: name.trim(),
        phone: phone.trim(),
        organization: organization.trim(),
        message: message.trim(),
      });
      setDone(true);
    } catch (e) {
      console.error("contact form failed", e);
      setError("Failed to send message. Please try again later.");
    }
  };

  return (
    <Section id="contact">
      <div className="contact-grid">
        <div className="contact-info">
          <Eyebrow>Get in Touch with the Rodic Innovations Team</Eyebrow>
          <h2>Let's build <span className="gradient-text">together.</span></h2>
          <p className="lede">
            Have a question about the Rodic Innovations program, or want to explore a partnership?
            We'd love to hear from you.
          </p>
          <div className="contact-detail">
            <div className="contact-item">
              <div className="contact-icon">✉</div>
              <div>
                <span className="label">Email</span>
                <span className="value">partnerships@rodic.in</span>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">◉</div>
              <div>
                <span className="label">Office</span>
                <span className="value">New Delhi, India</span>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">↗</div>
              <div>
                <span className="label">Social</span>
                <span className="value">LinkedIn · X / Twitter</span>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-box" id="contactForm">
          {done ? (
            <div className="form-success" data-testid="contact-success">
              <div className="check-circle">✓</div>
              <h3>Message Received</h3>
              <p>Thank you for reaching out to Rodic Innovations. Our team will get back to you shortly.</p>
            </div>
          ) : (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    className={`form-input${error && !name ? " err" : ""}`}
                    data-testid="contact-name-input"
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    className={`form-input${error && !email ? " err" : ""}`}
                    data-testid="contact-email-input"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number <span className="opt">(optional)</span></label>
                  <input
                    className="form-input"
                    data-testid="contact-phone-input"
                    type="tel"
                    placeholder="+91..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Organization</label>
                  <input
                    className={`form-input${error && !organization ? " err" : ""}`}
                    data-testid="contact-org-input"
                    type="text"
                    placeholder="Institution / Company"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Area of Interest</label>
                <select
                  className="form-input"
                  data-testid="contact-area-input"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  style={{ backgroundColor: "var(--navy)", color: "var(--text)" }}
                >
                  <option value="">Select an area...</option>
                  <option value="Research Partnerships">Research Partnerships</option>
                  <option value="Startup Collaboration">Startup Collaboration</option>
                  <option value="General Enquiry">General Enquiry</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className={`form-textarea${error && !message ? " err" : ""}`}
                  data-testid="contact-message-input"
                  placeholder="Tell us about your project or inquiry..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              {error && <div className="form-error" data-testid="contact-error">{error}</div>}
              <button className="form-submit" data-testid="contact-submit-btn" onClick={handleSubmit}>
                Request a Collaboration Brief <span style={{ fontFamily: "var(--mono)" }}>→</span>
              </button>
              <p className="form-sla" style={{ fontSize: "12px", color: "var(--text-2)", marginTop: "16px", textAlign: "center" }}>
                Our partnership team (Shreya Sharma) reviews all briefs within 24 hours. Your data is secure and never shared.
              </p>
            </>
          )}
        </div>
      </div>
    </Section>
  );
}

/* ─── FOOTER ─── */
function Footer({ onNav }) {
  return (
    <footer className="footer" data-testid="footer">
      <div className="footer-inner">
        <div>
          <div className="fbrand">Rodic Innovations</div>
          <p className="ftag">Rodic Innovations. Infrastructure innovation through industry-academia collaboration.</p>
        </div>
        <div>
          <h5>Navigate</h5>
          {[["home", "Home"], ["focus", "Focus Areas"], ["ecosystem", "Rodic Innovations in Action"], ["leaders", "Leaders"], ["contact", "Contact"]].map(([id, label]) => (
            <span className="footer-link" key={id} data-testid={`footer-link-${id}`} onClick={() => onNav(id)}>{label}</span>
          ))}
        </div>
        <div>
          <h5>Connect</h5>
          <p className="ftag" style={{ marginBottom: "14px" }}>partnerships@rodic.in</p>
          <div>
            <span className="social">LinkedIn</span>
            <span className="social">X / Twitter</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span>© 2026 Rodic Innovations</span>
          <span style={{ color: "var(--text-2)", fontSize: "10px" }}>A Division of Rodic Consultants Private Limited. ISO 9001:2015 Certified. Govt Empanelled.</span>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── SCROLL-TO-TOP BUTTON ─── */
function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      className={`scroll-top${visible ? " visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}

/* ─── SCROLL PROGRESS BAR ─── */
function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setWidth(pct);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <div className="scroll-progress" style={{ width: `${width}%` }} />;
}

/* ─── APP ─── */
function App() {
  const onNav = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="reep-root">
      <Nav onNav={onNav} />
      <ScrollProgress />
      <Hero onNav={onNav} />
      <AboutReep />
      <FocusAreas />
      <ReepInAction />
      <StartupProgram onNav={onNav} />
      <IdeaChecker />
      <Leaders />
      <Contact />
      <Footer onNav={onNav} />
      <ScrollToTop />
    </div>
  );
}

export default App;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAlumni } from '../features/alumni/hooks/useAlumni';
import { useSchools } from '../features/schools/hooks/useSchools';
import { useRandomEntries } from '../features/random/hooks/useRandomEntries';
import Reveal from '../components/Reveal';

export default function UserHome() {
  const { alumni } = useAlumni();
  const { schools } = useSchools();
  const { entries } = useRandomEntries();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const FULL_BLEED = 'w-screen mx-[calc(50%-50vw)]';

  return (
    <div className="-mt-8 overflow-x-hidden">
      {/* Hero */}
      <section className={`bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 px-4 py-14 sm:px-6 sm:py-20 relative overflow-hidden ${FULL_BLEED}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center relative z-10">
          <Reveal>
            <span className="inline-block text-xs font-semibold tracking-wide text-accent-300 bg-accent-500/10 border border-accent-500/20 rounded-full px-3 py-1 mb-5">
              ALL-IN-ONE SYSTEM
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.15] md:leading-[1.1]">
              Legality<br />
              <span className="text-accent-400">TDS Tengah.</span>
            </h1>
            <p className="text-navy-300 mt-5 max-w-md">
              A single home for recording, managing, and coordinating alumni outreach
              programs and school legality records.
            </p>
            <div className="flex items-center gap-3 mt-8">
              <Link
                to="/legality/alumni"
                className="bg-accent-500 text-white rounded-lg px-6 py-3 text-sm font-medium hover:bg-accent-400 transition-colors"
              >
                Explore Now →
              </Link>
              <button
                onClick={() => setShowHowItWorks((s) => !s)}
                className="bg-white/5 text-white border border-white/15 rounded-lg px-6 py-3 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Learn More
              </button>
            </div>
            <p className="text-navy-500 text-xs mt-10 flex items-center gap-2">
              <span className="w-4 h-6 rounded-full border border-navy-600 flex items-start justify-center pt-1">
                <span className="w-1 h-1.5 rounded-full bg-navy-400" />
              </span>
              Scroll to explore
            </p>
          </Reveal>

          <Reveal delay={150} className="relative flex items-center justify-center">
            <DigitalSchoolFrame />
          </Reveal>
        </div>
      </section>

      {showHowItWorks && (
        <section className={`bg-navy-800 px-4 py-8 sm:px-6 sm:py-10 ${FULL_BLEED}`}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
            <HowItWorksStep n="1" title="Add a school or alumni entry" text="Anyone can register a school's legality record or an alumni outreach program — no account needed." />
            <HowItWorksStep n="2" title="Track progress" text="Update contact details, assign teachers, log MOM notes, and move outreach status forward stage by stage." />
            <HowItWorksStep n="3" title="Admin reviews legality" text="An admin reviews school legality status separately, using the same shared records." />
          </div>
        </section>
      )}

      {/* Choose a Section */}
      <section className={`px-4 py-14 sm:px-6 sm:py-20 bg-slate-50 ${FULL_BLEED}`}>
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-12">
            <span className="text-xs font-semibold tracking-wide text-accent-500 uppercase">Explore key areas</span>
            <h2 className="font-display text-3xl font-bold text-navy-900 mt-2">Choose a Section</h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Reveal delay={0}>
              <SectionCard
                icon={<SchoolIcon />}
                iconBg="bg-blue-50 text-blue-600"
                title="Legality Sekolah"
                text="Review and manage each school's legality record with ease."
                stat={`${schools.length} schools registered`}
                to="/legality/sekolah"
                linkLabel="View Schools"
                linkColor="text-blue-600"
              />
            </Reveal>
            <Reveal delay={100}>
              <SectionCard
                icon={<PeopleIcon />}
                iconBg="bg-emerald-50 text-emerald-600"
                title="Alumni"
                text="Track outreach programs and alumni involvement across schools."
                stat={`${alumni.length} programs recorded`}
                to="/legality/alumni"
                linkLabel="View Alumni"
                linkColor="text-emerald-600"
              />
            </Reveal>
            <Reveal delay={200}>
              <SectionCard
                icon={<ShuffleIcon />}
                iconBg="bg-purple-50 text-purple-600"
                title="Random"
                text="Explore additional records for new discoveries."
                stat={`${entries.length} entries logged`}
                to="/legality/random"
                linkLabel="Generate Random"
                linkColor="text-purple-600"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Kit Legality banner */}
      <Reveal>
        <section className={`bg-navy-900 px-4 py-10 sm:px-6 sm:py-16 relative overflow-hidden ${FULL_BLEED}`}>
          <div className="max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-center text-center md:text-left relative z-10">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-accent-500/30 flex items-center justify-center relative shrink-0">
              <div className="absolute inset-3 rounded-full border border-accent-500/20" />
              <BriefcaseIcon />
            </div>
            <div>
              <span className="text-xs font-semibold tracking-wide text-accent-300 uppercase">Kit Legality</span>
              <h2 className="font-display text-2xl font-bold text-white mt-1">Kit Legality</h2>
              <p className="text-navy-300 mt-2 max-w-md mx-auto md:mx-0">
                Get all the documents, guides, and resources needed for school legality programs.
              </p>
            </div>
            <Link
              to="/kit-legality"
              className="bg-accent-500 text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-accent-400 transition-colors whitespace-nowrap"
            >
              Explore Kit →
            </Link>
          </div>
        </section>
      </Reveal>

      {/* Template Form */}
      <section className={`px-4 py-10 sm:px-6 sm:py-16 bg-white ${FULL_BLEED}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6 md:gap-10 items-start">
          <Reveal>
            <span className="text-xs font-semibold tracking-wide text-accent-500 uppercase">Template Form</span>
            <h2 className="font-display text-2xl font-bold text-navy-900 mt-1">Template Form</h2>
            <p className="text-slate-500 mt-2 text-sm">
              Use ready-made form templates for school programs and meetings.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Reveal delay={0}>
              <TemplateCard
                icon={<DocIcon />}
                iconBg="bg-emerald-50 text-emerald-600"
                title="Program Sekolah"
                text="Forms and templates for school programs."
                linkColor="text-emerald-600"
              />
            </Reveal>
            <Reveal delay={100}>
              <TemplateCard
                icon={<DocIcon />}
                iconBg="bg-purple-50 text-purple-600"
                title="Meeting"
                text="Forms and templates for meetings and discussions."
                linkColor="text-purple-600"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* TDS Organisation Chart banner */}
      <Reveal>
        <section className={`bg-navy-900 px-4 py-10 sm:px-6 sm:py-16 relative overflow-hidden ${FULL_BLEED}`}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center relative z-10 text-center md:text-left">
            <div>
              <span className="text-xs font-semibold tracking-wide text-accent-300 uppercase">TDS Organisation Chart</span>
              <h2 className="font-display text-2xl font-bold text-white mt-1">TDS Organisation Chart</h2>
              <p className="text-navy-300 mt-2 max-w-md mx-auto md:mx-0">
                View the TDS organisation structure and each team member's role.
              </p>
              <Link
                to="/tds-chart"
                className="inline-block mt-5 bg-accent-500 text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-accent-400 transition-colors"
              >
                View Chart →
              </Link>
            </div>
            <OrgChartIllustration className="justify-self-center md:justify-self-end" />
          </div>
        </section>
      </Reveal>

      {/* Footer */}
      <footer className={`bg-navy-950 px-4 py-10 sm:px-6 sm:py-12 ${FULL_BLEED}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-accent-500 flex items-center justify-center font-display font-bold text-white text-sm">L</div>
              <span className="font-display font-semibold text-white text-sm">Legality TDS Tengah</span>
            </div>
            <p className="text-navy-400 text-xs max-w-xs">
              A legality, alumni, and outreach program management system for schools under TDS Tengah.
            </p>
          </div>
          <div>
            <h4 className="text-white text-sm font-medium mb-3">Links</h4>
            <ul className="space-y-2 text-xs text-navy-400">
              <li><Link to="/" className="hover:text-white transition-colors">Homepage</Link></li>
              <li><Link to="/legality/sekolah" className="hover:text-white transition-colors">Legality Sekolah</Link></li>
              <li><Link to="/legality/alumni" className="hover:text-white transition-colors">Alumni</Link></li>
              <li><Link to="/kit-legality" className="hover:text-white transition-colors">Kit Legality</Link></li>
              <li><Link to="/template-form" className="hover:text-white transition-colors">Template Form</Link></li>
              <li><Link to="/tds-chart" className="hover:text-white transition-colors">TDS Organisation Chart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-medium mb-3">Support</h4>
            <p className="text-navy-400 text-xs">
              For access or account issues, contact your system administrator.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex items-center justify-between mt-10 pt-6 border-t border-navy-800 text-navy-500 text-xs">
          <span>© 2026 Legality TDS Tengah. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

function HowItWorksStep({ n, title, text }) {
  return (
    <div className="bg-navy-900/50 rounded-2xl border border-navy-700 p-5">
      <div className="w-8 h-8 rounded-full bg-accent-500 text-white flex items-center justify-center font-display font-semibold text-sm mb-3">
        {n}
      </div>
      <h4 className="font-display font-semibold text-white text-sm mb-1">{title}</h4>
      <p className="text-sm text-navy-300">{text}</p>
    </div>
  );
}

function SectionCard({ icon, iconBg, title, text, stat, to, linkLabel, linkColor }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-7 text-center hover:shadow-lg hover:-translate-y-1 transition-all h-full flex flex-col items-center">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${iconBg}`}>{icon}</div>
      <h3 className="font-display font-semibold text-navy-900 text-lg">{title}</h3>
      <p className="text-sm text-slate-500 mt-2 flex-1">{text}</p>
      <p className="text-xs text-slate-400 mt-3">{stat}</p>
      <Link to={to} className={`inline-flex items-center gap-1 mt-4 text-sm font-medium ${linkColor}`}>
        {linkLabel} →
      </Link>
    </div>
  );
}

function TemplateCard({ icon, iconBg, title, text, linkColor }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-all">
      <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-4 ${iconBg}`}>{icon}</div>
      <h3 className="font-display font-semibold text-navy-900">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{text}</p>
      <Link to="/template-form" className={`inline-flex items-center gap-1 mt-3 text-sm font-medium ${linkColor}`}>
        Use Template →
      </Link>
    </div>
  );
}

/** A deliberately digital/flat illustration, not a photo — we don't have a real photo of the school. */
function DigitalSchoolFrame() {
  return (
    <div className="relative w-full max-w-md aspect-square">
      <div className="absolute inset-0 rounded-full border border-accent-500/30 animate-[spin_40s_linear_infinite]">
        <span className="absolute -top-1.5 left-1/2 w-3 h-3 rounded-full bg-accent-400 shadow-[0_0_12px_2px_rgba(59,130,246,0.8)]" />
      </div>
      <div className="absolute inset-6 rounded-full border border-accent-500/20" />
      <div className="absolute inset-10 rounded-full bg-navy-800/60 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 200 200" className="w-3/4 h-3/4" fill="none">
          <rect x="45" y="85" width="110" height="80" rx="3" fill="#1c3a78" stroke="#3b82f6" strokeWidth="1.5" />
          <rect x="88" y="55" width="24" height="35" fill="#1c3a78" stroke="#3b82f6" strokeWidth="1.5" />
          <path d="M83 55 L100 38 L117 55 Z" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinejoin="round" />
          <line x1="100" y1="38" x2="100" y2="24" stroke="#93c5fd" strokeWidth="1.5" />
          <circle cx="100" cy="22" r="2.5" fill="#93c5fd" />
          {[62, 84, 106, 128].map((x) => (
            <rect key={x} x={x} y="105" width="12" height="12" fill="none" stroke="#60a5fa" strokeWidth="1.2" />
          ))}
          <rect x="93" y="130" width="14" height="35" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
          <line x1="30" y1="165" x2="170" y2="165" stroke="#3b82f6" strokeWidth="1.5" />
        </svg>
      </div>
      <span className="absolute top-2 right-8 w-2.5 h-2.5 rounded-full bg-accent-400 shadow-[0_0_10px_2px_rgba(59,130,246,0.7)]" />
      <span className="absolute bottom-6 left-2 w-2 h-2 rounded-full bg-accent-300 shadow-[0_0_8px_2px_rgba(59,130,246,0.6)]" />
    </div>
  );
}

function OrgChartIllustration({ className = '' }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="w-11 h-11 rounded-xl bg-accent-500 flex items-center justify-center">
        <PersonIcon />
      </div>
      <div className="w-px h-4 bg-navy-700" />
      <div className="flex items-center gap-8 relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2.75rem)] h-px bg-navy-700" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-10 h-10 rounded-xl bg-navy-700 flex items-center justify-center">
            <PersonIcon small />
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonIcon({ small }) {
  const s = small ? 16 : 20;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}
function SchoolIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 21V9l8-5 8 5v12" /><path d="M9 21v-6h6v6" />
    </svg>
  );
}
function PeopleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <circle cx="17.5" cy="9" r="2.5" /><path d="M15 20a5 5 0 0 1 8 0" strokeOpacity="0.6" />
    </svg>
  );
}
function ShuffleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 6h3.5l8 12H21M3 18h3.5l3-4.5M16 6h5v5M21 6l-6.5 9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BriefcaseIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
function DocIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 2h9l5 5v15H6z" /><path d="M15 2v5h5" /><path d="M9 13h6M9 17h6" strokeLinecap="round" />
    </svg>
  );
}

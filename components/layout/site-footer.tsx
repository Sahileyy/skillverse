export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-5 py-16 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <span className="text-xl font-bold tracking-tight text-white">SkillVerse</span>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-400">
              The peer-to-peer mentorship & skill-sharing ecosystem. Connect directly with peers for 1:1 mentorship, collaborative projects, and AI-guided career roadmaps.
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs text-slate-500">
              <span>© {new Date().getFullYear()} SkillVerse. All rights reserved.</span>
            </div>
          </div>

          {/* Column 1: Mentorship */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Mentorship</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li><a href="#mentors" className="hover:text-white transition-colors">Find a Mentor</a></li>
              <li><a href="#sessions" className="hover:text-white transition-colors">1:1 Mentorship Calls</a></li>
              <li><a href="#sessions" className="hover:text-white transition-colors">Code & PR Reviews</a></li>
              <li><a href="#sessions" className="hover:text-white transition-colors">Portfolio Audits</a></li>
            </ul>
          </div>

          {/* Column 2: Community */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Community</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li><a href="#community" className="hover:text-white transition-colors">Open Projects</a></li>
              <li><a href="#community" className="hover:text-white transition-colors">Team Collaboration</a></li>
              <li><a href="#community" className="hover:text-white transition-colors">Peer Study Groups</a></li>
              <li><a href="#mentors" className="hover:text-white transition-colors">Become a Mentor</a></li>
            </ul>
          </div>

          {/* Column 3: AI Intelligence */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">AI Tools</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li><a href="#ai-tools" className="hover:text-white transition-colors">Skill Assessment Quiz</a></li>
              <li><a href="#ai-tools" className="hover:text-white transition-colors">AI Verified Badges</a></li>
              <li><a href="#ai-tools" className="hover:text-white transition-colors">Career Roadmaps</a></li>
              <li><a href="#ai-tools" className="hover:text-white transition-colors">Skill Gap Analysis</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
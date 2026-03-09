import { NavLink, Outlet } from "react-router";
import { Link2, History, Zap } from "lucide-react";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0d1b2a 100%)" }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-md" style={{ background: "rgba(15, 12, 41, 0.85)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-white" style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                snip<span style={{ color: "#a78bfa" }}>.ly</span>
              </span>
            </NavLink>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                    isActive
                      ? "text-white"
                      : "text-white/60 hover:text-white/90 hover:bg-white/5"
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? { background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.25))", border: "1px solid rgba(167,139,250,0.3)" }
                    : {}
                }
              >
                <Link2 className="w-4 h-4" />
                <span>Shorten</span>
              </NavLink>

              <NavLink
                to="/history"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                    isActive
                      ? "text-white"
                      : "text-white/60 hover:text-white/90 hover:bg-white/5"
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? { background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.25))", border: "1px solid rgba(167,139,250,0.3)" }
                    : {}
                }
              >
                <History className="w-4 h-4" />
                <span>History</span>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-white/30 text-xs">© 2026 snip.ly — Fast & simple URL shortener</p>
        </div>
      </footer>
    </div>
  );
}

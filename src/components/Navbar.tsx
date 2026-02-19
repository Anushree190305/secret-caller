import { useState, useEffect } from "react";
import { Bell, Search, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-4 transition-all duration-500"
      style={{
        background: scrolled
          ? "hsl(0 0% 5% / 0.97)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-8">
        <a href="/" className="flex-shrink-0">
          <svg
            viewBox="0 0 111 30"
            className="h-6 md:h-8 fill-[hsl(var(--primary))]"
            aria-label="Netflix"
          >
            <path d="M105.06233 14.2806261L110.999156 30c-1.6887-.4718-3.3774-.9316-5.12006-1.4124l-3.8058-10.768-3.8331 9.7145c-1.5604-.3933-3.1209-.7866-4.7362-1.1799l5.9882-14.4371-5.4935-14.2806261h5.1321l3.5131 9.970111 3.5131-9.970111zm-20.9silon 0h5.2322l-8.9692 22.7193c-1.6887-.2469-3.3774-.4827-5.0661-.7285zm-24.5085 0h4.8584l-7.5563 19.3648v10.6352h-4.8084V19.655z" />
            <path d="M0 0h4.808v30H0zM100.836 0h4.808v30h-4.808z" />
          </svg>
        </a>

        {/* Nav links (desktop) */}
        <div className="hidden md:flex items-center gap-4 text-sm text-white/80">
          {["Home", "TV Shows", "Movies", "New & Popular", "My List"].map((item) => (
            <a
              key={item}
              href="#"
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Mobile browse */}
        <div className="flex md:hidden items-center gap-1 text-white text-sm">
          Browse <ChevronDown size={14} />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="text-white/80 hover:text-white transition-colors">
          <Search size={20} />
        </button>
        <button className="text-white/80 hover:text-white transition-colors">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-1 cursor-pointer group">
          <div className="w-8 h-8 rounded bg-netflix-red flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            U
          </div>
          <ChevronDown
            size={14}
            className="text-white/80 group-hover:text-white transition-transform group-hover:rotate-180 duration-200"
          />
        </div>
      </div>
    </nav>
  );
}

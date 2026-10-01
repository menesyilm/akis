"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#surec", label: "Nasıl çalışır?" },
  { href: "#talep", label: "Birlikte konuşalım", cta: true },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h11M10 4l6 6-6 6" />
    </svg>
  );
}

export default function SiteNav() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sidebarRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !sidebarRef.current) return;
      const focusable = sidebarRef.current.querySelectorAll<HTMLElement>("a[href], button:not(:disabled)");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
    toggleRef.current?.focus();
  }

  return (
    <>
      <nav className="desktop-nav" aria-label="Ana menü">
        {links.map((link) => (
          <a className={link.cta ? "nav-cta" : undefined} href={link.href} key={link.href}>
            {link.label}
            {link.cta && <ArrowIcon />}
          </a>
        ))}
      </nav>

      <button
        aria-controls="mobile-sidebar"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
        className="menu-toggle"
        onClick={() => setIsOpen((open) => !open)}
        ref={toggleRef}
        type="button"
      >
        <span />
        <span />
      </button>

      {isOpen && (
        <div className="mobile-nav-layer">
          <button
            aria-label="Menüyü kapat"
            className="nav-backdrop"
            onClick={closeMenu}
            tabIndex={-1}
            type="button"
          />
          <aside aria-label="Mobil gezinme" className="mobile-sidebar" id="mobile-sidebar" ref={sidebarRef}>
            <div className="sidebar-heading">
              <span>MENÜ</span>
              <button aria-label="Menüyü kapat" className="sidebar-close" onClick={closeMenu} type="button">
                ×
              </button>
            </div>
            <nav aria-label="Mobil menü" className="sidebar-links">
              {links.map((link, index) => (
                <a
                  className={link.cta ? "sidebar-cta" : undefined}
                  href={link.href}
                  key={link.href}
                  onClick={closeMenu}
                >
                  <span className="sidebar-link-number">0{index + 1}</span>
                  {link.label}
                  {link.cta && <ArrowIcon />}
                </a>
              ))}
            </nav>
            <p className="sidebar-note">Tekrarlayan işleri otomatikleştirin, işinize zaman ayırın.</p>
          </aside>
        </div>
      )}
    </>
  );
}

"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "/episodes", label: "Listen" },
  { href: "/topics/leadership", label: "Ideas" },
  { href: "/#find", label: "Find an answer" },
  { href: "/better-careers", label: "Better Careers" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Logo />
        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav
          className={`primary-nav${open ? " primary-nav--open" : ""}`}
          id="primary-navigation"
          aria-label="Primary navigation"
        >
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <Link className="button button--small button--ink" href="/#newsletter">
            Join Better Bits
          </Link>
        </nav>
      </div>
    </header>
  );
}

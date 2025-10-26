"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

const navItems = [
  { label: "Product", href: "#features" },
  { label: "Solutions", href: "#problems" },
  { label: "Pricing", href: "#pricing" },
  // { label: "Docs", href: "#" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? "bg-gray-900/95 backdrop-blur-sm border-b border-gray-800" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-4">
                  <Image src="/veritasai.png" alt="VeritasAI" width={172} height={172} className="object-contain rounded-sm" />
                </div>

              <div className="flex-1 flex items-center justify-end">
                <div className="hidden md:flex items-center gap-8">
                  {navItems.map((it) => (
                    <a key={it.label} href={it.href} className="text-gray-300 hover:text-white font-medium transition-colors">
                      {it.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
        </div>
      </nav>

      <div className="h-16" />

      {/* mobile menu */}
      <div className={`md:hidden fixed top-16 right-0 w-64 bg-gray-900/95 backdrop-blur-sm border-l border-gray-800 z-50 shadow-lg transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6">
          <div className="flex flex-col space-y-4">
            {navItems.map((it) => (
              <a key={it.label} href={it.href} className="text-gray-300 hover:text-white font-medium transition-colors">
                {it.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, type Variants } from 'framer-motion'
import { Sparkles, ArrowRight, Zap, Code2, Layers, MousePointer2, Box, ChevronDown } from 'lucide-react'
import Link from 'next/link'

// ── Fade-up animation variant reused throughout ──────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay },
  }),
}

// ── Engine data ───────────────────────────────────────────────────────
const ENGINES = [
  { name: 'GSAP',          count: 10, color: '#88ce02', bg: 'rgba(136,206,2,0.08)',   border: 'rgba(136,206,2,0.2)',   desc: 'ScrollTrigger, timelines, physics' },
  { name: 'Framer Motion', count: 3,  color: '#ec4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)', desc: 'AnimatePresence, layout, spring' },
  { name: 'Three.js',      count: 1,  color: '#06b6d4', bg: 'rgba(6,182,212,0.08)',  border: 'rgba(6,182,212,0.2)',  desc: 'WebGL, BufferGeometry, particles' },
  { name: 'CSS',           count: 1,  color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', desc: 'Pure @keyframes, zero JS' },
  { name: 'Tailwind',      count: 1,  color: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)', desc: 'Utility-class stagger patterns' },
]

// ── Feature cards ─────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Layers,
    title: '16 Production Animations',
    desc: 'Every animation is built for real-world use — not toy demos. Scroll effects, cursors, transitions, 3D and more.',
    color: '#6366f1',
  },
  {
    icon: Code2,
    title: 'Copy. Paste. Done.',
    desc: 'Click any animation, grab the code snippet, drop it into your project. Full TypeScript types included.',
    color: '#22c55e',
  },
  {
    icon: Zap,
    title: '5 Animation Engines',
    desc: 'GSAP for scroll, Framer for transitions, Three.js for 3D, CSS for zero-JS, Tailwind for utility-first.',
    color: '#f59e0b',
  },
  {
    icon: MousePointer2,
    title: 'Live Interactive Previews',
    desc: 'Every animation has a live demo with a real-world use case tab, plus a controls panel to tweak props.',
    color: '#ec4899',
  },
  {
    icon: Box,
    title: 'npx animx add',
    desc: 'CLI coming soon. Install any animation directly into your project. You own the code — no runtime dependency.',
    color: '#06b6d4',
  },
]

// ── Animated grid background ──────────────────────────────────────────
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Gradient overlay to fade edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#060610]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#060610] via-transparent to-[#060610]" />
    </div>
  )
}

// ── Floating orb ──────────────────────────────────────────────────────
function Orb({ x, y, size, color, delay }: { x: string; y: string; size: number; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color }}
      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <div className="bg-[#060610] text-white min-h-screen overflow-x-hidden">

      {/* ── Navbar ── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#060610]/80"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22d3ee] via-[#818cf8] to-[#a855f7] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-xl tracking-tight">AnimX</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Engines', 'Docs'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            onClick={onEnter}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Open Dashboard
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </motion.nav>

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">

        <GridBackground />

        {/* Orbs */}
        <Orb x="10%" y="20%" size={500} color="rgba(99,102,241,0.15)" delay={0} />
        <Orb x="65%" y="10%" size={400} color="rgba(6,182,212,0.12)" delay={2} />
        <Orb x="40%" y="60%" size={600} color="rgba(168,85,247,0.1)" delay={4} />

        <motion.div
          className="relative z-10 text-center max-w-5xl mx-auto px-6"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-gray-400 mb-8 backdrop-blur-sm"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            16 animations · 5 engines · Open source
          </motion.div>

          {/* Main headline */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {['The Animation', 'Library for', ' Developers'].map((line, i) => (
              <motion.h1
                key={i}
                className="block text-[clamp(52px,8vw,96px)] font-black leading-[0.95] tracking-tighter"
                variants={fadeUp}
                custom={i * 0.1}
              >
                {i === 2 ? (
                  <span
                    style={{
                      background: 'linear-gradient(90deg, #22d3ee, #818cf8, #a855f7)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {line}
                  </span>
                ) : line}
              </motion.h1>
            ))}
          </motion.div>

          {/* Sub */}
          <motion.p
            className="mt-8 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
          >
            A curated collection of production-ready animations built with GSAP, Framer Motion, Three.js, CSS, and Tailwind.
            Copy the code. Drop it in. Ship it.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.5}
          >
            <motion.button
              onClick={onEnter}
              className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-white overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles className="w-5 h-5" />
              Browse Animations
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.a
              href="#features"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-gray-300 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              See what's inside
            </motion.a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.65}
          >
            {[
              { value: '16', label: 'Animations' },
              { value: '5',  label: 'Engines' },
              { value: '4+', label: 'Demos each' },
              { value: '0',  label: 'Runtime deps' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div
                  className="text-4xl font-black"
                  style={{
                    background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {value}
                </div>
                <div className="text-xs text-gray-500 mt-1 font-medium tracking-widest uppercase">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-[10px] font-semibold tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          WHAT IS ANIMX
      ══════════════════════════════════════════ */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p
              className="text-xs font-bold tracking-[0.3em] text-indigo-400 uppercase mb-4"
              variants={fadeUp}
            >
              What is AnimX
            </motion.p>
            <motion.h2
              className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-8"
              variants={fadeUp}
            >
              Stop building animations
              <br />
              <span style={{ background: 'linear-gradient(90deg, #f59e0b, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                from scratch
              </span>
            </motion.h2>
            <motion.p
              className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto"
              variants={fadeUp}
            >
              AnimX is a dashboard of ready-to-use animations. Every component is interactive,
              has real-world demos, and comes with copy-paste code. Built for developers who
              want polished motion without spending days on it.
            </motion.p>
          </motion.div>

          {/* Horizontal rule */}
          <motion.div
            className="mt-16 h-px max-w-xs mx-auto"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════ */}
      <section id="features" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">

          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-3" variants={fadeUp}>
              Features
            </motion.p>
            <motion.h2 className="text-4xl md:text-5xl font-black tracking-tight" variants={fadeUp}>
              Everything you need
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                className="group relative rounded-2xl border border-white/8 bg-white/[0.03] p-7 hover:bg-white/[0.06] transition-all overflow-hidden"
                variants={fadeUp}
                custom={i * 0.05}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${color}18, transparent 70%)` }}
                />
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ENGINES
      ══════════════════════════════════════════ */}
      <section id="engines" className="relative py-24 px-6 overflow-hidden">
        {/* background stripe */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p className="text-xs font-bold tracking-[0.3em] text-purple-400 uppercase mb-3" variants={fadeUp}>
              Engines
            </motion.p>
            <motion.h2 className="text-4xl md:text-5xl font-black tracking-tight" variants={fadeUp}>
              5 engines. 16 animations.
              <br />
              <span style={{ background: 'linear-gradient(90deg, #22d3ee, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                One Solution.
              </span>
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {ENGINES.map(({ name, count, color, bg, border, desc }) => (
              <motion.div
                key={name}
                className="group relative rounded-2xl p-6 overflow-hidden cursor-default"
                style={{ background: bg, border: `1px solid ${border}` }}
                variants={fadeUp}
                whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
              >
                {/* Corner count badge */}
                <div
                  className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                  style={{ background: `${color}25`, color }}
                >
                  {count}
                </div>

                {/* Color dot */}
                <motion.div
                  className="w-10 h-10 rounded-full mb-5"
                  style={{ background: `radial-gradient(circle, ${color}, ${color}80)` }}
                  animate={{ boxShadow: [`0 0 0px ${color}`, `0 0 20px ${color}60`, `0 0 0px ${color}`] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />

                <h3 className="font-black text-sm text-white mb-1.5">{name}</h3>
                <p className="text-[11px] leading-relaxed" style={{ color: `${color}99` }}>{desc}</p>
                <p className="mt-3 text-[11px] font-bold" style={{ color }}>
                  {count} animation{count !== 1 ? 's' : ''}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p className="text-xs font-bold tracking-[0.3em] text-green-400 uppercase mb-3" variants={fadeUp}>
              How it works
            </motion.p>
            <motion.h2 className="text-4xl md:text-5xl font-black tracking-tight" variants={fadeUp}>
              Three steps to ship
            </motion.h2>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-[39px] top-10 bottom-10 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-pink-500/50 hidden md:block" />

            <div className="space-y-8">
              {[
                {
                  step: '01',
                  color: '#6366f1',
                  title: 'Browse the dashboard',
                  desc: 'Explore 16 animations filtered by category or engine. Every card has a live frozen preview so you can see exactly what it looks like.',
                },
                {
                  step: '02',
                  color: '#a855f7',
                  title: 'Open and interact',
                  desc: 'Click any animation to open the detail page. Switch between demo tabs, tweak live controls, and see real-world use cases.',
                },
                {
                  step: '03',
                  color: '#ec4899',
                  title: 'Copy the code',
                  desc: 'Hit the code button, copy the snippet, paste it into your project. Full TypeScript — no extra setup required.',
                },
              ].map(({ step, color, title, desc }, i) => (
                <motion.div
                  key={step}
                  className="flex gap-6 items-start"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {/* Step circle */}
                  <div
                    className="flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl"
                    style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}
                  >
                    {step}
                  </div>
                  <div className="pt-3">
                    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════ */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Big glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(99,102,241,0.15), transparent)' }}
        />

        <motion.div
          className="relative z-10 max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {/* Animated logo */}
          <motion.div
            className="inline-flex mb-8"
            variants={fadeUp}
          >
            <motion.div
              className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #22d3ee, #818cf8, #a855f7)' }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6"
            variants={fadeUp}
          >
            Ready to{' '}
            <span style={{ background: 'linear-gradient(90deg, #22d3ee, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              animate?
            </span>
          </motion.h2>

          <motion.p className="text-lg text-gray-400 mb-10 leading-relaxed" variants={fadeUp}>
            16 animations. Zero boilerplate. Open the dashboard and start building.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4" variants={fadeUp}>
            <motion.button
              onClick={onEnter}
              className="group relative flex items-center gap-3 px-10 py-5 rounded-2xl text-lg font-bold text-white overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles className="w-5 h-5" />
              Open Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Bottom border line */}
        <motion.div
          className="mt-24 h-px max-w-5xl mx-auto"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        />

        {/* Footer strip */}
        <div className="mt-8 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#22d3ee] to-[#a855f7] flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-black text-gray-400">AnimX</span>
          </Link>
          <p className="text-xs text-gray-600 font-mono">
            Built with Next.js · GSAP · Framer Motion · Three.js · Tailwind
          </p>
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} AnimX. All rights reserved.
          </p>
        </div>
      </section>

    </div>
  )
}

import { motion } from "framer-motion";
import { Lock, Zap, Clock, ShieldCheck, Share2, Youtube, Fingerprint, Layers } from "lucide-react";
import heroImage from "@/assets/images/hero-abstract.png";

const steps = [
  {
    icon: <Lock className="w-6 h-6 text-blue-400" />,
    title: "Seal & Share",
    desc: "You share a sealed envelope containing youtube:VIDEO_ID with a friend.",
    code: "ActionCommit(A, send, VIDEO_ID, t1)"
  },
  {
    icon: <Clock className="w-6 h-6 text-purple-400" />,
    title: "Independent Action",
    desc: "Thirty minutes later, before opening the envelope, they independently post the same video.",
    code: "ActionCommit(B, post, VIDEO_ID, t2)"
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    title: "Matcher Detects Sync",
    desc: "System detects matching canonical objects within the valid time window.",
    code: "t2 - t1 = 30m \\n t2 < openedAt(envelope)"
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-green-400" />,
    title: "Event & Reveal",
    desc: "A Synchronicity Event is created. Both parties approve the reveal.",
    code: "SynchronicityEvent(syncId, strong, 1800s)"
  },
  {
    icon: <Layers className="w-6 h-6 text-pink-400" />,
    title: "Mint Evidence",
    desc: "Event becomes mintable as ERC-1155 editions or ERC-721 master + soulbound badges.",
    code: "mint(ERC1155, participants)"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-6 h-6 text-primary" />
            <span className="font-display font-bold tracking-tight">Synchronicity</span>
          </div>
          <div className="flex gap-4">
            <button className="text-sm text-muted-foreground hover:text-white transition-colors">Documentation</button>
            <button className="text-sm bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full hover:bg-primary/20 transition-all">
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              EAS Offchain Attestations
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Mint cryptographic proof of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 neon-text">shared discovery.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Turn "I was just about to send you that!" into verifiable, mintable on-chain artifacts using sealed envelopes and action commits.
            </p>
            <div className="flex gap-4 pt-4">
              <button className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors">
                Install Extension
              </button>
              <button className="glass-panel px-6 py-3 rounded-lg font-medium hover:bg-white/5 transition-colors">
                Read the Spec
              </button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
            <img 
              src={heroImage} 
              alt="Digital Envelope Concept" 
              className="relative z-10 w-full rounded-2xl border border-white/10 shadow-2xl"
            />
          </motion.div>
        </div>
      </header>

      {/* The Protocol Flow */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-black/40 border-y border-white/5"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">How the story becomes mintable</h2>
            <p className="text-muted-foreground font-mono text-sm max-w-2xl mx-auto">
              Real product mechanics. Not just a metaphor.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="glass-panel p-4 rounded-xl flex-shrink-0">
                  {step.icon}
                </div>
                <div className="flex-1 space-y-2 pt-2">
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
                <div className="md:w-1/2 w-full mt-4 md:mt-0">
                  <div className="code-block text-green-400/90 whitespace-pre-wrap">
                    {step.code}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MVP / First Ship */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">V1: The Cleanest Path</h2>
              <p className="text-muted-foreground">
                We're starting with high-signal, narrow-scope integrations to prove the matcher mechanics with strong evidence only.
              </p>
            </div>
            
            <ul className="space-y-4">
              {[
                "Browser extension + mobile share sheet",
                "Opaque share envelopes & EIP-712 action commits",
                "EAS offchain synchronicity attestations",
                "Optional EAS timestamps for high-value claims",
                "ERC-1155 minting (Strong evidence only)"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm md:text-base">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel p-8 rounded-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl"></div>
            <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-4">Supported Objects (V1)</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <Youtube className="w-6 h-6 text-red-500" />
                <span className="font-medium">YouTube Videos</span>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <Share2 className="w-6 h-6 text-green-500" />
                <span className="font-medium">Spotify Tracks</span>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <Layers className="w-6 h-6 text-blue-500" />
                <span className="font-medium">URLs & Articles</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
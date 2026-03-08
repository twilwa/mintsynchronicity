import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Zap, Clock, ShieldCheck, Share2, Youtube, Fingerprint, Layers, ArrowRight, CheckCircle2, Mail, LogIn, LogOut, Wallet, Gift } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/privy";
import heroImage from "@/assets/images/hero-abstract.png";
import type { SyncEvent } from "@shared/schema";

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

function formatDelta(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function objectTypeIcon(type: string) {
  switch (type) {
    case "youtube": return <Youtube className="w-4 h-4 text-red-500" />;
    case "spotify": return <Share2 className="w-4 h-4 text-green-500" />;
    default: return <Layers className="w-4 h-4 text-blue-500" />;
  }
}

function SyncFeed() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["/api/sync-events"],
    queryFn: async () => {
      const res = await fetch("/api/sync-events");
      if (!res.ok) throw new Error("Failed to load events");
      const json = await res.json();
      if (!Array.isArray(json?.events)) throw new Error("Invalid response");
      return json as { events: SyncEvent[] };
    },
  });

  return (
    <section id="feed" className="py-24 container mx-auto px-6">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">Recently Resolved</h2>
        <p className="text-muted-foreground font-mono text-sm max-w-2xl mx-auto">
          Live feed of verified synchronicity events across the network.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {isError ? (
          <div className="text-center text-muted-foreground py-12">Unable to load events.</div>
        ) : isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-panel rounded-xl p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/5 rounded w-3/4"></div>
                  <div className="h-3 bg-white/5 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))
        ) : data?.events.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">No events yet.</div>
        ) : (
          data?.events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel rounded-xl p-5 hover:bg-white/[0.03] transition-colors group"
              data-testid={`sync-event-${event.id}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                  {objectTypeIcon(event.objectType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm truncate" data-testid={`text-title-${event.id}`}>{event.objectTitle}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex-shrink-0">
                      {event.evidenceClass}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{event.participantA}</span>
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="font-mono">{event.participantB}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right space-y-1">
                  <div className="text-xs font-mono text-muted-foreground">
                    {formatTimeAgo(event.resolvedAt as unknown as string)}
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-xs text-muted-foreground">delta {formatDelta(event.deltaSeconds)}</span>
                    <span className="text-xs font-bold text-primary">{event.score}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const auth = useAuth();

  const authenticated = auth?.authenticated ?? false;
  const ready = auth?.ready ?? false;
  const login = auth?.login ?? (() => {});
  const logout = auth?.logout ?? (async () => {});

  const { data: countData } = useQuery({
    queryKey: ["/api/waitlist/count"],
    queryFn: async () => {
      const res = await fetch("/api/waitlist/count");
      return res.json() as Promise<{ count: number }>;
    },
  });

  const joinWaitlist = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok && res.status !== 200) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      setSubmitted(true);
      setEmail("");
    },
  });

  const privyActive = auth !== null;

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-6 h-6 text-primary" />
            <span className="font-display font-bold tracking-tight" data-testid="text-brand-name">Synchronicity</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-white transition-colors hidden sm:block" data-testid="link-docs">How It Works</a>
            <a href="#feed" className="text-sm text-muted-foreground hover:text-white transition-colors hidden sm:block" data-testid="link-feed">Feed</a>
            {privyActive && ready ? (
              authenticated ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
                    <Gift className="w-3 h-3" />
                    <span>$1.00 gas credit</span>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center gap-1.5"
                    data-testid="button-logout"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => login()}
                  className="text-sm bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full hover:bg-primary/20 transition-all flex items-center gap-1.5"
                  data-testid="button-login"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
              )
            ) : (
              <a href="#waitlist" className="text-sm bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full hover:bg-primary/20 transition-all" data-testid="link-join">
                Join Waitlist
              </a>
            )}
          </div>
        </div>
      </nav>

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

            {privyActive && authenticated ? (
              <div className="glass-panel p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-primary" />
                  <span className="font-medium">Wallet Connected</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Gift className="w-4 h-4 text-green-400" />
                  <span>You have <span className="text-green-400 font-semibold">$1.00</span> in gas credits to get started.</span>
                </div>
                <p className="text-xs text-muted-foreground">Gas credits cover your first attestations and minting transactions. No crypto needed to begin.</p>
              </div>
            ) : (
              <div className="flex gap-4 pt-4">
                {privyActive ? (
                  <button
                    onClick={() => login()}
                    className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors inline-flex items-center gap-2"
                    data-testid="button-hero-login"
                  >
                    <Wallet className="w-4 h-4" />
                    Connect & Get $1.00 Gas
                  </button>
                ) : (
                  <a href="#waitlist" className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors inline-flex items-center gap-2" data-testid="button-hero-cta">
                    Get Early Access <ArrowRight className="w-4 h-4" />
                  </a>
                )}
                <a href="#how-it-works" className="glass-panel px-6 py-3 rounded-lg font-medium hover:bg-white/5 transition-colors" data-testid="button-hero-spec">
                  Read the Spec
                </a>
              </div>
            )}
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

      <section id="how-it-works" className="py-24 relative">
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
                data-testid={`step-item-${index}`}
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

      <SyncFeed />

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
                <li key={i} className="flex items-center gap-3 text-sm md:text-base" data-testid={`feature-item-${i}`}>
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
              <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors" data-testid="card-youtube">
                <Youtube className="w-6 h-6 text-red-500" />
                <span className="font-medium">YouTube Videos</span>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors" data-testid="card-spotify">
                <Share2 className="w-6 h-6 text-green-500" />
                <span className="font-medium">Spotify Tracks</span>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors" data-testid="card-urls">
                <Layers className="w-6 h-6 text-blue-500" />
                <span className="font-medium">URLs & Articles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="waitlist" className="py-24 relative">
        <div className="absolute inset-0 bg-black/40 border-y border-white/5"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Ship is coming</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Join the waitlist to get early access to the browser extension, mobile share sheet, and minting tools.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 rounded-2xl flex flex-col items-center gap-4"
                data-testid="status-waitlist-success"
              >
                <CheckCircle2 className="w-12 h-12 text-green-400" />
                <p className="text-lg font-semibold">You're on the list.</p>
                <p className="text-muted-foreground text-sm">We'll notify you when access opens up.</p>
              </motion.div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) joinWaitlist.mutate(email.trim());
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                data-testid="form-waitlist"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    data-testid="input-email"
                  />
                </div>
                <button
                  type="submit"
                  disabled={joinWaitlist.isPending}
                  className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  data-testid="button-submit-waitlist"
                >
                  {joinWaitlist.isPending ? "Joining..." : "Join Waitlist"}
                </button>
              </form>
            )}

            {joinWaitlist.isError && (
              <p className="text-red-400 text-sm" data-testid="text-waitlist-error">
                {joinWaitlist.error?.message || "Something went wrong. Please try again."}
              </p>
            )}

            {countData && countData.count > 0 && (
              <p className="text-muted-foreground text-sm font-mono" data-testid="text-waitlist-count">
                {countData.count} {countData.count === 1 ? "person" : "people"} on the waitlist
              </p>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
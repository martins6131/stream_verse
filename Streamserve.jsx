import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * StreamVerse – Single-file React app
 * Features
 * - Stream movies, music videos, and live sports (sample, royalty‑free sources)
 * - Play a built‑in browser game (Pong) with keyboard controls
 * - Smooth in-page navigation with animated section transitions
 * - Responsive grid layout, dark theme, tasteful micro‑interactions
 * - No external state management or backend required
 *
 * Notes
 * - Replace sample video URLs with your own CDN or streaming URLs.
 * - Works out of the box in frameworks like Vite, CRA, Next.js (as a client component).
 * - Tailwind is used for styling. Ensure Tailwind is enabled in your build.
 */

// -----------------------------
// Sample media (royalty‑free)
// -----------------------------
const MOVIES = [
  {
    id: "m1",
    title: "Big Buck Bunny (HD)",
    year: 2008,
    duration: "9:56",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217",
  },
  {
    id: "m2",
    title: "Sintel (HD)",
    year: 2010,
    duration: "14:48",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    poster: "https://durian.blender.org/wp-content/uploads/2010/05/sintel_poster.png",
  },
  {
    id: "m3",
    title: "Tears of Steel (4K)",
    year: 2012,
    duration: "12:14",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    poster: "https://mango.blender.org/wp-content/uploads/2013/05/TOS_poster_wallpaper_05.jpg",
  },
];

const MUSIC_VIDEOS = [
  {
    id: "mv1",
    title: "Elephants Dream (Music Edit)",
    year: 2006,
    duration: "10:52",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster: "https://orange.blender.org/wp-content/themes/orange/images/gallery/od_poster.jpg",
  },
  {
    id: "mv2",
    title: "For Bigger Joyrides (Short)",
    year: 2013,
    duration: "0:15",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    poster: "https://i.imgur.com/3t2o5lE.jpeg",
  },
];

const SPORTS = [
  {
    id: "sp1",
    title: "Parkour Showcase (Demo Stream)",
    year: 2017,
    duration: "3:30",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    poster: "https://i.imgur.com/9S9Qf5F.jpeg",
  },
  {
    id: "sp2",
    title: "Cycling Highlights (Demo Stream)",
    year: 2017,
    duration: "1:00",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "https://i.imgur.com/Kl4D0m5.jpeg",
  },
];

// -----------------------------
// Utility components
// -----------------------------
const Section = ({ id, children, className = "" }) => (
  <section id={id} className={`min-h-screen scroll-mt-20 py-16 ${className}`}>
    {children}
  </section>
);

const Chip = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-gray-700/50 px-3 py-1 text-xs font-medium text-gray-300">
    {children}
  </span>
);

const FadeIn = ({ delay = 0, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

// -----------------------------
// Video Card & Player
// -----------------------------
function MediaCard({ item, onPlay }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onPlay(item)}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-0 text-left shadow-lg"
    >
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={item.poster}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex items-center justify-between gap-2 p-4">
        <div>
          <h4 className="line-clamp-1 font-semibold text-white">{item.title}</h4>
          <p className="mt-0.5 text-xs text-gray-400">{item.year} • {item.duration}</p>
        </div>
        <Chip>Play</Chip>
      </div>
    </motion.button>
  );
}

function MediaGrid({ items, onPlay }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((it) => (
        <MediaCard key={it.id} item={it} onPlay={onPlay} />
      ))}
    </div>
  );
}

function VideoPlayer({ source, title, poster }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Auto‑play on source change (if allowed by browser policies)
    const play = async () => {
      try { await el.play(); } catch {}
    };
    play();
  }, [source]);

  return (
    <div className="sticky top-24">
      <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
        <video
          ref={ref}
          key={source}
          controls
          playsInline
          poster={poster}
          className="aspect-video w-full bg-black"
          src={source}
        />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <Chip>HD Stream</Chip>
      </div>
    </div>
  );
}

// -----------------------------
// Built‑in playable game (Pong)
// -----------------------------
function PongGame({ running }) {
  const canvasRef = useRef(null);
  const animRef = useRef(0);
  const [score, setScore] = useState(0);

  const state = useRef({
    ball: { x: 200, y: 120, vx: 3, vy: 2, r: 7 },
    paddle: { x: 160, y: 220, w: 80, h: 12, speed: 6 },
    keys: { left: false, right: false },
    over: false,
  });

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") state.current.keys.left = e.type === "keydown";
      if (e.key === "ArrowRight") state.current.keys.right = e.type === "keydown";
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;

    const W = c.width;
    const H = c.height;

    const loop = () => {
      const s = state.current;
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "#2a2a2a";
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Update paddle
      if (s.keys.left) s.paddle.x -= s.paddle.speed;
      if (s.keys.right) s.paddle.x += s.paddle.speed;
      s.paddle.x = Math.max(0, Math.min(W - s.paddle.w, s.paddle.x));

      // Draw paddle
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(s.paddle.x, s.paddle.y, s.paddle.w, s.paddle.h);

      // Update ball
      s.ball.x += s.ball.vx;
      s.ball.y += s.ball.vy;

      // Wall collisions
      if (s.ball.x < s.ball.r || s.ball.x > W - s.ball.r) s.ball.vx *= -1;
      if (s.ball.y < s.ball.r) s.ball.vy *= -1;

      // Paddle collision
      if (
        s.ball.y + s.ball.r >= s.paddle.y &&
        s.ball.x > s.paddle.x &&
        s.ball.x < s.paddle.x + s.paddle.w &&
        s.ball.vy > 0
      ) {
        s.ball.vy *= -1;
        const hit = (s.ball.x - (s.paddle.x + s.paddle.w / 2)) / (s.paddle.w / 2);
        s.ball.vx = Math.max(-5, Math.min(5, s.ball.vx + hit * 2));
        setScore((n) => n + 1);
      }

      // Missed ball
      if (s.ball.y > H + 20) {
        s.over = true;
      }

      // Draw ball
      ctx.beginPath();
      ctx.arc(s.ball.x, s.ball.y, s.ball.r, 0, Math.PI * 2);
      ctx.fill();

      // Score
      ctx.font = "14px Inter, system-ui, sans-serif";
      ctx.fillText(`Score: ${score}`, 10, 18);

      // Game over overlay
      if (s.over) {
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 22px Inter, system-ui, sans-serif";
        ctx.fillText("Game Over", W / 2 - 60, H / 2 - 8);
        ctx.font = "14px Inter, system-ui, sans-serif";
        ctx.fillText("Press R to restart", W / 2 - 68, H / 2 + 18);
      }

      if (!s.over && running) {
        animRef.current = requestAnimationFrame(loop);
      }
    };

    // Reset & start
    const reset = () => {
      state.current = {
        ball: { x: 200, y: 120, vx: 3, vy: 2, r: 7 },
        paddle: { x: 160, y: 220, w: 100, h: 12, speed: 6 },
        keys: { left: false, right: false },
        over: false,
      };
      setScore(0);
      cancelAnimationFrame(animRef.current);
      animRef.current = requestAnimationFrame(loop);
    };

    reset();

    const onR = (e) => {
      if (e.key.toLowerCase() === "r") {
        reset();
      }
    };
    window.addEventListener("keydown", onR);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("keydown", onR);
    };
  }, [running, score]);

  return (
    <div className="space-y-3">
      <canvas
        ref={canvasRef}
        width={400}
        height={240}
        className="mx-auto block rounded-2xl border border-white/10 bg-black shadow-xl"
      />
      <p className="text-center text-sm text-gray-300">
        Use ← → to move. Press <kbd className="rounded bg-white/10 px-1">R</kbd> to restart.
      </p>
    </div>
  );
}

// -----------------------------
// Games UI (choose & play)
// -----------------------------
const GAMES = [
  {
    id: "g1",
    title: "Pong Classic",
    description: "Bounce the ball, rack up points, don’t miss!",
    builtin: true,
  },
  // Example external HTML5 game (replace with your licensed URLs)
  {
    id: "g2",
    title: "External HTML5 Demo",
    description: "Loads in an iframe (supply your own game URL).",
    builtin: false,
    url: "https://play-cdn.html5games.com/Separation/index.html", // replace with your own permitted URL
  },
];

function GamesSection() {
  const [active, setActive] = useState(GAMES[0]);
  const [showPlayer, setShowPlayer] = useState(true);

  useEffect(() => {
    setShowPlayer(true);
  }, [active]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white">Choose a Game</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {GAMES.map((g) => (
            <motion.button
              key={g.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActive(g)}
              className={`rounded-2xl border p-4 text-left transition-colors ${
                active.id === g.id
                  ? "border-white/30 bg-white/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <h4 className="font-medium text-white">{g.title}</h4>
              <p className="mt-1 text-sm text-gray-300">{g.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Now Playing</h3>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/50 p-4">
          {showPlayer && active.builtin ? (
            <PongGame running={true} />
          ) : showPlayer && active.url ? (
            <iframe
              title={active.title}
              src={active.url}
              className="h-[400px] w-full rounded-xl border-0"
              allow="gamepad *; fullscreen"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

// -----------------------------
// Main app
// -----------------------------
export default function StreamVerse() {
  const [current, setCurrent] = useState(MOVIES[0]);
  const [filter, setFilter] = useState("movies");

  const library = useMemo(() => {
    if (filter === "movies") return MOVIES;
    if (filter === "music") return MUSIC_VIDEOS;
    return SPORTS;
  }, [filter]);

  useEffect(() => {
    const onHashLink = (e) => {
      if (e.target instanceof HTMLAnchorElement) {
        const href = e.target.getAttribute("href");
        if (href?.startsWith("#")) {
          e.preventDefault();
          const el = document.querySelector(href);
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    document.addEventListener("click", onHashLink);
    return () => document.removeEventListener("click", onHashLink);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0d12] via-[#0d1117] to-[#0b0d12] text-gray-200">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <a href="#home" className="text-lg font-bold tracking-tight text-white">
            StreamVerse
          </a>
          <nav className="hidden gap-6 sm:flex">
            <a className="hover:text-white/80" href="#library">Library</a>
            <a className="hover:text-white/80" href="#sports">Sports</a>
            <a className="hover:text-white/80" href="#games">Games</a>
          </nav>
          <a
            href="#games"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
          >
            Play Now
          </a>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </header>

      {/* Hero */}
      <Section id="home" className="grid place-items-center">
        <FadeIn>
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-4xl font-extrabold leading-tight text-transparent sm:text-5xl">
              Stream Movies, Music & Sports. <br className="hidden sm:block" />
              Play Games — All in One Place.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-300">
              Your entertainment hub with smooth animated transitions and a modern, responsive design.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#library" className="rounded-2xl border border-white/20 px-5 py-2.5 font-medium hover:bg-white/10">
                Browse Library
              </a>
              <a href="#games" className="rounded-2xl bg-white/90 px-5 py-2.5 font-semibold text-black hover:bg-white">
                Play a Game
              </a>
            </div>
          </div>
        </FadeIn>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.4 }}
          className="absolute bottom-8 text-center text-xs text-gray-400"
        >
          Scroll down
        </motion.div>
      </Section>

      {/* Library */}
      <Section id="library" className="bg-white/0">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 lg:grid-cols-[1.2fr_.8fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">Featured</h2>
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1 text-sm">
                {[
                  { id: "movies", label: "Movies" },
                  { id: "music", label: "Music Videos" },
                  { id: "sports", label: "Sports" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setFilter(t.id)}
                    className={`rounded-xl px-3 py-1.5 ${
                      filter === t.id ? "bg-white text-black" : "text-white/80 hover:bg-white/10"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <MediaGrid
              items={library}
              onPlay={(item) => setCurrent(item)}
            />
          </div>

          <FadeIn delay={0.15}>
            <VideoPlayer
              key={current.id}
              source={current.src}
              poster={current.poster}
              title={current.title}
            />
          </FadeIn>
        </div>
      </Section>

      {/* Sports highlight banner */}
      <Section id="sports" className="bg-gradient-to-b from-white/5 to-transparent">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-[url('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center">
              <div className="bg-black/60 p-8 backdrop-blur-sm sm:p-12">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">Live Sports Demos</h2>
                <p className="mt-2 max-w-2xl text-sm text-gray-200">
                  Swap in your live stream sources to broadcast matches and events.
                </p>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {SPORTS.map((s) => (
                    <MediaCard key={s.id} item={s} onPlay={(it) => setCurrent(it)} />
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* Games */}
      <Section id="games" className="bg-white/0">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-white">Games</h2>
              <Chip>Keyboard Friendly</Chip>
            </div>
            <GamesSection />
          </FadeIn>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/30">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} StreamVerse. copyright @ 2025.</p>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <a href="#home" className="rounded-lg border border-white/10 px-3 py-1 hover:bg-white/10">Back to top</a>
            <span className="text-white/20">•</span>
            <span>Replace demo media with your licensed content.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

type SiteLanguage = "id" | "en";

const root = document.documentElement;
const themeToggle = document.querySelector<HTMLButtonElement>("#theme-toggle");
const languageToggle = document.querySelector<HTMLButtonElement>("#language-toggle");
const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

const copy: Record<SiteLanguage, Record<string, string>> = {
  id: {
    "nav-work": "Karya",
    "nav-limaraya": "Limaraya",
    "nav-about": "Tentang",
    "nav-social": "Sosial",
    "hero-welcome": "Selamat datang di",
    "hero-copy": "Ruang kreatif Bobby Fajar Christian untuk karya digital, musik, seni, game, dan teknologi—rumah bagi Sela serta semesta cerita Limaraya.",
    "hero-sela": "Buka Sela",
    "hero-work": "Lihat karya",
    "platform-status": "Semua tautan album dan lagu memakai",
    "music-kicker": "Pilih platform sekali",
    "music-title": "Mau mendengarkan di mana?",
    "releases-kicker": "Cerita dalam album",
    "releases-title": "Dua album, satu dunia",
    "tracklist-title": "Daftar lagu",
    "album-action": "Putar album di",
  },
  en: {
    "nav-work": "Work",
    "nav-limaraya": "Limaraya",
    "nav-about": "About",
    "nav-social": "Social",
    "hero-welcome": "Welcome to",
    "hero-copy": "Bobby Fajar Christian’s creative space for digital projects, music, art, games, and technology—the home of Sela and Limaraya’s story universe.",
    "hero-sela": "Open Sela",
    "hero-work": "Explore work",
    "platform-status": "All album and song links now use",
    "music-kicker": "Choose a platform once",
    "music-title": "Where would you like to listen?",
    "releases-kicker": "Stories inside the albums",
    "releases-title": "Two albums, one world",
    "tracklist-title": "Tracklist",
    "album-action": "Play album on",
  },
};

const platformIcons: Record<string, string> = {
  Spotify: "/brand-icons/spotify.png",
  "Apple Music": "/brand-icons/apple-music.png",
  YouTube: "/brand-icons/youtube.png",
  "YouTube Music": "/brand-icons/youtube-music.png",
  TIDAL: "/brand-icons/tidal.png",
  Audiomack: "/brand-icons/audiomack.png",
  SoundCloud: "/brand-icons/soundcloud.png",
  "Amazon Music": "/brand-icons/amazon-music.png",
};

function safeRead(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeWrite(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // The current page still honors the selection when storage is unavailable.
  }
}

function setLeadingText(element: HTMLElement, value: string): void {
  const textNode = [...element.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
  if (textNode) textNode.textContent = value;
  else element.textContent = value;
}

function updateThemeControl(): void {
  const dark = root.dataset.theme === "dark";
  const language = root.lang === "en" ? "en" : "id";
  themeToggle?.setAttribute("aria-pressed", String(dark));
  themeToggle?.setAttribute(
    "aria-label",
    language === "id"
      ? dark
        ? "Ganti ke tema terang"
        : "Ganti ke tema gelap"
      : dark
        ? "Switch to light theme"
        : "Switch to dark theme",
  );
  if (themeColor) themeColor.content = dark ? "#101a2b" : "#f3f7ff";
}

function applyLanguage(language: SiteLanguage): void {
  root.lang = language;
  for (const element of document.querySelectorAll<HTMLElement>("[data-i18n]")) {
    const key = element.dataset.i18n;
    const value = key ? copy[language][key] : undefined;
    if (!value) continue;
    setLeadingText(element, value);
  }
  for (const element of document.querySelectorAll<HTMLElement>("[data-id][data-en]")) {
    const value = language === "en" ? element.dataset.en : element.dataset.id;
    if (value) setLeadingText(element, value);
  }

  if (languageToggle) {
    languageToggle.textContent = language === "id" ? "🇮🇩" : "🇬🇧";
    languageToggle.title = language === "id" ? "Bahasa Indonesia" : "English";
    languageToggle.setAttribute(
      "aria-label",
      language === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia",
    );
  }
  document.querySelector("#platform-switcher")?.setAttribute(
    "aria-label",
    language === "en" ? "Choose a music platform" : "Pilih layanan musik",
  );
  updateThemeControl();
}

function searchUrl(platform: string, title: string): string {
  const query = encodeURIComponent(`Limaraya ${title}`);
  switch (platform) {
    case "Apple Music":
      return `https://music.apple.com/id/search?term=${query}`;
    case "YouTube":
      return `https://www.youtube.com/results?search_query=${query}`;
    case "YouTube Music":
      return `https://music.youtube.com/search?q=${query}`;
    case "TIDAL":
      return `https://listen.tidal.com/search?q=${query}`;
    case "Audiomack":
      return `https://audiomack.com/search?q=${query}`;
    case "SoundCloud":
      return `https://soundcloud.com/search?q=${query}`;
    case "Amazon Music":
      return `https://music.amazon.com/search/${query}`;
    default:
      return `https://open.spotify.com/search/${query}`;
  }
}

function setPlatform(platform: string): void {
  const buttons = [...document.querySelectorAll<HTMLButtonElement>("[data-platform]")];
  if (!buttons.some((button) => button.dataset.platform === platform)) return;
  for (const button of buttons) {
    button.setAttribute("aria-pressed", String(button.dataset.platform === platform));
  }

  for (const link of document.querySelectorAll<HTMLAnchorElement>("[data-album-links]")) {
    let exactLinks: Record<string, string> = {};
    try {
      exactLinks = JSON.parse(link.dataset.albumLinks ?? "{}") as Record<string, string>;
    } catch {
      exactLinks = {};
    }
    const title = link.dataset.albumTitle ?? "";
    link.href = exactLinks[platform] ?? searchUrl(platform, title);
    const platformName = link.querySelector<HTMLElement>("[data-album-platform]");
    if (platformName) platformName.textContent = platform;
    const icon = link.querySelector<HTMLImageElement>("[data-album-platform-icon] img");
    if (icon && platformIcons[platform]) icon.src = platformIcons[platform];
    link.setAttribute(
      "aria-label",
      root.lang === "en" ? `Open ${title} on ${platform}` : `Buka album ${title} di ${platform}`,
    );
  }

  for (const link of document.querySelectorAll<HTMLAnchorElement>("[data-track-title]")) {
    const title = link.dataset.trackTitle ?? "";
    link.href = searchUrl(platform, title);
    link.setAttribute(
      "aria-label",
      root.lang === "en" ? `Find ${title} by Limaraya on ${platform}` : `Cari lagu ${title} dari Limaraya di ${platform}`,
    );
  }

  const status = document.querySelector<HTMLElement>("#platform-status");
  if (status) status.textContent = `${copy[root.lang === "en" ? "en" : "id"]["platform-status"]} ${platform}.`;
  safeWrite("limaraya-platform", platform);
}

const savedTheme = safeRead("bobby-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
root.dataset.theme = savedTheme === "dark" || savedTheme === "light"
  ? savedTheme
  : prefersDark
    ? "dark"
    : "light";
themeToggle?.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  safeWrite("bobby-theme", next);
  updateThemeControl();
});
updateThemeControl();

const storedLanguage = safeRead("bobby-language");
const language: SiteLanguage = storedLanguage === "en" ? "en" : "id";
applyLanguage(language);
languageToggle?.addEventListener("click", () => {
  const next: SiteLanguage = root.lang === "id" ? "en" : "id";
  safeWrite("bobby-language", next);
  applyLanguage(next);
});

const storedPlatform = safeRead("limaraya-platform");
const initialPlatform = storedPlatform && platformIcons[storedPlatform] ? storedPlatform : "Spotify";
setPlatform(initialPlatform);
for (const button of document.querySelectorAll<HTMLButtonElement>("[data-platform]")) {
  button.addEventListener("click", () => {
    if (button.dataset.platform) setPlatform(button.dataset.platform);
  });
}

document.querySelectorAll<HTMLDetailsElement>("[data-lazy-player]").forEach((player) => {
  player.addEventListener("toggle", () => {
    if (!player.open) return;
    const frame = player.querySelector<HTMLIFrameElement>("iframe[data-src]");
    const source = frame?.dataset.src;
    if (frame && source && !frame.hasAttribute("src")) frame.src = source;
  });
});

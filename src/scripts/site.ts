const themeToggle = document.querySelector<HTMLButtonElement>("#theme-toggle");
const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

function applyTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  themeToggle?.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle?.setAttribute("aria-label", theme === "dark" ? "Ganti ke tema terang" : "Ganti ke tema gelap");
  if (themeColor) themeColor.content = theme === "dark" ? "#111111" : "#f7f7f5";
}

if (themeToggle) {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try {
      localStorage.setItem("bobby-space-theme", nextTheme);
    } catch {
      // The theme still changes for this page view if storage is unavailable.
    }
  });
}
